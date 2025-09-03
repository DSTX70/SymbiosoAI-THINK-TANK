# SymbiosoAi ThinkTank - Multi-Agent AI Debate Platform

## Overview

SymbiosoAi ThinkTank is an enterprise-grade collaborative intelligence platform that leverages multiple AI agents to conduct structured debates and generate consensus-driven insights. The application provides three progressive complexity levels: **Simple** mode for quick analysis, **Guided** mode with intermediate configuration options, and **Expert** mode with comprehensive enterprise features including interactive fact-checking, visual journey mapping, template management, team collaboration capabilities, and advanced AI configuration options. The platform orchestrates debates between specialized AI agents (Analyst, Critic, Synthesizer, and Domain Expert) to produce well-reasoned conclusions, identify dissenting viewpoints, and highlight unresolved questions.

## Recent Changes

**January 2025 - Enterprise Features Implementation:**
- ✅ Enhanced Visual Journey Timeline with numbered steps, timestamps, and coverage analysis
- ✅ Interactive Fact-Check Configuration with verification depth controls and source requirements
- ✅ Complete Template Library System with pre-built templates, ratings, and category filtering
- ✅ Comprehensive Workspace Management with team collaboration and real-time sync
- ✅ Added 4 new Domain Experts: Grant Writing Expert, HR Domain Expert, Hospitality Expert, Public Safety Expert
- ✅ Expert Mode 3-tab interface (Expert Analysis, Template Library, Workspace)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using **React** with **TypeScript** and follows a modern component-based architecture. The UI leverages **shadcn/ui** components for a consistent design system, styled with **Tailwind CSS** for responsive layouts. The application uses **wouter** for lightweight client-side routing and **TanStack Query** for server state management and API communication. The frontend is structured with clear separation between pages (`/simple`, `/guided`, and `/expert`), reusable components, and utility functions.

### Expert Mode Enterprise Features
The Expert mode provides a comprehensive 3-tab enterprise interface:
- **Expert Analysis Tab**: Advanced AI debate configuration with domain experts, reasoning frameworks, thinking patterns, and workspace management
- **Template Library Tab**: Pre-built analysis templates with ratings, categories, and management capabilities
- **Workspace Tab**: Team collaboration features with real-time sync, permissions management, and session sharing

#### Interactive Fact-Check System
- Clickable confidence percentages with verification states
- Configurable verification depth (Standard/Comprehensive/Expert Review)
- Source count tracking and minimum source requirements
- Auto-generate follow-up questions with categorization and complexity levels

#### Enhanced Visual Journey Timeline
- Numbered step progression with timestamps
- Status indicators and coverage analysis tracking
- Interactive journey mapping with complexity indicators
- Real-time progress visualization during debates

#### Template Management System
- Pre-built templates with star ratings and usage statistics
- Category filtering (Business, Technology, Education, Research)
- Template creation, import, and preview functionality
- "Use Template" integration with debate configuration

#### Workspace Management & Collaboration
- Multi-workspace support with ownership and permission controls
- Real-time synchronization and team chat capabilities
- Session code sharing for instant collaboration
- Cultural adaptation and language preservation options

### Backend Architecture
The server employs **Express.js** with TypeScript in an ESM configuration. The API follows RESTful principles with a primary `/api/think` endpoint that processes multi-agent debate requests. The backend integrates with **OpenAI's API** to orchestrate conversations between specialized AI agents, each with distinct roles and perspectives. The server implements request logging middleware and structured error handling to ensure reliable operation.

### Data Storage Solutions
The application uses **Drizzle ORM** with **PostgreSQL** as the primary database solution, configured through Neon Database's serverless offering. The schema defines users and sessions tables to track debate history and user interactions. For development and testing, the system includes an in-memory storage implementation that can be easily swapped with the database layer.

### Multi-Agent AI System
The core intelligence layer implements a debate orchestration system with four specialized AI agents:
- **Analyst**: Provides data-driven analytical perspectives with evidence-based reasoning
- **Critic**: Challenges assumptions and presents alternative viewpoints
- **Synthesizer**: Builds consensus and integrates different perspectives
- **Domain Expert**: Contributes specialized knowledge and best practices

The debate process runs through multiple rounds (configurable from 1-10 turns) where agents build upon each other's contributions to reach nuanced conclusions.

#### Domain Expert Specializations
The platform includes 18 specialized domain experts covering:
- **Legal**: Legal Analyst, Legal Advocate
- **Medical**: Medical Diagnostician, Medical Researcher
- **Financial**: Financial Analyst, Investment Strategist
- **Technology**: Tech Architect, DevOps Engineer
- **Business**: Brand Strategist, Grant Writing Expert, HR Domain Expert
- **Hospitality**: Hospitality Expert with F&B and venue management expertise
- **Safety**: Public Safety Expert with emergency management and ICS/NIMS expertise
- **Research**: Research Scientist, Educational Psychologist, Behavioral Analyst
- **Sustainability**: Sustainability Consultant, Systems Engineer

### Authentication and Session Management
The system implements session-based tracking using PostgreSQL sessions with `connect-pg-simple` for persistence. User sessions capture debate parameters, results, and telemetry data for analysis and retrieval.

## External Dependencies

### AI Services
- **OpenAI API**: Primary language model provider using GPT-5 for multi-agent conversations
- **Anthropic Claude**: Secondary AI provider (optional) for additional model diversity

### Database and Storage
- **Neon Database**: Serverless PostgreSQL hosting for production data persistence
- **Drizzle ORM**: Type-safe database operations and schema management

### Development and Deployment
- **Vite**: Build tool and development server with React plugin support
- **Replit Integration**: Platform-specific plugins for development environment optimization

### UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Lucide React**: Icon library for consistent visual elements

### State Management and Networking
- **TanStack Query**: Server state management, caching, and API synchronization
- **wouter**: Lightweight routing for single-page application navigation

The architecture prioritizes modularity and maintainability, with clear separation between the AI orchestration layer, data persistence, and user interface components. This design enables easy extension of AI capabilities and user interface enhancements while maintaining system reliability.