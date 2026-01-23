# SymbiosoAi ThinkTank - Agent Kernel Adaptation Plan

**Version**: v0.1 Adaptation  
**Date**: October 26, 2025  
**Purpose**: Map the Symbioso IP Studio Agent Kernel to ThinkTank's existing features

---

## ⚠️ IMPORTANT: Pod-Driven Architecture

**IP-specific features are NOT built into the core platform.**

The kernel and IP-related capabilities (prior art search, claim generation, differentiation drafting) are **optional/on-demand features** that are only activated when requested by a Pod. This ensures:

1. **Core platform remains lightweight** - No IP bloat in the base product
2. **Modular activation** - IP features loaded only when needed
3. **Cost efficiency** - Users only pay for IP capabilities when they use them
4. **Separation of concerns** - Core debate/brainstorming vs specialized IP workflows

### What IS Core (Always Available)
- Multi-Agent Debate Orchestration
- Brainstorming & Solutions
- Report Generation
- Fact Checking
- Cross-Mode Transfer
- Workspace Collaboration
- Evidence Generation (Ex_A/B/C)

### What IS Pod-Driven (On-Demand Only)
- Prior Art Search
- Patent Claim Generation
- Differentiation Drafting
- IP-Focused Analysis Modes
- Filing-Ready Evidence Packs
- USPTO/Lens/Google Patents Integration

---

## 1. Adaptation Overview

The Agent Kernel provides an **optional execution layer** that can be activated via Pod when users need IP-specific workflows. It wraps ThinkTank's existing AI capabilities as versioned tools with receipt logging.

### Core Principle
**Pod-Activated, Adapter-First**: The kernel and IP tools are only loaded when a Pod activates them. Core platform capabilities can be wrapped as tools when needed.

---

## 2. Tool Registry Mapping

### Existing Platform Capabilities → Kernel Tools

| Platform Feature | API Endpoint | Kernel Tool | Version |
|------------------|--------------|-------------|---------|
| Multi-Agent Debate | `/api/think` | `debate.orchestrate` | 1.0.0 |
| Brainstorming | `/api/brainstorm` | `brainstorm.generate` | 1.0.0 |
| Report Generation | `/api/report` | `report.create` | 1.0.0 |
| Fact Checking | `/api/factcheck/verify-claims` | `factcheck.verify` | 1.0.0 |
| Cross-Mode Transfer | `/api/think` (transfer_from_session_id) | `transfer.session` | 1.0.0 |
| Document Analysis | `/api/upload` + `/api/think` | `document.analyze` | 1.0.0 |
| Evidence Generation | `generateEvidence.ts` | `evidence.generate` | 1.0.0 |
| Session Management | `/api/sessions` | `session.manage` | 1.0.0 |

### New IP-Specific Tools (Stubs Initially)

| New Capability | Kernel Tool | Version | Integration Target |
|----------------|-------------|---------|-------------------|
| Prior Art Search | `priorart.search` | 0.1.0 | USPTO/Lens/Google Patents |
| Differentiation Draft | `differentiation.draft` | 0.1.0 | Uses debate results |
| Patent Claim Generation | `claims.generate` | 0.1.0 | Uses consensus + dissents |
| Evidence Pack Assembly | `evidence.pack` | 1.0.0 | ZIP with manifest |

---

## 3. Capability Mapping (Product → Capability → Tools)

### Capability 1: `ip_debate_analysis`
**Product Feature**: "IP-Focused Multi-Agent Debate"

```typescript
capability: "ip_debate_analysis"
description: "Run multi-agent debate with IP/patent focus"
tools:
  - debate.orchestrate (existing)
  - factcheck.verify (existing)
  - evidence.generate (existing)
output:
  - Debate results (consensus, dissents, unresolved)
  - Fact-check findings with citations
  - Receipt JSONL entry
```

**Workflow**:
```
1. User submits IP-related question
2. debate.orchestrate runs multi-agent analysis
3. factcheck.verify validates key claims
4. evidence.generate creates Ex_A/B/C artifacts
5. Receipt logged with hashed inputs/outputs
```

