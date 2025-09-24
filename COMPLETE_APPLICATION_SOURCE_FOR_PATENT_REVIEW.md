# SymbiosoAi ThinkTank - Complete Application Source Code
# Patent Review Package

**Application**: SymbiosoAi ThinkTank - Multi-Agent AI Debate Platform  
**Generated**: September 24, 2025  
**Purpose**: Patent application and legal review  

## Table of Contents

1. [Core Architecture Overview](#core-architecture-overview)
2. [Database Schema & Data Models](#database-schema--data-models) 
3. [Multi-Agent AI System](#multi-agent-ai-system)
4. [Real-time Streaming Architecture](#real-time-streaming-architecture)
5. [Document Upload & Analysis](#document-upload--analysis)
6. [Frontend User Interface](#frontend-user-interface)
7. [Authentication & Security](#authentication--security)
8. [Enterprise Features](#enterprise-features)
9. [Testing Infrastructure](#testing-infrastructure)
10. [Configuration & Build System](#configuration--build-system)

---

## Core Architecture Overview

### Project Structure
```
SymbiosoAi ThinkTank/
├── client/                 # React frontend application
├── server/                 # Express.js backend services  
├── shared/                 # Shared data schemas and types
├── tests/                  # Comprehensive test suite
├── docs/                   # Technical documentation
└── scripts/                # Build and deployment automation
```

### Key Innovation Areas
- **Multi-Agent AI Orchestration**: Coordinated debates between specialized AI agents
- **Real-time Streaming**: Server-sent events for live AI conversations
- **Document Integration**: Secure upload and AI analysis of user documents
- **Tiered Complexity**: Progressive analysis modes (Simple, Guided, Expert)
- **Enterprise Collaboration**: Real-time workspace sharing and session management
- **Template Marketplace**: Reusable AI analysis templates with discovery system

---

## Database Schema & Data Models

**File: `shared/schema.ts`** (3,203 lines - Complete Data Architecture)

This file contains the complete intellectual property for data modeling and enterprise architecture.

```typescript
// CORE USER MANAGEMENT AND ENTERPRISE FEATURES
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  role: varchar("role").notNull().default("user"),
  preferences: jsonb("preferences").default({
    theme: "light",
    default_model: "gpt-5",
    default_temperature: 0.7
  }),
  subscription: jsonb("subscription").default({
    plan: "free",
    usage_count: 0,
    monthly_limit: 10
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

// MULTI-AGENT ANALYSIS SESSIONS - Core IP
export const analysisSessions = pgTable("analysis_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  prompt: text("prompt").notNull(),
  mode: text("mode").notNull(),
  settings: jsonb("settings"),
  results: jsonb("results"),
  debateHistory: jsonb("debate_history"),
  brainstormResults: jsonb("brainstorm_results"),
  userId: varchar("user_id"),
  workspaceId: varchar("workspace_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// REAL-TIME WORKSPACE COLLABORATION
export const workspaces = pgTable("workspaces", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sessionCode: varchar("session_code", { length: 8 }).unique().notNull(),
  ownerId: varchar("owner_id").notNull(),
  settings: jsonb("settings").default({}),
});

export const workspaceEvents = pgTable("workspace_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workspaceId: varchar("workspace_id").notNull(),
  eventType: varchar("event_type").notNull(),
  eventData: jsonb("event_data").notNull(),
  sequenceNumber: integer("sequence_number").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

---

## Multi-Agent AI System

**File: `server/ai-service.ts`** (Core AI Orchestration Engine)

This file contains the primary intellectual property for multi-agent AI coordination.

```typescript
// CORE AI AGENT PERSONALITIES
export const AI_AGENTS: AIAgent[] = [
  {
    role: "Analyst",
    perspective: "Data-driven analytical perspective",
    systemPrompt: "You are an analytical AI that focuses on data, evidence, and logical reasoning."
  },
  {
    role: "Critic", 
    perspective: "Critical evaluation and alternative viewpoints",
    systemPrompt: "You are a critical thinking AI that identifies potential flaws and alternative perspectives."
  },
  {
    role: "Synthesizer",
    perspective: "Integration and consensus building", 
    systemPrompt: "You are a synthesis AI that finds common ground and builds toward consensus."
  }
];

// MULTI-AGENT DEBATE ORCHESTRATION
export async function runMultiAgentDebate(
  prompt: string,
  settings: any
): Promise<{
  consensus: string;
  dissents: Array<{ position: string; reasoning?: string }>;
  unresolved: string[];
  debateHistory?: Array<{ agent: string; response: string }>;
}> {
  const agents = AI_AGENTS;
  const rounds = settings.turns || 1;
  let debate_history: Array<{ agent: string; response: string }> = [];

  // DOCUMENT INTEGRATION
  let documentContext = "";
  if (settings.attached_document) {
    const response = await fetch(settings.attached_document.fileUrl);
    if (response.ok) {
      const documentContent = await response.text();
      documentContext = `ATTACHED DOCUMENT: ${documentContent}`;
    }
  }
  
  // RUN DEBATE ROUNDS
  for (let round = 0; round < rounds; round++) {
    for (const agent of agents) {
      const context = debate_history.length > 0 
        ? `Previous discussion: ${debate_history.map(h => `${h.agent}: ${h.response}`).join('\n')}`
        : '';
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `${agent.systemPrompt}\n${context}\n${documentContext}`
          },
          {
            role: "user", 
            content: `Round ${round + 1}: ${prompt}`
          }
        ]
      });

      debate_history.push({
        agent: agent.role,
        response: response.choices[0].message.content || ""
      });
    }
  }

  // SYNTHESIS ENGINE
  const synthesis = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "Synthesize the debate into structured JSON results."
      },
      {
        role: "user",
        content: `Synthesize: ${debate_history.map(h => `${h.agent}: ${h.response}`).join('\n')}`
      }
    ]
  });

  const result = JSON.parse(synthesis.choices[0].message.content || "{}");
  return {
    consensus: result.consensus,
    dissents: result.dissents || [],
    unresolved: result.unresolved || [],
    debateHistory: debate_history
  };
}
```

---

## Real-time Streaming Architecture

**File: `server/streaming.ts`** (Live AI Debate Streaming)

Server-Sent Events architecture for real-time AI agent conversations.

```typescript
// SSE STREAMING SETUP
function setupSSE(res: Response) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
}

function sendSSE(res: Response, event: string, data: any) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

// STREAMING DEBATE ORCHESTRATION
export function registerStreamingRoutes(app: Express) {
  app.get('/api/stream-debate', async (req: Request, res: Response) => {
    setupSSE(res);
    
    const agents = getAgentConfiguration(req.query.settings);
    
    // Stream agent responses in real-time
    for (const agent of agents) {
      sendSSE(res, 'agent_start', { agent: agent.role });
      
      const response = await generateAgentResponse(agent, req.query.prompt);
      
      sendSSE(res, 'agent_response', { 
        agent: agent.role, 
        response: response
      });
    }
    
    sendSSE(res, 'complete', { timestamp: Date.now() });
  });
}
```

---

## Document Upload & Analysis

**File: `client/src/components/DocumentUploader.tsx`**

Secure document upload with AI integration across all analysis modes.

```typescript
export function DocumentUploader({
  onFileUpload,
  maxFileSize = 10 * 1024 * 1024,
  acceptedTypes = [".pdf", ".docx", ".doc", ".txt", ".md"]
}: DocumentUploaderProps) {
  
  // SECURE UPLOAD WORKFLOW
  const handleFileSelect = async (file: File) => {
    // 1. Get pre-signed upload URL
    const uploadResponse = await fetch('/api/documents/upload', {
      method: 'POST',
      body: JSON.stringify({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type
      })
    });
    
    const { uploadURL, documentId } = await uploadResponse.json();
    
    // 2. Upload directly to object storage
    await fetch(uploadURL, {
      method: 'PUT',
      body: file,
      headers: { 'Content-Type': file.type }
    });
    
    // 3. Finalize with access controls
    const finalizeResponse = await fetch('/api/documents/finalize', {
      method: 'POST',
      body: JSON.stringify({ documentId, uploadURL })
    });
    
    const { documentUrl } = await finalizeResponse.json();
    
    onFileUpload?.({
      fileName: file.name,
      fileUrl: documentUrl,
      fileSize: file.size
    });
  };
}
```

---

## Frontend User Interface

**File: `client/src/pages/simple.tsx`** (Simple Mode Analysis Interface)

Progressive complexity interface with document integration.

```typescript
export default function SimplePage() {
  const [prompt, setPrompt] = useState("");
  const [attachedDocument, setAttachedDocument] = useState(null);
  const [results, setResults] = useState<ThinkResponse | null>(null);

  const handleSubmit = () => {
    const requestData: ThinkRequest = {
      prompt: prompt.trim(),
      mode: "simple",
      attached_document: attachedDocument,
    };
    thinkMutation.mutate(requestData);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Collaborative Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your challenge for AI analysis..."
            />
            
            {/* Document Upload Integration */}
            <DocumentUploader
              onFileUpload={(fileInfo) => setAttachedDocument(fileInfo)}
              onFileRemove={() => setAttachedDocument(null)}
            />
            
            <Button onClick={handleSubmit}>
              Start Collaborative Thinking
            </Button>
          </CardContent>
        </Card>
        
        {/* Results Display */}
        <ResultsSection
          consensus={results?.consensus}
          dissents={results?.dissents}
          unresolved={results?.unresolved}
        />
      </main>
    </div>
  );
}
```

**File: `client/src/App.tsx`** (Main Application Router)

```typescript
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TutorialSystem>
          <Router />
        </TutorialSystem>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/simple" component={SimplePage} />
      <Route path="/guided" component={GuidedPage} />
      <Route path="/expert" component={ExpertPage} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/marketplace" component={MarketplacePage} />
      <Route path="/billing" component={BillingPage} />
    </Switch>
  );
}
```

---

## Authentication & Security

**File: `server/routes.ts`** (Main API Routes)

Enterprise-grade authentication and security middleware.

```typescript
// DEMO LOGIN FOR TESTING
app.post('/api/demo-login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'demo' && password === 'demo123') {
    const demoUser = {
      id: 'demo-user-12345',
      email: 'demo@example.com',
      role: 'user'
    };
    
    await storage.upsertUser(demoUser);
    req.logIn(demoUser, () => {
      res.json({ success: true });
    });
  }
});

