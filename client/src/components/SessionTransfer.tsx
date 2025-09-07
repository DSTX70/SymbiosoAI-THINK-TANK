import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, ArrowRight, Users, FileText } from 'lucide-react';
import type { SessionTransfer } from '@shared/schema';

interface SessionTransferProps {
  currentMode: string;
  onTransfer: (sessionId: string) => void;
  disabled?: boolean;
}

export function SessionTransfer({ currentMode, onTransfer, disabled = false }: SessionTransferProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionTransfer | null>(null);

  // Fetch transferable sessions excluding current mode
  const { data: sessions = [], isLoading } = useQuery<SessionTransfer[]>({
    queryKey: ['/api/sessions/transferable', currentMode],
    queryFn: async () => {
      const response = await fetch(`/api/sessions/transferable?exclude_mode=${currentMode}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transferable sessions');
      }
      return response.json();
    },
    enabled: isOpen
  });

  const handleTransfer = () => {
    if (selectedSession) {
      onTransfer(selectedSession.sessionId);
      setIsOpen(false);
      setSelectedSession(null);
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'simple': return 'bg-blue-100 text-blue-800';
      case 'guided': return 'bg-green-100 text-green-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2"
          disabled={disabled}
          data-testid="button-transfer-session"
        >
          <ArrowRight className="w-4 h-4" />
          Continue Previous Debate
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh]" data-testid="dialog-session-transfer">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Continue Previous Debate in {currentMode.charAt(0).toUpperCase() + currentMode.slice(1)} Mode
          </DialogTitle>
          <DialogDescription>
            Select a previous debate session to continue with enhanced {currentMode} mode features.
            The new debate will build upon the previous consensus, dissents, and discussion history.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session List */}
          <div>
            <h3 className="font-semibold mb-3" data-testid="text-available-sessions">Available Sessions</h3>
            <ScrollArea className="h-[400px] pr-4">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-100 rounded animate-pulse" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 text-gray-500" data-testid="text-no-sessions">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No previous debates available for transfer</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <Card 
                      key={session.sessionId}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedSession?.sessionId === session.sessionId 
                          ? 'ring-2 ring-primary shadow-md' 
                          : ''
                      }`}
                      onClick={() => setSelectedSession(session)}
                      data-testid={`card-session-${session.sessionId}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-sm line-clamp-2">
                            {session.title}
                          </CardTitle>
                          <Badge 
                            variant="secondary" 
                            className={getModeColor(session.mode)}
                          >
                            {session.mode}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {session.prompt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(session.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {session.dissents.length + 1} perspectives
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Session Preview */}
          <div>
            <h3 className="font-semibold mb-3" data-testid="text-session-preview">Session Preview</h3>
            {selectedSession ? (
              <Card className="h-[400px]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{selectedSession.title}</CardTitle>
                    <Badge variant="secondary" className={getModeColor(selectedSession.mode)}>
                      {selectedSession.mode}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {selectedSession.prompt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[280px]">
                    <div className="space-y-4">
                      {/* Consensus */}
                      <div>
                        <h4 className="font-medium text-sm mb-2 text-green-700" data-testid="text-consensus-title">
                          Previous Consensus
                        </h4>
                        <p className="text-xs text-gray-600 bg-green-50 p-3 rounded">
                          {selectedSession.consensus || 'No consensus reached'}
                        </p>
                      </div>

                      {/* Dissents */}
                      {selectedSession.dissents.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-orange-700" data-testid="text-dissents-title">
                            Dissenting Views ({selectedSession.dissents.length})
                          </h4>
                          <div className="space-y-2">
                            {selectedSession.dissents.map((dissent, index) => (
                              <div key={index} className="text-xs bg-orange-50 p-2 rounded">
                                <p className="font-medium">{dissent.position}</p>
                                {dissent.reasoning && (
                                  <p className="text-gray-600 mt-1">{dissent.reasoning}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Unresolved Questions */}
                      {selectedSession.unresolved.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm mb-2 text-blue-700" data-testid="text-unresolved-title">
                            Unresolved Questions ({selectedSession.unresolved.length})
                          </h4>
                          <ul className="space-y-1">
                            {selectedSession.unresolved.map((question, index) => (
                              <li key={index} className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                                {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <div className="h-[400px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a session to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setIsOpen(false)} data-testid="button-cancel-transfer">
            Cancel
          </Button>
          <Button 
            onClick={handleTransfer} 
            disabled={!selectedSession}
            className="gap-2"
            data-testid="button-confirm-transfer"
          >
            <ArrowRight className="w-4 h-4" />
            Continue This Debate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}