---

### Capability 2: `prior_art_recon`
**Product Feature**: "Prior Art Reconnaissance"

```typescript
capability: "prior_art_recon"
description: "Search for prior art and potential conflicts"
tools:
  - priorart.search (new - stub initially)
  - debate.orchestrate (existing - for analysis)
  - factcheck.verify (existing - for validation)
output:
  - Ranked prior art hits
  - Similarity analysis
  - Conflict assessment
  - Receipt JSONL entry
```

**Workflow**:
```
1. User provides invention description or patent claim
2. priorart.search queries patent databases (stub → USPTO/Lens)
3. debate.orchestrate analyzes similarities and differences
4. factcheck.verify confirms technical claims
5. Receipt logged with search parameters and results hash
```

---

### Capability 3: `draft_differentiation`
**Product Feature**: "Differentiation Draft (Scaffold)"

```typescript
capability: "draft_differentiation"
description: "Generate patent differentiation arguments"
tools:
  - brainstorm.generate (existing)
  - differentiation.draft (new)
  - debate.orchestrate (existing)
output:
  - Differentiation points
  - Novel feature identification
  - Claim scaffolds
  - Receipt JSONL entry
```

**Workflow**:
```
1. User provides invention + prior art references
2. debate.orchestrate identifies key differences
3. brainstorm.generate creates differentiation strategies
4. differentiation.draft scaffolds patent claims
5. Receipt logged with differentiation arguments
```

---

### Capability 4: `claim_generation`
**Product Feature**: "Patent Claim Generation"

```typescript
capability: "claim_generation"
description: "Generate patent claim scaffolds from analysis"
tools:
  - debate.orchestrate (existing)
  - claims.generate (new)
  - factcheck.verify (existing)
output:
  - Independent claims (scaffolds)
  - Dependent claims (scaffolds)
  - Claim chart references
  - Receipt JSONL entry
```

**Workflow**:
```
1. User provides invention description + differentiation
2. debate.orchestrate identifies core innovations
3. claims.generate creates claim language scaffolds
4. factcheck.verify validates technical accuracy
5. Receipt logged with claim structures
```

---

### Capability 5: `assemble_evidence_pack`
**Product Feature**: "Generate Evidence Pack ZIP"

```typescript
capability: "assemble_evidence_pack"
description: "Create filing-ready evidence bundle"
tools:
  - evidence.pack (new)
  - evidence.generate (existing)
  - report.create (existing)
output:
  - ZIP file path: data/packs/<packId>.zip
  - MANIFEST.json
  - All artifacts
  - Receipt JSONL entry
```

**Workflow**:
```
1. User requests evidence pack for session(s)
2. evidence.generate creates Ex_A, Ex_B, Ex_C artifacts
3. report.create generates comprehensive report
4. evidence.pack assembles ZIP with manifest
5. Receipt logged with pack metadata and hash
```

---

### Capability 6: `session_transfer_ip`
**Product Feature**: "IP-Focused Cross-Mode Transfer"

```typescript
capability: "session_transfer_ip"
description: "Transfer debate session with IP context preservation"
tools:
  - transfer.session (existing)
  - evidence.generate (existing)
output:
  - Transferred session ID
  - Preserved IP context
  - Transfer evidence log
  - Receipt JSONL entry
```

**Workflow**:
```
1. User requests transfer from Simple → Expert mode
2. transfer.session preserves debate context
3. evidence.generate creates Ex_A_transfer.log
4. New session created with IP-enhanced agents
5. Receipt logged with transfer metadata
```

---

## 4. Receipt Schema (Adapted for ThinkTank)

### Receipt JSONL Format

