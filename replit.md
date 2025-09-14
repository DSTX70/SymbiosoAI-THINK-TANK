# SymbiosoAi ThinkTank - Multi-Agent AI Debate Platform

## Overview
SymbiosoAi ThinkTank is an enterprise-grade collaborative intelligence platform leveraging multiple AI agents for structured debates and consensus-driven insights. It offers three complexity levels: Simple, Guided, and Expert, with the latter including advanced features like interactive fact-checking, visual journey mapping, template management, team collaboration, and comprehensive AI configuration. The platform orchestrates debates among specialized AI agents (Analyst, Critic, Synthesizer, Domain Expert) to generate reasoned conclusions, identify dissenting views, and highlight unresolved questions. The project aims to provide a robust, scalable, and intuitive solution for advanced collaborative intelligence, with a vision to become a leading platform for AI-driven decision support and strategic analysis across various industries.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is a React and TypeScript application, using shadcn/ui for consistent design and Tailwind CSS for responsive, mobile-first layouts. It uses wouter for routing and TanStack Query for server state management. The architecture clearly separates analysis pages, enterprise feature pages, trust center pages, and sprint demonstration pages. Responsive design is a core principle, with adaptive headers, mobile dropdown menus, and touch-optimized navigation.

### Expert Mode Enterprise Features
The Expert mode provides a 3-tab interface:
- **Expert Analysis Tab**: Advanced AI debate configuration, including agent selection, domain experts, reasoning frameworks, and workspace management.
- **Template Library Tab**: Manages pre-built analysis templates with ratings and categories.
- **Workspace Tab**: Offers team collaboration, real-time sync, and session sharing.

Key features include:
- **Agent Selection & Configuration**: Unified interface for smart or manual selection of 5 core AI personalities and 14 specialized domain experts.
- **Interactive Fact-Check System**: Clickable confidence percentages, configurable verification depth, source tracking, and automated follow-up questions.
- **Enhanced Visual Journey Timeline**: Numbered steps with timestamps, status indicators, coverage analysis, and real-time progress visualization.
- **Template Management System**: Creation, import, preview, and usage of pre-built templates with category filtering and ratings.
- **Workspace Management & Collaboration**: Multi-workspace support, ownership/permission controls, real-time synchronization, team chat, and session code sharing.

### GA Launch Enterprise Systems
The platform includes comprehensive systems for General Availability (GA):
- **Documentation & Tutorials System**: Searchable live documentation index and interactive tutorial content management.
- **Admin Console & Settings Management**: Full CRUD operations for admin settings with authentication guards.
- **Marketplace Catalog & Publishing**: Browsing, search, publishing workflow, and filtering for marketplace items.
- **Pricing Packages & Configuration**: Comprehensive pricing system with Free, Pro, and Enterprise plans.
- **Changelog & Release Communications**: Management of release notes and publishing workflow for updates.
- **Success Playbooks & Guidance**: Interactive, role-based guidance system with progress tracking.

### Backend Architecture
The server uses Express.js with TypeScript in an ESM configuration, following RESTful principles. It integrates with OpenAI's API for multi-agent debate orchestration and includes comprehensive enterprise API routes. The backend incorporates request logging, circuit breaker protection, structured error handling, and authentication guards for enterprise-grade operation.

### Data Storage Solutions
The application utilizes Drizzle ORM with PostgreSQL (hosted on Neon Database) as the primary data storage. The schema includes core tables for platform functionality and enterprise-specific tables for GA features, all with proper indexing and relationships. An in-memory storage option is available for development and testing.

### Multi-Agent AI System
The core intelligence layer orchestrates debates among four specialized AI agents: Analyst, Critic, Synthesizer, and Domain Expert. Debates run through multiple rounds, building consensus. There are 18 specialized domain experts covering legal, medical, financial, technology, business, hospitality, safety, research, and sustainability fields.

### Authentication and Session Management
The platform offers two authentication methods:
- **Demo Login**: `demo`/`demo123` for quick access to all analysis modes.
- **OAuth Authentication**: Secure sign-in via Replit accounts for full platform access.
The landing page's AuthStatusPanel dynamically displays authentication options or user status. Technical implementation uses PostgreSQL for session persistence, TanStack Query for state management, and Passport.js for authentication.

## External Dependencies

### AI Services
- **OpenAI API**: Primary language model for multi-agent conversations.
- **Anthropic Claude**: Secondary AI provider (optional).

### Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting.
- **Drizzle ORM**: Type-safe database operations.

### Development and Deployment
- **Vite**: Build tool and development server.
- **Replit Integration**: Platform-specific plugins.

### UI and Styling
- **shadcn/ui**: Component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Lucide React**: Icon library.

### State Management and Networking
- **TanStack Query**: Server state management and caching.
- **wouter**: Lightweight routing.