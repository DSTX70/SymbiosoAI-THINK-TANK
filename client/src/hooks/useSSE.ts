import { useEffect, useRef, useState, useCallback } from 'react';

interface SSEOptions {
  reconnectAttempts?: number;
  reconnectDelay?: number;
  timeout?: number;
  onEvent?: (event: string, data: any) => void;
  onError?: (error: Event) => void;
  onReconnect?: (attempt: number) => void;
}

interface SSEState {
  progress: number;
  status: 'idle' | 'connecting' | 'running' | 'completed' | 'failed' | 'reconnecting';
  data: any;
  error: string | null;
  reconnectAttempt: number;
  isConnected: boolean;
}

export function useSSE(url: string, options: SSEOptions = {}) {
  const {
    reconnectAttempts = 3,
    reconnectDelay = 2000,
    timeout = 30000,
    onEvent,
    onError,
    onReconnect
  } = options;

  const [state, setState] = useState<SSEState>({
    progress: 0,
    status: 'idle',
    data: null,
    error: null,
    reconnectAttempt: 0,
    isConnected: false
  });

  const esRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const isCancelledRef = useRef(false);

  const updateState = useCallback((updates: Partial<SSEState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const cleanup = useCallback(() => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback((isReconnect = false) => {
    if (isCancelledRef.current || !url) return;

    cleanup();

    if (isReconnect) {
      const currentAttempt = reconnectAttemptRef.current + 1;
      reconnectAttemptRef.current = currentAttempt;
      updateState({ 
        status: 'reconnecting',
        error: null,
        reconnectAttempt: currentAttempt
      });
      onReconnect?.(currentAttempt);
    } else {
      reconnectAttemptRef.current = 0;
      updateState({ 
        status: 'connecting',
        error: null,
        reconnectAttempt: 0
      });
    }

    const es = new EventSource(url);
    esRef.current = es;

    // Connection timeout
    connectionTimeoutRef.current = setTimeout(() => {
      if (es.readyState === EventSource.CONNECTING) {
        es.close();
        updateState({
          status: 'failed',
          error: 'Connection timeout',
          isConnected: false
        });
      }
    }, timeout);

    // Connection opened
    es.onopen = () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
        connectionTimeoutRef.current = null;
      }
      
      updateState({
        status: 'running',
        isConnected: true,
        error: null,
        reconnectAttempt: 0
      });
    };

    // Handle standard progress events
    es.addEventListener('progress', (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        updateState(prev => ({ 
          ...prev,
          progress: typeof payload.progress === 'number' ? payload.progress : prev.progress 
        }));
        onEvent?.('progress', payload);
      } catch (error) {
        console.warn('Failed to parse progress event data:', error);
      }
    });

    // Handle completion events
    es.addEventListener('completed', (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        updateState({
          status: 'completed',
          data: payload,
          progress: 100,
          isConnected: false
        });
        onEvent?.('completed', payload);
      } catch (error) {
        console.warn('Failed to parse completed event data:', error);
        updateState({
          status: 'completed',
          data: e.data,
          progress: 100,
          isConnected: false
        });
      }
      es.close();
    });

    // Handle failure events
    es.addEventListener('failed', (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        updateState({
          status: 'failed',
          error: payload.error || 'Operation failed',
          isConnected: false
        });
        onEvent?.('failed', payload);
      } catch (error) {
        updateState({
          status: 'failed',
          error: 'Operation failed',
          isConnected: false
        });
      }
      es.close();
    });

    // Handle custom events (debates, updates, notifications, etc.)
    ['debate_update', 'agent_response', 'consensus_reached', 'error', 'warning', 'info'].forEach(eventType => {
      es.addEventListener(eventType, (e: MessageEvent) => {
        try {
          const payload = JSON.parse(e.data);
          onEvent?.(eventType, payload);
        } catch (error) {
          console.warn(`Failed to parse ${eventType} event data:`, error);
          onEvent?.(eventType, { raw: e.data });
        }
      });
    });

    // Handle connection errors and reconnection
    es.onerror = (error: Event) => {
      console.warn('SSE connection error:', error);
      onError?.(error);
      
      const currentAttempt = reconnectAttemptRef.current;
      const shouldReconnect = currentAttempt < reconnectAttempts && 
                             !isCancelledRef.current;

      if (shouldReconnect) {
        updateState(prev => ({
          ...prev,
          isConnected: false
        }));

        reconnectTimeoutRef.current = setTimeout(() => {
          connect(true);
        }, reconnectDelay * Math.pow(2, currentAttempt)); // Exponential backoff
      } else {
        updateState(prev => ({
          ...prev,
          status: 'failed',
          error: 'Connection failed after multiple attempts',
          isConnected: false
        }));
      }
    };
  }, [url, timeout, reconnectAttempts, reconnectDelay, onEvent, onError, onReconnect, cleanup, updateState]);

  const cancel = useCallback(() => {
    isCancelledRef.current = true;
    cleanup();
    updateState({
      status: 'idle',
      isConnected: false,
      error: null
    });
  }, [cleanup, updateState]);

  const retry = useCallback(() => {
    isCancelledRef.current = false;
    reconnectAttemptRef.current = 0;
    updateState(prev => ({
      ...prev,
      reconnectAttempt: 0,
      error: null
    }));
    connect(false);
  }, [connect, updateState]);

  useEffect(() => {
    if (!url) {
      updateState({ status: 'idle' });
      return;
    }

    isCancelledRef.current = false;
    connect(false);

    return () => {
      isCancelledRef.current = true;
      cleanup();
    };
  }, [url, connect, cleanup, updateState]);

  return {
    ...state,
    cancel,
    retry,
    isConnecting: state.status === 'connecting',
    isReconnecting: state.status === 'reconnecting',
    canRetry: state.status === 'failed' && !isCancelledRef.current
  };
}

// Enhanced hook for debate-specific SSE events
export function useDebateSSE(url: string, options: SSEOptions = {}) {
  const [debateState, setDebateState] = useState({
    activeAgents: [] as string[],
    currentRound: 0,
    totalRounds: 0,
    consensusLevel: 0,
    lastAgentResponse: null as any,
    debatePhase: 'initializing' as 'initializing' | 'debating' | 'consensus' | 'complete'
  });

  const enhancedOptions = {
    ...options,
    onEvent: (event: string, data: any) => {
      options.onEvent?.(event, data);
      
      // Handle debate-specific events
      switch (event) {
        case 'debate_update':
          setDebateState(prev => ({
            ...prev,
            activeAgents: data.activeAgents || prev.activeAgents,
            currentRound: data.currentRound || prev.currentRound,
            totalRounds: data.totalRounds || prev.totalRounds,
            consensusLevel: data.consensusLevel || prev.consensusLevel,
            debatePhase: data.phase || prev.debatePhase
          }));
          break;
        case 'agent_response':
          setDebateState(prev => ({
            ...prev,
            lastAgentResponse: data
          }));
          break;
        case 'consensus_reached':
          setDebateState(prev => ({
            ...prev,
            debatePhase: 'complete',
            consensusLevel: 100
          }));
          break;
      }
    }
  };

  const sseResult = useSSE(url, enhancedOptions);

  return {
    ...sseResult,
    debate: debateState
  };
}