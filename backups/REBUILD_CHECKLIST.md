# SymbiosoAi ThinkTank - Rebuild Checklist

## Quick Start Guide

### Step 1: Environment Setup
```bash
# Extract the backup
tar -xzf symbiosai-complete-backup-20250908-220224.tar.gz
cd symbiosai-thinktank/

# Install dependencies
npm install
```

### Step 2: Environment Variables
Create a `.env` file with:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/symbiosai"
OPENAI_API_KEY="your-openai-api-key"
NODE_ENV="development"
```

### Step 3: Database Setup
```bash
# Push schema to database (creates all 30+ tables)
npm run db:push --force
```

### Step 4: Start Development
```bash
# Start the development server
npm run dev
```

## Critical Files Included

### Core Application
- ✅ Complete React frontend (client/)
- ✅ Express.js backend (server/) 
- ✅ Shared schemas and types (shared/)
- ✅ All configuration files
- ✅ Documentation and manuals

### Key Features Preserved
- ✅ Multi-agent AI debate system (4 personalities + 14 domain experts)
- ✅ 3-mode complexity system (Simple/Guided/Expert)
- ✅ Enterprise automation suite (time tracking, invoicing, notifications)
- ✅ Real-time collaboration and workspace management
- ✅ Security monitoring and performance analytics
- ✅ Mobile-responsive design
- ✅ Cross-mode debate transfer capabilities
- ✅ Template library and workflow automation

### Database Schema
The system includes a comprehensive database schema with 30+ tables:
- User management and authentication
- Analysis sessions and debate history
- Workspace collaboration
- Enterprise organizations and teams
- Audit logs and security events
- Performance metrics and monitoring
- Automation workflows and time tracking
- Rate limiting and usage analytics

## Verification Steps

After rebuild, verify these endpoints work:
1. `GET /api/health` - System health check
2. `GET /api/sessions` - Session management
3. `POST /api/think` - AI debate endpoint
4. `GET /api/automation/time-logs` - Enterprise features

## Production Deployment

For production, also configure:
- SSL certificates
- Environment-specific variables
- Database connection pooling
- Redis for session storage (optional)
- Load balancer configuration

## File Size: 3.6MB (optimized, excludes node_modules, cache, build artifacts)