```typescript
interface KernelReceipt {
  // Core identifiers
  receiptId: string;          // UUID
  timestamp: string;          // ISO 8601
  
  // Capability execution
  capability: string;         // e.g., "ip_debate_analysis"
  tools: ToolExecution[];     // Tools invoked
  
  // Input/Output hashes (salted)
  inputsHash: string;         // SHA-256 of inputs
  outputsHash: string;        // SHA-256 of outputs
  
  // ThinkTank-specific
  sessionId?: string;         // Analysis session ID
  userId?: string;            // User who initiated
  workspaceId?: string;       // Workspace context
  mode: 'simple' | 'guided' | 'expert';
  
  // Execution metadata
  durationMs: number;
  status: 'ok' | 'error' | 'partial';
  trustTier: 'L0' | 'L1' | 'L2' | 'L3';
  
  // Evidence tracking
  evidenceArtifacts?: string[];  // Ex_A, Ex_B, Ex_C paths
  packId?: string;               // Evidence pack ID if generated
}

interface ToolExecution {
  tool: string;               // e.g., "debate.orchestrate"
  version: string;            // e.g., "1.0.0"
  action: string;             // e.g., "run"
  inputsHash: string;
  outputsHash: string;
  status: 'ok' | 'error';
  durationMs: number;
}
```

### Example Receipt Entry

```json
{
  "receiptId": "rcpt-abc123-def456",
  "timestamp": "2025-10-26T17:30:00.000Z",
  "capability": "ip_debate_analysis",
  "tools": [
    {
      "tool": "debate.orchestrate",
      "version": "1.0.0",
      "action": "run",
      "inputsHash": "sha256:a1b2c3...",
      "outputsHash": "sha256:d4e5f6...",
      "status": "ok",
      "durationMs": 45000
    },
    {
      "tool": "factcheck.verify",
      "version": "1.0.0",
      "action": "verify",
      "inputsHash": "sha256:g7h8i9...",
      "outputsHash": "sha256:j0k1l2...",
      "status": "ok",
      "durationMs": 12000
    }
  ],
  "inputsHash": "sha256:full-input-hash...",
  "outputsHash": "sha256:full-output-hash...",
  "sessionId": "session-xyz789",
  "userId": "user-123",
  "mode": "expert",
  "durationMs": 57000,
  "status": "ok",
  "trustTier": "L1",
  "evidenceArtifacts": ["Ex_A_transfer.log", "Ex_B_brainstorm.json"]
}
```

---

## 5. Folder Structure (Adapted)

```
server/
├── kernel/                        # Agent Kernel Integration
│   ├── index.ts                   # Kernel entry point
│   ├── registry.ts                # Tool registry
│   ├── executor.ts                # Capability executor
│   ├── receipts.ts                # Receipt logging
│   ├── packer.ts                  # Evidence pack assembly
│   │
│   ├── tools/                     # Tool adapters
│   │   ├── debate.ts              # Wraps /api/think
│   │   ├── brainstorm.ts          # Wraps /api/brainstorm
│   │   ├── report.ts              # Wraps /api/report
│   │   ├── factcheck.ts           # Wraps /api/factcheck
│   │   ├── transfer.ts            # Wraps session transfer
│   │   ├── document.ts            # Wraps document analysis
│   │   ├── evidence.ts            # Wraps evidence generation
│   │   ├── session.ts             # Wraps session management
│   │   │
│   │   └── ip/                    # New IP-specific tools (stubs)
│   │       ├── priorart.ts        # Prior art search
│   │       ├── differentiation.ts # Differentiation drafting
│   │       └── claims.ts          # Claim generation
│   │
│   ├── capabilities/              # Capability definitions
│   │   ├── ip-debate-analysis.ts
│   │   ├── prior-art-recon.ts
│   │   ├── draft-differentiation.ts
│   │   ├── claim-generation.ts
│   │   ├── assemble-evidence-pack.ts
│   │   └── session-transfer-ip.ts
│   │
│   └── routes.ts                  # Kernel API routes
│
├── data/                          # Kernel data (gitignored)
│   ├── receipts/
│   │   └── receipts.jsonl         # Append-only receipt log
│   └── packs/
│       └── <packId>.zip           # Evidence pack ZIPs

```

---

## 6. API Endpoints (Kernel)

### Kernel Routes (Proxied via Main API)

