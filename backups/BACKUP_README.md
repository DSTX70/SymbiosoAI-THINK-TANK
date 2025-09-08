# SymbiosoAi ThinkTank - Complete Project Backup

## Overview
This backup contains the complete SymbiosoAi ThinkTank enterprise-grade collaborative AI platform that uses multiple AI agents to conduct structured debates and generate consensus-driven insights.

## Backup Contents

### Core Application Files
- **client/**: React frontend application with TypeScript
  - Components for Simple, Guided, and Expert modes
  - Enterprise features (automation, collaboration, monitoring)
  - UI components based on shadcn/ui
  - Mobile-responsive design
  
- **server/**: Express.js backend with TypeScript
  - REST API endpoints
  - Authentication (Replit OpenID Connect)
  - Database integration with Drizzle ORM
  - Performance monitoring and security middleware
  - Automation services and enterprise features
  
- **shared/**: Shared TypeScript schemas and types
  - Database schema definitions
  - Type definitions for API contracts
  - Zod validation schemas

### Configuration Files
- **package.json**: Dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **vite.config.ts**: Build tool configuration
- **tailwind.config.ts**: CSS framework configuration
- **drizzle.config.ts**: Database ORM configuration
- **postcss.config.js**: CSS processing configuration
- **components.json**: UI component library configuration

### Documentation
- **docs/**: Technical documentation
  - FEATURE_ORGANIZATION_GUIDE.md
  - PERFORMANCE_SCALABILITY.md
- **replit.md**: Project overview and architecture
- **USER_MANUAL.md**: End-user documentation

### Additional Resources
- **scripts/**: Utility scripts for development
- **tokens/**: Design system tokens and variables

## System Requirements

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL database (recommended: Neon serverless)
- Replit account for authentication (or configure alternative OAuth)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access (optional: Anthropic keys)
- `NODE_ENV`: Set to "development" or "production"

## Rebuild Instructions

### 1. Extract and Setup
```bash
tar -xzf symbiosai-complete-backup-YYYYMMDD-HHMMSS.tar.gz
cd extracted-project
npm install
```

### 2. Database Setup
```bash
# Push schema to database
npm run db:push --force
```

### 3. Development
```bash
# Start development server
npm run dev
```

### 4. Production Build
```bash
# Build for production
npm run build
```

## Architecture Highlights

### Multi-Agent AI System
- **4 Core AI Personalities**: Analyst, Pragmatist, Innovator, Thoughtful, Critic
- **14 Domain Experts**: Legal, Medical, Financial, Technical, Business specialists
- **Debate Orchestration**: Structured multi-round conversations with consensus building

### Enterprise Features
- **Phase 3 Automation Suite**: Time tracking, invoicing, notifications, workflow templates
- **Team Collaboration**: Real-time workspace synchronization, session sharing
- **Security & Monitoring**: Audit logs, performance metrics, security events
- **Advanced Analytics**: Usage tracking, performance optimization, error monitoring

### Technology Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript + Drizzle ORM
- **Database**: PostgreSQL with automated migrations
- **Authentication**: OpenID Connect (Replit integration)
- **AI Integration**: OpenAI GPT-4 with optional Anthropic Claude support

## Feature Completeness
This backup represents a fully functional enterprise platform with:
- ✅ 3 complexity modes (Simple, Guided, Expert)
- ✅ Cross-mode debate transfer capabilities  
- ✅ Complete automation and enterprise features
- ✅ Mobile-responsive design
- ✅ Real-time collaboration
- ✅ Comprehensive monitoring and security
- ✅ Advanced AI configuration options
- ✅ Template library and workspace management

## Support
For rebuild assistance or questions about the architecture, refer to the technical documentation in the docs/ folder or the comprehensive replit.md file.

---
**Backup Created**: $(date)
**Platform Version**: Enterprise v3.0+ 
**Database Schema**: 30+ tables with full enterprise features