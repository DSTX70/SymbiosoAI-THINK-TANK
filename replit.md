# SymbiosoAi ThinkTank - Multi-Agent AI Debate Platform

## Overview

SymbiosoAi ThinkTank is a collaborative intelligence platform that leverages multiple AI agents to conduct structured debates and generate consensus-driven insights. The application provides two interaction modes: a streamlined "Simple" mode for quick analysis and a comprehensive "Guided" mode with advanced configuration options. The platform orchestrates debates between specialized AI agents (Analyst, Critic, Synthesizer, and Domain Expert) to produce well-reasoned conclusions, identify dissenting viewpoints, and highlight unresolved questions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built using **React** with **TypeScript** and follows a modern component-based architecture. The UI leverages **shadcn/ui** components for a consistent design system, styled with **Tailwind CSS** for responsive layouts. The application uses **wouter** for lightweight client-side routing and **TanStack Query** for server state management and API communication. The frontend is structured with clear separation between pages (`/simple` and `/guided`), reusable components, and utility functions.

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