```typescript
// Main API proxies to kernel
// POST /api/ipstudio/* → kernel :5050/*

// Health check
GET /api/ipstudio/health
Response: {
  "product": "SymbiosoAi ThinkTank",
  "kernel": "ip-studio-kernel",
  "version": "0.1.0",
  "status": "healthy"
}

// List available tools
GET /api/ipstudio/tools
Response: {
  "tools": [
    { "name": "debate.orchestrate", "version": "1.0.0", "actions": ["run"] },
    { "name": "brainstorm.generate", "version": "1.0.0", "actions": ["run"] },
    { "name": "priorart.search", "version": "0.1.0", "actions": ["query"] },
    ...
  ]
}

// Execute capability
POST /api/ipstudio/run
Body: {
  "capability": "ip_debate_analysis",
  "inputs": {
    "prompt": "Analyze the patentability of multi-agent AI debate systems",
    "mode": "expert",
    "settings": { ... }
  },
  "trustTier": "L1"
}
Response: {
  "receiptId": "rcpt-abc123",
  "status": "ok",
  "outputs": { ... },
  "evidenceArtifacts": ["Ex_A_transfer.log"],
  "durationMs": 45000
}

// Get receipts
GET /api/ipstudio/receipts?limit=100&capability=ip_debate_analysis
Response: {
  "receipts": [ ... ],
  "total": 150
}

// Get evidence pack
GET /api/ipstudio/packs/:packId
Response: ZIP file download

// List evidence packs
GET /api/ipstudio/packs
Response: {
  "packs": [
    { "packId": "pack-xyz", "createdAt": "...", "size": 12345 }
  ]
}
```

---

## 7. Tool Adapter Implementation Examples

### debate.ts (Wraps /api/think)

```typescript
// server/kernel/tools/debate.ts
import { runMultiAgentDebate } from "../../ai-service";
import { storage } from "../../storage";
import type { ToolAdapter, ToolAction } from "../registry";

export const debateTool: ToolAdapter = {
  name: "debate.orchestrate",
  version: "1.0.0",
  description: "Run multi-agent AI debate with consensus synthesis",
  
  actions: {
    run: async (inputs: {
      prompt: string;
      mode: 'simple' | 'guided' | 'expert';
      settings?: any;
      transferFromSessionId?: string;
      documentContext?: string;
    }) => {
      const { prompt, mode, settings = {}, transferFromSessionId, documentContext } = inputs;
      
      // Build enhanced settings
      const enhancedSettings = {
        ...settings,
        mode,
        attached_document: documentContext ? { content: documentContext } : undefined,
      };
      
      // Handle cross-mode transfer if specified
      let transferContext = {};
      if (transferFromSessionId) {
        const sourceSession = await storage.getSessionForTransfer(transferFromSessionId);
        if (sourceSession) {
          transferContext = {
            previousConsensus: sourceSession.results?.consensus,
            previousDissents: sourceSession.results?.dissents,
            previousUnresolved: sourceSession.results?.unresolved,
          };
        }
      }
      
      // Run the debate
      const result = await runMultiAgentDebate(prompt, {
        ...enhancedSettings,
        transferContext,
      });
      
      // Create session record
      const session = await storage.createAnalysisSession({
        prompt,
        mode,
        settings: enhancedSettings,
        results: result,
      });
      
      return {
        sessionId: session.id,
        consensus: result.consensus,
        dissents: result.dissents,
        unresolved: result.unresolved,
        debateHistory: result.debateHistory,
        metadata: result.metadata,
      };
    }
  }
};
```

### priorart.ts (New IP Tool - Stub)

