# Learning Dashboard Application

## Overview

This is a React-based learning management dashboard application built with a full-stack TypeScript architecture. The system allows users to track their learning progress through levels, manage tasks, schedule goals, and take learning notes. It features a modern UI with responsive design, supporting both desktop and mobile experiences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation resolvers

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with proper HTTP status codes
- **Data Layer**: In-memory storage implementation (MemStorage) with interface for future database integration
- **Request Handling**: Express middleware for JSON parsing, logging, and error handling
- **Development**: Vite integration for hot module replacement in development mode

### Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (via Neon serverless) - configured but not actively used in current implementation
- **Schema**: Comprehensive database schema defining levels, tasks, schedules, learning notes, and user statistics
- **Current Storage**: In-memory storage for development with interface ready for database migration

### Authentication and Authorization
- No authentication system currently implemented
- Session management configured via connect-pg-simple (prepared for future use)
- CORS and credential handling set up for secure client-server communication

### Component Architecture
- **Design System**: Modular component library with consistent styling
- **Layout**: Responsive dashboard with mobile-first approach
- **Widgets**: Specialized components for calendar, progress tracking, goal management, and note-taking
- **State**: Local state for UI interactions, server state via React Query

### Key Features
- **Level System**: Hierarchical learning progression with progress tracking
- **Task Management**: Task completion within levels with ordering support
- **Scheduling**: Weekly and monthly goal setting with calendar integration
- **Learning Notes**: Note-taking system linked to levels and tasks
- **Progress Visualization**: Progress rings, completion badges, and statistics
- **Responsive UI**: Mobile and desktop optimized interface

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Build Tools**: Vite with TypeScript plugin, ESBuild for production builds
- **Development**: TSX for TypeScript execution, Replit-specific plugins

### UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with PostCSS, class-variance-authority for component variants
- **Icons**: Lucide React for consistent iconography
- **Utilities**: clsx for conditional styling, date-fns for date manipulation

### Data Management
- **Database**: Drizzle ORM with PostgreSQL dialect, Neon serverless driver
- **Validation**: Zod for schema validation, drizzle-zod for schema integration
- **State Management**: TanStack React Query for server state caching and synchronization

### Development and Tooling
- **TypeScript**: Full TypeScript support with strict configuration
- **Session Management**: connect-pg-simple for PostgreSQL session store
- **Routing**: Wouter for lightweight client-side routing
- **Carousel**: Embla Carousel for image/content sliding functionality