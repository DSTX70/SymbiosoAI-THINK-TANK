# SymbiosoAi ThinkTank - Multi-Agent AI Debate Platform

## Overview

SymbiosoAi ThinkTank is an enterprise-grade collaborative intelligence platform that leverages multiple AI agents to conduct structured debates and generate consensus-driven insights. The application provides three progressive complexity levels: **Simple** mode for quick analysis, **Guided** mode with intermediate configuration options, and **Expert** mode with comprehensive enterprise features including interactive fact-checking, visual journey mapping, template management, team collaboration capabilities, and advanced AI configuration options. The platform orchestrates debates between specialized AI agents (Analyst, Critic, Synthesizer, and Domain Expert) to produce well-reasoned conclusions, identify dissenting viewpoints, and highlight unresolved questions.

## Recent Changes

**September 2025 - Authentication System Overhaul & UI Improvements:**
- ✅ **Complete Authentication System Fix**: Resolved critical login visibility issues where users couldn't access login buttons
- ✅ **Demo Login Implementation**: Added simple username/password demo login system (demo/demo123) for easy platform access
- ✅ **Landing Page Authentication**: Integrated AuthStatusPanel with clear authentication status display
- ✅ **Session Management**: Fixed session persistence and auth state synchronization across browser tabs
- ✅ **UI Clarity Improvements**: 
  - When logged out: Shows "Demo Login" and "OAuth Sign In" buttons
  - When logged in: Shows "✅ Signed in as [Name]" with "Start Analysis" button
- ✅ **Error Resolution**: Fixed "Page not found" errors after successful login
- ✅ **Mobile responsiveness**: Fixed mobile header layout with responsive design
- ✅ **Navigation**: Sessions moved to same line as logo, right-justified
- ✅ **AI service stability**: Improvements and error handling
- ✅ **Expert page enhancements**: Added Agent Selection & Configuration section

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
The client-side application is built using **React** with **TypeScript** and follows a modern component-based architecture. The UI leverages **shadcn/ui** components for a consistent design system, styled with **Tailwind CSS** for responsive layouts optimized for both desktop and mobile devices. The application uses **wouter** for lightweight client-side routing and **TanStack Query** for server state management and API communication. The frontend is structured with clear separation between pages (`/simple`, `/guided`, and `/expert`), reusable components, and utility functions.

#### Mobile-First Responsive Design
- **Adaptive Header Layout**: Two-tier mobile header with logo/Sessions/menu on top row, main navigation centered below
- **Mobile Dropdown Menu**: Hamburger menu containing BETA badge, authentication, theme toggle, help, and API connection status
- **Touch-Optimized Navigation**: Properly sized touch targets for mobile interaction
- **Responsive Component Layouts**: All UI components adapt gracefully across screen sizes

### Expert Mode Enterprise Features
The Expert mode provides a comprehensive 3-tab enterprise interface:
- **Expert Analysis Tab**: Advanced AI debate configuration with Agent Selection & Configuration section, domain experts, reasoning frameworks, thinking patterns, and workspace management
- **Template Library Tab**: Pre-built analysis templates with ratings, categories, and management capabilities
- **Workspace Tab**: Team collaboration features with real-time sync, permissions management, and session sharing

#### Agent Selection & Configuration System
Both Guided and Expert modes now feature a unified Agent Selection & Configuration interface:
- **Smart Selection**: AI automatically chooses optimal agents based on prompt analysis
- **Manual Selection**: Users select from 5 core AI personalities (Analyst, Pragmatist, Innovator, Thoughtful, Critic)
- **Domain Experts**: 14 specialized experts across legal, medical, financial, technical, and research domains
- **Use Case Templates**: Pre-configured agent combinations for specific scenarios (business analysis, technical debates, creative brainstorms, etc.)

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

#### Current Authentication System
The platform now provides **two authentication methods** for user access:

**1. Demo Login (Quick Access)**
- **Username**: `demo`
- **Password**: `demo123`
- **Purpose**: Instant platform access without external account setup
- **Features**: Full access to all analysis modes (Simple, Guided, Expert)
- **Location**: "Quick Demo Access" section on landing page

**2. OAuth Authentication**
- **Provider**: Replit OAuth integration
- **Purpose**: Secure authentication with existing Replit accounts
- **Features**: Full platform access with personalized user profile
- **Location**: "OAuth Sign In" button on landing page

#### Authentication UI States
The landing page **AuthStatusPanel** displays different states based on user authentication:

**When Not Logged In:**
- Shows "Quick Demo Access:" section
- Displays "Demo Login" button (opens credentials form)
- Displays "OAuth Sign In" button (redirects to OAuth flow)

**When Logged In:**
- Shows "✅ Signed in as [User Name]" message
- Displays "Start Analysis" button for immediate access to Simple mode
- Shows user avatar dropdown with Profile, Settings, and Sign Out options

#### Technical Implementation
- **Session Storage**: PostgreSQL sessions with `connect-pg-simple` for persistence
- **State Management**: TanStack Query with real-time auth state synchronization
- **Security**: Passport.js authentication middleware with proper session handling
- **Error Handling**: Comprehensive error management with user-friendly messaging

#### How to Access the Platform
1. **Visit the homepage** - Authentication options are visible in the "Quick Demo Access" section
2. **Demo Login**: Click "Demo Login" → Use pre-filled credentials (demo/demo123) → Click "Login"
3. **OAuth Login**: Click "OAuth Sign In" → Complete Replit authentication flow
4. **Start Analyzing**: Once logged in, click "Start Analysis" or navigate to any analysis mode

The authentication system ensures seamless access while maintaining security and session persistence across browser sessions.

## External Dependencies

### AI Services
- **OpenAI API**: Primary language model provider using GPT-4 for multi-agent conversations with robust error handling and response validation
- **Anthropic Claude**: Secondary AI provider (optional) for additional model diversity
- **AI Service Layer**: Enhanced with proper data type enforcement, consensus response handling, and comprehensive error management

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

The architecture prioritizes modularity and maintainability, with clear separation between the AI orchestration layer, data persistence, and user interface components. The responsive design ensures optimal user experience across all device types, from desktop workstations to mobile phones. This design enables easy extension of AI capabilities and user interface enhancements while maintaining system reliability and accessibility.