```typescript
// server/kernel/tools/ip/priorart.ts
import type { ToolAdapter } from "../../registry";

export const priorartTool: ToolAdapter = {
  name: "priorart.search",
  version: "0.1.0",
  description: "Search patent databases for prior art (stub - integration pending)",
  
  actions: {
    query: async (inputs: {
      inventionDescription: string;
      keywords?: string[];
      patentClasses?: string[];
      dateRange?: { start: string; end: string };
    }) => {
      // STUB: Return mock results for now
      // TODO: Integrate with USPTO, Lens, Google Patents APIs
      
      console.log(`[priorart.search] STUB: Would search for: ${inputs.inventionDescription}`);
      
      return {
        status: "stub",
        message: "Prior art search integration pending",
        mockResults: [
          {
            patentNumber: "US11234567B2",
            title: "Example Prior Art Patent",
            abstract: "This is a placeholder for real patent search results",
            similarity: 0.45,
            filingDate: "2020-01-15",
            source: "STUB"
          }
        ],
        searchParams: inputs,
        integrationNote: "Connect to USPTO/Lens/Google Patents API to enable real search"
      };
    }
  }
};
```

---

## 8. Evidence Pack Assembly

### Adapted Pack Structure

```
data/packs/<packId>.zip
├── MANIFEST.json
├── artifacts/
│   ├── Ex_A_transfer.log
│   ├── Ex_B_brainstorm.json
│   └── Ex_C_telemetry.log
├── reports/
│   ├── executive_report.md
│   ├── detailed_report.md
│   └── full_report.pdf
├── sessions/
│   └── session_<id>.json
├── receipts/
│   └── execution_receipts.jsonl
└── metadata/
    ├── platform_info.json
    └── generation_timestamp.txt
```

### MANIFEST.json Schema

```json
{
  "packId": "pack-abc123",
  "version": "1.0.0",
  "createdAt": "2025-10-26T17:30:00.000Z",
  "platform": {
    "name": "SymbiosoAi ThinkTank",
    "version": "1.0.0",
    "kernel": "ip-studio-kernel v0.1.0"
  },
  "contents": {
    "evidenceArtifacts": ["Ex_A_transfer.log", "Ex_B_brainstorm.json", "Ex_C_telemetry.log"],
    "reports": ["executive_report.md", "detailed_report.md", "full_report.pdf"],
    "sessions": ["session_xyz789.json"],
    "receiptCount": 5
  },
  "metadata": {
    "capability": "assemble_evidence_pack",
    "sessionIds": ["session_xyz789"],
    "userId": "user-123",
    "workspaceId": "workspace-456"
  },
  "hashes": {
    "manifestHash": "sha256:...",
    "contentHash": "sha256:..."
  }
}
```

---

## 9. Integration Strategy

