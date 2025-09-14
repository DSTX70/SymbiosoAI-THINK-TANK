# If When Always Platform - Code Export for Review & Testing

## 🎯 **Platform Overview**

**SymbiosoAi ThinkTank** (renamed to "If When Always Platform") is an enterprise-grade collaborative AI platform that orchestrates multi-agent debates to generate consensus-driven insights. The platform features:

### **Core Functionality**
- **Multi-Agent AI Debates**: 4-5 specialized AI agents (Analyst, Critic, Synthesizer, Domain Expert) conduct structured debates
- **Three Complexity Modes**: Simple (quick), Guided (intermediate), Expert (enterprise-grade)
- **Enhanced Brainstorming**: Transform debate insights into collaborative solutions ✨ **NEWLY ENHANCED**
- **Report Generation & Preview**: Complete report system with user-controlled file saving ✨ **NEWLY ENHANCED**
- **Authentication System**: Demo login (demo/demo123) + OAuth integration ✨ **RECENTLY FIXED**

### **Recent Enhancements**
1. ✅ **Brainstorming Prompt Input**: Users can now enter prompts before starting brainstorming sessions
2. ✅ **Report Preview & Save**: Enhanced file saving with File System Access API + fallbacks  
3. ✅ **Authentication Fixed**: Resolved login visibility issues, added demo access
4. ✅ **Expert Features Spacing**: Fixed button overlapping with 200% more padding

---

## 📋 **Package Configuration**

```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  },
  "dependencies": {
    "@anthropic-ai/sdk": "^0.37.0",
    "@tanstack/react-query": "^5.60.5",
    "openai": "^5.20.0",
    "react": "^18.3.1",
    "express": "^4.21.2",
    "drizzle-orm": "^0.39.1",
    "typescript": "5.6.3",
    "@radix-ui/react-*": "Latest",
    "tailwindcss": "^3.4.17",
    "wouter": "^3.3.5"
  }
}
```

---

## 🗂️ **Application Architecture**

```
client/src/
├── App.tsx                    # Main router with auth integration
├── pages/
│   ├── landing.tsx           # Landing page with auth status
│   ├── simple.tsx            # Simple mode analysis
│   ├── guided.tsx            # Guided mode analysis  
│   └── expert.tsx            # Expert mode with enterprise features
├── components/
│   ├── AuthButton.tsx        # Demo login + OAuth authentication
│   ├── BrainstormSection.tsx # Enhanced brainstorming component ✨
│   ├── ReportViewerDialog.tsx # Report preview & save functionality ✨
│   └── ReportHistorySection.tsx # Report management ✨

server/
├── routes.ts                 # API routes & authentication
├── ai-service.ts            # Multi-agent AI orchestration
├── replitAuth.ts            # OAuth authentication setup
└── storage.ts               # Database operations

shared/
└── schema.ts                # TypeScript schemas & data models
```

---

## 🔐 **Authentication System**

### Demo Login (Quick Access)
```typescript
// Credentials: demo / demo123
app.post('/api/demo-login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'demo' && password === 'demo123') {
    const demoUser = {
      id: 'demo-user-12345',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User'
    };
    
    // Create session and authenticate
    req.logIn(demoUserObj, (loginErr) => {
      res.json({ success: true, message: "Demo login successful" });
    });
  }
});
```

### OAuth Authentication  
```typescript
// Replit OpenID Connect integration
await setupAuth(app);
app.get('/api/auth/user', isAuthenticated, async (req, res) => {
  const userId = req.user.claims.sub;
  let user = await storage.getUser(userId);
  
  // Auto-provision user if they don't exist
  if (!user) {
    user = await storage.upsertUser({
      id: req.user.claims.sub,
      email: req.user.claims.email,
      firstName: req.user.claims.first_name,
      lastName: req.user.claims.last_name
    });
  }
  
  res.json(user);
});
```

---

## 🧠 **Enhanced Brainstorming Component** ✨ **NEW**

### Key Features
- **Prompt Input**: Users can enter custom brainstorming prompts
- **Two Modes**: Standalone prompts OR building on existing debate results
- **AI Agent Orchestration**: 4 specialized brainstorming agents
- **Interactive Results**: Clickable solutions, action plans, follow-up questions

```typescript
export function BrainstormSection({ 
  sessionId, 
  brainstormResults, 
  onBrainstormStart,
  onBrainstormComplete 
}: BrainstormSectionProps) {
  const [brainstormPrompt, setBrainstormPrompt] = useState("");
  
  const brainstormMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId && !brainstormPrompt.trim()) {
        throw new Error("Please enter a brainstorming prompt or complete a debate session first");
      }
      
      const requestData = sessionId 
        ? { sessionId, settings: {} }
        : { prompt: brainstormPrompt.trim(), settings: {} };
      
      const response = await apiRequest("POST", "/api/brainstorm", requestData);
      return response.json();
    }
  });

  // Two UI states:
  // 1. No session - Full prompt input form
  // 2. Has session - Optional additional focus areas
  
  if (!brainstormResults && !sessionId) {
    return (
      <Card className="card-elevated h-full">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center space-y-6 w-full max-w-md">
            <div className="space-y-4 text-left">
              <Label htmlFor="brainstorm-prompt">Brainstorming Prompt</Label>
              <Textarea
                id="brainstorm-prompt"
                placeholder="What challenge, opportunity, or question would you like to explore through collaborative AI brainstorming?"
                value={brainstormPrompt}
                onChange={(e) => setBrainstormPrompt(e.target.value)}
                className="mt-2 min-h-[100px]"
                data-testid="textarea-brainstorm-prompt"
              />
              <Button 
                onClick={() => brainstormMutation.mutate()}
                disabled={isStarting || !brainstormPrompt.trim()}
                data-testid="button-start-brainstorm"
              >
                Start Brainstorming Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
}
```

