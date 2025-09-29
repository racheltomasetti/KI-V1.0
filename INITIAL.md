# INITIAL.md - Personal Knowledge AI Agent System

## Project Vision

We are building a **personal knowledge management and content generation platform** powered by specialized AI agents. Users undergo a comprehensive onboarding process to build a rich personal profile, then continuously feed knowledge and experiences into the system. The platform identifies patterns and connections in their learning journey, enabling them to generate personalized content like memoir chapters, podcast episodes, and video concepts.

Think of it as a **digital extension of the user's mind** - capturing their thoughts, processing their learning, and helping them create meaningful content from their accumulated knowledge and experiences.

## Core User Journey

### 1. Onboarding Experience

- User completes a 15-20 question conversational interview with an AI agent
- System extracts personality traits, life timeline, learning preferences, content goals
- Builds comprehensive user profile that serves as foundation for all interactions

### 2. Knowledge Capture

- User uploads articles, notes, podcast transcripts, thoughts, reflections
- Knowledge agent processes content to extract themes, concepts, connections
- System builds a searchable knowledge base with user's personal learning journey

### 3. Content Generation

- User requests content based on their knowledge and experiences
- Specialized agents (memoir, podcast, video) create personalized content
- Output reflects user's unique voice, experiences, and accumulated knowledge

### 4. Pattern Recognition

- System identifies recurring themes across user's knowledge entries
- Surfaces insights about learning patterns, interests, and knowledge evolution
- Suggests content ideas based on knowledge clusters and gaps

## Agent Architecture Overview

```
User Interface (React Frontend)
           ↓
    Orchestrator Agent (Main Router)
           ↓
    ┌──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼
Onboarding  Knowledge  Content   Pattern
  Agent      Agent    Agents     Agent
    │          │         │         │
    └──────────┴─────────┴─────────┘
           ↓
    Database Layer (User Profiles, Knowledge, Content)
```

### Agent Responsibilities:

- **Orchestrator**: Routes messages, manages conversations, handles context
- **Onboarding**: Conducts personality interviews, builds user profiles
- **Knowledge**: Processes uploaded content, extracts themes and concepts
- **Content Agents**: Generate memoir chapters, podcast episodes, video concepts
- **Pattern**: Analyzes knowledge trends, surfaces insights and connections

## Technical Architecture Principles

### Backend (Python + FastAPI + Pydantic AI)

- **FastAPI**: RESTful APIs with automatic documentation and validation
- **Pydantic AI**: Type-safe agent definitions with structured communication
- **SQLAlchemy**: Async ORM for complex data relationships
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Claude API**: Primary AI model for all agent personalities

### Frontend (React + TypeScript)

- **React**: Component-based UI with agent-specific interfaces
- **TypeScript**: Type safety matching backend Pydantic models
- **Tailwind CSS**: Responsive design system
- **WebSocket**: Real-time agent communication
- **Context API**: State management for user sessions and agent interactions

### Data Architecture

- **User Profiles**: Personality data, life timeline, preferences (JSON/structured)
- **Knowledge Entries**: Raw content, extracted themes, concepts, reflections
- **Generated Content**: AI-created content with source attribution and user feedback
- **Agent Conversations**: Message history, conversation state, session management

## Key Technical Concepts

### Agent Communication

- Standardized message protocol with type safety
- Context preservation across agent handoffs
- Structured payloads with user profile injection
- Error handling and graceful fallbacks

### User Context Management

- Rich user profiles from onboarding process
- Dynamic context loading based on conversation needs
- Knowledge base filtering for relevant information
- Session state management across agent interactions

### Content Generation Pipeline

1. User request → Orchestrator analysis
2. Context gathering (profile + relevant knowledge)
3. Agent selection based on content type
4. AI generation with user voice/style
5. Content validation and user presentation
6. Feedback collection and learning

## Development Approach

### MVP Priority (5-Hour Sprint)

Focus on core agent functionality first, polish later. Every component should serve the agent architecture and user experience.

**Core MVP Components:**

1. FastAPI backend with agent base classes
2. Onboarding agent with conversational interview
3. Knowledge agent with basic text processing
4. Simple memoir agent for content generation
5. React chat interface for agent interactions
6. Database setup with user profiles and knowledge storage
7. Authentication and basic session management

### Success Metrics for MVP

- Users complete onboarding and have rich profiles created
- Knowledge processing works (articles → themes/concepts)
- Content generation produces coherent, personal memoir content
- Agent handoffs happen smoothly without losing context
- Chat interface feels natural and responsive

## File Structure Overview

```
/
├── backend/
│   ├── src/
│   │   ├── agents/           # Pydantic AI agent implementations
│   │   ├── models/           # SQLAlchemy database models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic layer
│   │   ├── api/             # FastAPI route handlers
│   │   └── main.py          # Application entry point
│   └── tests/               # Python test suite
│   └── AGENT.md             # Complete architecture reference

├── frontend/
│   ├── src/
│   │   ├── components/      # React UI components
│   │   ├── services/        # API client functions
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript definitions
│   └── package.json         # Node dependencies
├── supabase/
│   └── migrations/          # Database schema migrations
├── CLAUDE.md                # Development guidelines
```

## What Makes This Project Unique

### Personal Context Engine

Unlike generic AI assistants, every interaction is deeply personalized using the user's complete profile, learning history, and knowledge base. The system knows the user's personality, preferences, and accumulated knowledge.

### Learning Evolution Tracking

The system captures not just information, but the user's relationship with that information - their thoughts, reflections, and how concepts connect to their personal experience.

### Multi-Modal Content Creation

Generate various content formats (memoir, podcast, video) from the same knowledge base, each optimized for its medium while maintaining the user's authentic voice.

### Compound Knowledge Growth

As users add more knowledge, the system becomes more valuable - finding deeper patterns, making richer connections, and generating more sophisticated content.

## Current Development Status

**Phase**: Initial Architecture & MVP Development
**Focus**: Building core agent framework and basic functionality
**Timeline**: 5-hour sprint to working prototype
**Next Steps**: Implement onboarding agent and knowledge processing pipeline

## Key References

- **AGENT.md**: Complete technical architecture and agent specifications
- **CLAUDE.md**: Development guidelines and coding standards
- **Database Schema**: See AGENT.md for complete data models and relationships
- **Agent Communication Protocol**: Standardized message formats in AGENT.md

## Development Philosophy

- **MVP First**: Ship working functionality quickly, iterate based on user feedback
- **Agent-Centric**: Every feature serves the agent architecture and user experience
- **Type Safety**: Leverage Pydantic and TypeScript for robust, validated communication
- **User Context is King**: Rich personalization drives all agent interactions
- **Fail Fast**: Clear errors in development to identify and fix issues quickly

This system represents the future of personal knowledge management - not just storing information, but actively helping users learn, reflect, and create meaningful content from their intellectual journey.