### Recommended: Option A (Sidecar + Proxy)

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React)                        │
│   Uses /api/ipstudio/* for kernel, /api/* for rest     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              MAIN SERVER (Express :5000)                 │
│                                                          │
│  /api/*           → Existing routes (debate, brainstorm)│
│  /api/ipstudio/*  → Proxy to kernel :5050              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              KERNEL (Express :5050)                      │
│                                                          │
│  /health          → Health check                         │
│  /tools           → List tool registry                   │
│  /run             → Execute capability                   │
│  /receipts        → Query receipts                       │
│  /packs           → List/download evidence packs         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    TOOL ADAPTERS                         │
│                                                          │
│  debate.orchestrate  → runMultiAgentDebate()            │
│  brainstorm.generate → runBrainstormingSession()        │
│  factcheck.verify    → advancedFactChecker()            │
│  report.create       → runReportGeneration()            │
│  evidence.generate   → generateEvidence()               │
│  priorart.search     → STUB (future: USPTO API)         │
└─────────────────────────────────────────────────────────┘
```

### Proxy Route Addition

```typescript
// server/routes.ts - Add proxy route
import { createProxyMiddleware } from 'http-proxy-middleware';

// Proxy /api/ipstudio/* to kernel
app.use('/api/ipstudio', createProxyMiddleware({
  target: 'http://localhost:5050',
  changeOrigin: true,
  pathRewrite: { '^/api/ipstudio': '' },
}));
```

---

## 10. Trust Tiers (Adapted for ThinkTank)

| Tier | Description | Allowed Actions |
|------|-------------|-----------------|
| L0 | Read-only | Query receipts, list tools, health check |
| L1 | Standard | Run debates, brainstorming, reports |
| L2 | Enhanced | Evidence generation, pack assembly |
| L3 | Admin | Prior art search, write actions, config |

### Tier Mapping to Platform Roles

| Platform Role | Default Trust Tier |
|---------------|-------------------|
| user | L0 |
| premium_user | L1 |
| admin | L2 |
| system_admin | L3 |

---

## 11. Definition of Done (Adapted v0.1)

### Core Kernel
- [ ] Kernel runs on :5050 via `npm run kernel:dev`
- [ ] /health returns product and kernel version
- [ ] /tools lists all registered tool adapters
- [ ] /run executes at least one capability end-to-end
- [ ] Receipt JSONL entry written per run with hashes

### Tool Adapters
- [ ] debate.orchestrate wraps runMultiAgentDebate()
- [ ] brainstorm.generate wraps runBrainstormingSession()
- [ ] report.create wraps runReportGeneration()
- [ ] factcheck.verify wraps advancedFactChecker()
- [ ] evidence.generate wraps existing evidence generation
- [ ] priorart.search returns stub response

### Evidence Pack
- [ ] evidence.pack creates ZIP with MANIFEST.json
- [ ] ZIP contains artifacts, reports, sessions, receipts
- [ ] Pack download endpoint functional

### Integration
- [ ] Proxy route /api/ipstudio/* → kernel :5050
- [ ] No CORS issues between main API and kernel
- [ ] Authentication context passed through proxy

### Governance
- [ ] Trust tiers enforced on /run requests
- [ ] Write-actions (pack creation) gated to L2+
- [ ] Receipts include user context

---

## 12. Implementation Timeline

### Phase 1: Core Kernel (Week 1)
- Set up kernel folder structure
- Implement registry, executor, receipts
- Create debate.orchestrate adapter
- Add /health, /tools, /run endpoints

### Phase 2: Tool Adapters (Week 2)
- brainstorm.generate adapter
- report.create adapter
- factcheck.verify adapter
- evidence.generate adapter
- priorart.search stub

### Phase 3: Evidence Packs (Week 3)
- Implement packer.ts
- Create evidence.pack tool
- Add /packs endpoints
- MANIFEST.json generation

### Phase 4: Integration (Week 4)
- Proxy route setup
- Trust tier enforcement
- Authentication passthrough
- UI integration planning

---

## 13. Future Roadmap (Post v0.1)

### v0.2 - Patent Database Integration
- USPTO API integration for priorart.search
- Google Patents integration
- Lens.org integration
- Citation parsing and linking

### v0.3 - Advanced IP Tools
- claims.generate with patent language patterns
- differentiation.draft with legal frameworks
- IDS queue export format
- Claim chart generation

### v0.4 - UI Integration
- IP Studio dashboard in Expert mode
- Prior art search interface
- Evidence pack browser
- Receipt audit viewer

### v1.0 - Full IP Workflow
- End-to-end patent application support
- Automated filing preparation
- Examiner response analysis
- Portfolio management

---

## Summary

This adaptation maps the Agent Kernel to ThinkTank's existing features:

| Kernel Component | ThinkTank Adaptation |
|------------------|---------------------|
| Tool Registry | Wraps existing AI services as versioned tools |
| Capabilities | 6 IP-focused workflows using existing + new tools |
| Receipts | JSONL logging with session/user/workspace context |
| Evidence Packs | Enhanced ZIPs with reports + artifacts + manifests |
| Integration | Sidecar on :5050 with /api/ipstudio/* proxy |

**Key Benefits**:
1. **Non-disruptive**: Kernel is additive, doesn't change existing functionality
2. **Leverages Existing**: Uses runMultiAgentDebate(), brainstorming, reports
3. **IP-Focused**: Adds prior art, differentiation, claims scaffolding
4. **Auditable**: Receipt logging creates legal-grade provenance
5. **Extensible**: Stub tools ready for patent database integrations

---

**Ready for implementation.** The kernel will enhance ThinkTank's IP capabilities while preserving all existing functionality.