### Brainstorming AI Agents
```typescript
export const BRAINSTORM_AGENTS: AIAgent[] = [
  {
    role: "Solution Architect",
    perspective: "Systematic solution design and implementation planning"
  },
  {
    role: "Implementation Specialist", 
    perspective: "Practical execution and resource planning"
  },
  {
    role: "Innovation Catalyst",
    perspective: "Creative problem solving and alternative approaches"
  },
  {
    role: "Integration Specialist",
    perspective: "Synthesis and unified strategy development"
  }
];
```

---

## 📄 **Report Preview & Save System** ✨ **ENHANCED**

### File System Access API Integration
```typescript
// Enhanced download with user-controlled save location
const handleDownloadReport = async (report: ReportDetails) => {
  const content = formatReportContent(report.content, report.format);
  const extension = report.format === 'json' ? 'json' : 
                   report.format === 'html' ? 'html' : 'md';
  const mimeType = report.format === 'json' ? 'application/json' : 
                   report.format === 'html' ? 'text/html' : 'text/markdown';

  // Use File System Access API if supported (Chrome, Edge)
  if ('showSaveFilePicker' in window) {
    try {
      const fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: `${report.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`,
        types: [{
          description: `${report.format.toUpperCase()} files`,
          accept: { [mimeType]: [`.${extension}`] }
        }]
      });
      
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      
      toast({
        title: "Report Saved Successfully!",
        description: `Report saved to your chosen location as ${fileHandle.name}`,
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        // Fallback to traditional download
        fallbackDownload(content, report, extension, mimeType);
      }
    }
  } else {
    // Fallback for browsers that don't support File System Access API
    fallbackDownload(content, report, extension, mimeType);
  }
};
```

### Report Formatting System
```typescript
function formatReportAsMarkdown(report: any): string {
  let content = `# ${report.title || 'Analysis Report'}\n\n`;
  
  if (report.executive_summary) {
    content += `## Executive Summary\n\n${report.executive_summary}\n\n`;
  }
  
  if (report.brainstorming_outcomes?.collaborative_solutions) {
    content += `### Collaborative Solutions\n\n`;
    report.brainstorming_outcomes.collaborative_solutions.forEach((solution: any, index: number) => {
      content += `${index + 1}. **${solution.title}** (Feasibility: ${solution.feasibility}, Impact: ${solution.impact})\n`;
      content += `   ${solution.description}\n\n`;
    });
  }
  
  return content;
}
```

---

## 🤖 **AI Service Architecture**

### Multi-Agent Debate System
```typescript
export async function runMultiAgentDebate(
  prompt: string, 
  settings: any
): Promise<ThinkResponse> {
  const agents = getAgentsForMode(settings.mode);
  const rounds = settings.debateRounds || 3;
  
  let debateHistory: DebateRound[] = [];
  
  for (let round = 1; round <= rounds; round++) {
    const roundResults = await Promise.all(
      agents.map(agent => generateAgentResponse(agent, prompt, debateHistory, settings))
    );
    
    debateHistory.push({
      roundNumber: round,
      responses: roundResults
    });
    
    // Allow agents to build on each other's arguments
    if (round < rounds) {
      await sleep(1000); // Rate limiting
    }
  }
  
  // Synthesize final consensus
  const consensus = await synthesizeConsensus(debateHistory, settings);
  
  return {
    consensus: consensus.mainConsensus,
    dissents: consensus.dissents,
    unresolved: consensus.unresolved,
    debateHistory,
    metadata: {
      totalAgents: agents.length,
      totalRounds: rounds,
      processingTime: Date.now() - startTime
    }
  };
}
```

### Brainstorming Session
```typescript
export async function runBrainstormingSession(
  originalPrompt: string,
  debateResults: { consensus: string; dissents: any[]; unresolved: string[] },
  settings: any
): Promise<BrainstormResponse> {
  const agents = BRAINSTORM_AGENTS;
  
  // Generate collaborative solutions
  const solutions = await Promise.all(
    agents.map(agent => generateSolutions(agent, originalPrompt, debateResults))
  );
  
  // Create implementation action plan
  const actionPlan = await generateActionPlan(solutions, debateResults);
  
  // Address unresolved questions
  const answeredQuestions = await addressUnresolvedQuestions(
    debateResults.unresolved, solutions
  );
  
  return {
    solutions: solutions.flat(),
    action_plan: actionPlan,
    answered_questions: answeredQuestions,
    final_consensus: await generateFinalConsensus(solutions, debateResults),
    implementation_strategy: await generateImplementationStrategy(solutions),
    telemetry: {
      avg_ms: averageResponseTime,
      quality: calculateQualityScore(solutions),
      tps: calculateTokensPerSecond(),
      active_agents: agents.length
    }
  };
}
```

---

## 🔧 **Testing Instructions for ChatGPT**

### 1. **Authentication Testing**
```bash
# Demo Login
curl -X POST http://localhost:5000/api/demo-login \
  -H "Content-Type: application/json" \
  -d '{"username": "demo", "password": "demo123"}'