// SECURE DOCUMENT UPLOAD ENDPOINTS
app.post('/api/documents/upload', requireAuth, async (req, res) => {
  const { fileName, fileSize, fileType } = req.body;
  
  // Validate file constraints
  if (fileSize > 10 * 1024 * 1024) {
    return res.status(400).json({ error: "File too large" });
  }
  
  const objectStorageService = new ObjectStorageService();
  const uploadURL = await objectStorageService.getObjectEntityUploadURL();
  const documentId = randomUUID();
  
  res.json({ uploadURL, documentId });
});

app.post('/api/documents/finalize', requireAuth, async (req, res) => {
  const { documentId, uploadURL } = req.body;
  
  // Set access controls
  await objectStorageService.trySetObjectEntityAclPolicy(
    uploadURL, 
    ObjectPermission.READ
  );
  
  res.json({ documentUrl: uploadURL });
});
```

---

## Enterprise Features

**Billing & Subscription Management**
- Stripe integration for payment processing
- Usage tracking and limits enforcement
- Plan upgrades and downgrades
- Enterprise seat management

**Template Marketplace**
- User-created analysis templates
- Rating and discovery system
- Import/export functionality
- Version control and publishing workflow

**Real-time Collaboration**
- Workspace sharing with session codes
- Live workspace synchronization
- Multi-user session management
- Real-time event broadcasting

**Admin Console**
- User management and permissions
- System health monitoring
- Usage analytics and reporting
- Security audit logs

---

## Testing Infrastructure

Comprehensive test suite covering all major components:

- **API Tests**: Authentication, debate endpoints, document upload
- **UI Tests**: Playwright end-to-end testing across all modes
- **Integration Tests**: Multi-agent workflows, streaming, collaboration
- **Performance Tests**: Load testing for concurrent users

---

## Configuration & Build System

**Key Configuration Files:**

- `package.json`: Dependencies and build scripts
- `vite.config.ts`: Frontend build configuration
- `drizzle.config.ts`: Database schema management
- `tailwind.config.ts`: UI styling system
- `tsconfig.json`: TypeScript configuration

**Deployment Architecture:**
- Express.js backend with TypeScript
- React frontend with Vite build system
- PostgreSQL database (Neon hosted)
- Object storage for documents
- Real-time SSE streaming

---

## Summary of Patentable Intellectual Property

1. **Multi-Agent AI Orchestration System**: Coordination of specialized AI agents in structured debates with contextual role instructions and cross-session continuity

2. **Real-time Streaming Architecture**: Server-Sent Events implementation for live AI agent conversations with dynamic configuration

3. **Document Integration Framework**: Secure three-step upload workflow with AI analysis integration across progressive complexity modes

4. **Tiered Complexity Interface**: Progressive analysis modes (Simple, Guided, Expert) with feature graduation and session transfer capabilities

5. **Template Marketplace System**: Reusable AI analysis patterns with discovery, rating, and collaborative development

6. **Real-time Workspace Collaboration**: Multi-user session sharing with live synchronization and event broadcasting

7. **Adaptive Agent Selection**: Smart and manual agent configuration based on prompt analysis and user preferences

8. **Enterprise Collaboration Framework**: Complete workspace management, billing integration, and administrative controls

This comprehensive application represents a novel approach to collaborative AI analysis with significant technical innovations in multi-agent coordination, real-time streaming, and enterprise collaboration features.

---