# Expected: {"success": true, "message": "Demo login successful"}
```

### 2. **Brainstorming API Testing**
```bash
# Standalone Brainstorming (NEW FEATURE)
curl -X POST http://localhost:5000/api/brainstorm \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "How can we improve customer retention for our SaaS product?",
    "settings": {}
  }'

# Session-Based Brainstorming
curl -X POST http://localhost:5000/api/brainstorm \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-123",
    "settings": {}
  }'
```

### 3. **Report Generation Testing**
```bash
# Generate Report
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "session-123",
    "reportType": "executive",
    "format": "markdown"
  }'

# Expected: Full report object with downloadable content
```

### 4. **Frontend Testing Flow**

1. **Access Platform**: Navigate to `http://localhost:5000`
2. **Demo Login**: Click "Demo Login" → Use `demo/demo123`
3. **Start Analysis**: Go to Simple/Guided/Expert mode
4. **Test Brainstorming**: 
   - Enter prompt: "What are innovative ways to reduce energy consumption in offices?"
   - Click "Start Brainstorming Session"
   - Verify solutions, action plans, and follow-up questions appear
5. **Test Reports**:
   - Generate report from analysis results
   - Click "Preview Report" to open dialog
   - Test download functionality (should prompt save location)
   - Verify multiple formats (Markdown, HTML, JSON)

### 5. **Error Handling Tests**
```typescript
// Test empty brainstorming prompt
// Expected: Button should be disabled, error on submission

// Test report download in unsupported browser
// Expected: Fallback to traditional download

// Test authentication failure
// Expected: Proper error messages, no crashes
```

---

## 📊 **Data Schemas**

```typescript
// Core Analysis Session
export interface AnalysisSession {
  id: string;
  userId?: string;
  mode: 'simple' | 'guided' | 'expert';
  prompt: string;
  results?: ThinkResponse;
  brainstormResults?: BrainstormResponse;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Brainstorm Response Structure
export interface BrainstormResponse {
  solutions: Array<{
    title: string;
    description: string;
    feasibility: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    timeline?: string;
    resources_required?: string[];
  }>;
  action_plan: Array<{
    step: number;
    title: string;
    description: string;
    owner?: string;
    timeline?: string;
  }>;
  answered_questions: Array<{
    original_question: string;
    answer: string;
    confidence: "low" | "medium" | "high";
  }>;
  final_consensus: string;
  telemetry: {
    avg_ms: number;
    quality: number;
    tps: number;
  };
}

// Report Structure
export interface ReportDetails {
  id: string;
  title: string;
  reportType: 'executive' | 'detailed' | 'full';
  format: 'markdown' | 'html' | 'json';
  content: any;
  generatedAt: string;
  metadata?: {
    wordCount?: number;
    sessionPrompt?: string;
  };
}
```

---

## 🚀 **Key Features to Test**

### ✨ **New Brainstorming Enhancements**
- [ ] Prompt input field appears when no session exists
- [ ] Button is disabled when prompt is empty
- [ ] Brainstorming works with standalone prompts
- [ ] Optional focus areas work with existing sessions
- [ ] Solutions are interactive and clickable
- [ ] Follow-up questions generate properly

### ✨ **Enhanced Report System**  
- [ ] Report preview opens in dialog
- [ ] File System Access API works in Chrome/Edge
- [ ] Fallback download works in Firefox/Safari
- [ ] Multiple format exports (Markdown, HTML, JSON)
- [ ] User can choose save location and filename
- [ ] Success toast shows chosen filename

### ✨ **Fixed Authentication**
- [ ] Demo login form appears on landing page
- [ ] Credentials `demo/demo123` work correctly
- [ ] OAuth "Sign In" button redirects properly
- [ ] Authentication state persists across page refreshes
- [ ] User avatar and dropdown work when logged in

---

## 💡 **Suggestions for ChatGPT Testing**

1. **Focus on User Experience**: Test the complete flow from landing → login → analysis → brainstorming → reports
2. **Cross-Browser Testing**: Verify File System Access API graceful degradation
3. **Error Scenarios**: Test edge cases like empty prompts, network failures, authentication issues
4. **Performance**: Check response times for AI operations (should be 30-90 seconds for full debates)
5. **Mobile Responsiveness**: Test on different screen sizes

## 📝 **Known Issues & Limitations**

- Some advanced enterprise features are still in development
- AI responses may take 30-90 seconds depending on complexity
- File System Access API only works in Chromium browsers
- Demo login is intended for development/testing only

---

**Ready for comprehensive testing and review!** 🎉