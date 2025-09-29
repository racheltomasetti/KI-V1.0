# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal knowledge management and content generation platform built with specialized AI agents. Users undergo comprehensive onboarding, continuously feed knowledge into the system, and generate personalized content (memoir chapters, podcast episodes, video concepts) from their learning journey.

**Architecture**: React frontend + Supabase backend + AI agent orchestration via Pydantic AI

**Key Reference**: See `AGENT.md` for complete agent architecture and system workflows.

## Core Development Principles

- **MVP First** - Build the simplest working version, then iterate
- **Agent-Centric Design** - Every feature serves the agent architecture
- **User Context is King** - All agents need rich user profile context
- **Real-time Experience** - Use Supabase real-time for live agent interactions
- **KISS** - Keep it simple
- **Fail Fast** - Clear errors over silent failures in development

## Tech Stack Standards

### Frontend (React + TypeScript)

```bash
# Development
npm run dev              # Start on port 3000
npm run build            # Build for production
npm run lint             # ESLint check
npm run type-check       # TypeScript validation
```

**Standards:**

- **TypeScript**: Strict mode, explicit types for agent messages
- **Tailwind CSS**: Component styling, responsive design
- **Component Structure**: Agent-specific UI components
- **State Management**: React Context for user session and agent states

### Backend (Python + FastAPI)

```bash
# Development with uv (recommended)
uv sync                  # Install dependencies
uv run python -m src.main  # Start FastAPI server on port 8000
uv run pytest           # Run tests
uv run ruff check        # Lint code
uv run mypy src/         # Type checking
```

**Standards:**

- **Python 3.11+**: Modern Python with type hints
- **FastAPI**: Async web framework for agent API endpoints
- **Pydantic**: Data validation and settings management for agent schemas
- **SQLAlchemy**: ORM with async support for database operations
- **Supabase**: PostgreSQL database with real-time subscriptions

### AI Agent Architecture (Python + Pydantic)

- **Agent Classes**: Pydantic BaseModel for structured agent definitions
- **Message Schemas**: Pydantic models for type-safe agent communication
- **Context Validation**: Automatic validation of user context and agent inputs
- **Claude Integration**: Async HTTP client for Claude API calls
- **State Management**: SQLAlchemy models for persistent agent state

## File Structure

```
/
├── backend/
│   ├── src/
│   │   ├── agents/              # Pydantic agent implementations
│   │   │   ├── base.py         # Base agent class and schemas
│   │   │   ├── orchestrator.py # Main routing agent
│   │   │   ├── onboarding.py   # User profiling agent
│   │   │   ├── knowledge.py    # Content processing agent
│   │   │   └── content/        # Content generation agents
│   │   ├── models/             # SQLAlchemy database models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic layer
│   │   ├── api/                # FastAPI route handlers
│   │   └── main.py            # FastAPI app entry point
│   ├── tests/                  # Python tests
│   └── pyproject.toml         # Python dependencies (uv)
├── frontend/
│   ├── src/
│   │   ├── components/        # React UI components
│   │   │   ├── chat/         # Chat interface components
│   │   │   ├── onboarding/   # Onboarding flow UI
│   │   │   └── content/      # Content display components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client functions
│   │   ├── utils/            # Utility functions
│   │   └── types/            # TypeScript definitions
│   └── package.json          # Node dependencies
├── supabase/
│   └── migrations/           # Database schema
├── AGENT.md                 # Complete architecture reference
└── CLAUDE.md               # This file
```

## Agent Implementation Guidelines

### Agent Base Class (Pydantic)

```python
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from enum import Enum

class AgentType(str, Enum):
    ORCHESTRATOR = "orchestrator"
    ONBOARDING = "onboarding"
    KNOWLEDGE = "knowledge"
    MEMOIR = "memoir"
    PODCAST = "podcast"
    VIDEO = "video"

class AgentMessage(BaseModel):
    type: str = Field(..., description="Message type: request, response, handoff")
    from_agent: AgentType = Field(..., description="Source agent")
    to_agent: AgentType = Field(..., description="Target agent")
    payload: Dict[str, Any] = Field(..., description="Message content")
    metadata: Dict[str, Any] = Field(default_factory=dict)

class UserContext(BaseModel):
    user_id: str
    profile: Optional[Dict[str, Any]] = None
    recent_knowledge: List[Dict[str, Any]] = Field(default_factory=list)
    conversation_history: List[Dict[str, Any]] = Field(default_factory=list)

class BaseAgent(BaseModel):
    name: AgentType
    system_prompt: str
    context_requirements: List[str] = Field(default_factory=list)
    capabilities: List[str] = Field(default_factory=list)

    class Config:
        use_enum_values = True

    async def process_message(self, message: AgentMessage, context: UserContext) -> AgentMessage:
        """Override this method in each agent implementation"""
        raise NotImplementedError
```

### Agent Response Standards

- **Pydantic Validation**: All inputs and outputs are automatically validated
- **Type Safety**: Strong typing for agent messages and context
- **Async Operations**: All agent methods are async for database and API calls
- **Error Handling**: Pydantic ValidationError for malformed data
- **Context Injection**: User context automatically loaded and validated

## Database Schema Patterns

Reference the complete schema in `AGENT.md`. Key SQLAlchemy patterns:

```python
from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()

class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    personality_profile = Column(JSON)  # Structured Pydantic data
    life_timeline = Column(JSON)        # List of life events
    learning_preferences = Column(JSON) # Learning style data
    content_goals = Column(JSON)        # Content creation preferences
    onboarding_completed = Column(Boolean, default=False)

class KnowledgeEntry(Base):
    __tablename__ = "knowledge_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey('user_profiles.user_id'))
    content_type = Column(String)       # article, note, thought, podcast
    raw_content = Column(String)        # Original user input
    processed_themes = Column(JSON)     # Extracted by knowledge agent
    extracted_concepts = Column(JSON)   # Key insights
    user_reflection = Column(String)    # User's thoughts
```

**Patterns:**

- **Pydantic Integration**: JSON columns store validated Pydantic models
- **UUID Primary Keys**: Use UUID4 for distributed system compatibility
- **User Association**: All data linked to authenticated users via foreign keys
- **Flexible Schema**: JSON columns for agent-specific data structures

## Development Workflow

### Phase 1: MVP (5-hour sprint)

1. **Setup**: FastAPI backend + React frontend + Supabase database
2. **Agent Base Classes**: Pydantic models for agent communication
3. **Onboarding Agent**: Structured interview with profile building
4. **Knowledge Agent**: Text processing with theme extraction
5. **Orchestrator Agent**: Message routing between specialized agents
6. **Memoir Agent**: Content generation using user context
7. **API Layer**: FastAPI endpoints for frontend communication
8. **Chat UI**: React interface for agent interactions

### Testing Approach

- **Unit Tests**: Individual agent logic and message handling
- **Integration Tests**: Agent handoffs and context preservation
- **User Flow Tests**: Complete onboarding → knowledge → content flows
- **Manual Testing**: Agent personality and response quality

## Common Patterns

### Agent Implementation

```python
from src.agents.base import BaseAgent, AgentMessage, UserContext, AgentType
from src.services.claude_service import ClaudeService

class OnboardingAgent(BaseAgent):
    name: AgentType = AgentType.ONBOARDING
    system_prompt: str = "You are an expert interviewer extracting deep user insights..."

    def __init__(self):
        super().__init__()
        self.claude_service = ClaudeService()

    async def process_message(self, message: AgentMessage, context: UserContext) -> AgentMessage:
        # Validate required context
        if not context.user_id:
            raise ValueError("User ID required for onboarding")

        # Process with Claude API
        response = await self.claude_service.generate_response(
            system_prompt=self.system_prompt,
            user_message=message.payload.get("user_input"),
            context=context.dict()
        )

        return AgentMessage(
            type="response",
            from_agent=self.name,
            to_agent=message.from_agent,
            payload={"response": response, "context_update": {...}}
        )
```

### Context Loading Service

```python
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import UserProfile, KnowledgeEntry

class ContextService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def load_user_context(self, user_id: str) -> UserContext:
        # Load user profile
        profile = await self.db.get(UserProfile, user_id)

        # Load recent knowledge entries
        recent_knowledge = await self.db.execute(
            select(KnowledgeEntry)
            .where(KnowledgeEntry.user_id == user_id)
            .order_by(KnowledgeEntry.created_at.desc())
            .limit(10)
        )

        return UserContext(
            user_id=user_id,
            profile=profile.dict() if profile else None,
            recent_knowledge=[k.dict() for k in recent_knowledge.scalars()]
        )
```

### FastAPI Agent Endpoint

```python
from fastapi import APIRouter, Depends, HTTPException
from src.agents.orchestrator import OrchestratorAgent
from src.schemas.agent_schemas import ChatRequest, ChatResponse
from src.services.context_service import ContextService

router = APIRouter()
orchestrator = OrchestratorAgent()

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agents(
    request: ChatRequest,
    context_service: ContextService = Depends()
):
    try:
        # Load user context
        context = await context_service.load_user_context(request.user_id)

        # Create agent message
        message = AgentMessage(
            type="request",
            from_agent=AgentType.ORCHESTRATOR,
            to_agent=AgentType.ORCHESTRATOR,
            payload={"user_input": request.message}
        )

        # Process with orchestrator
        response = await orchestrator.process_message(message, context)

        return ChatResponse(
            message=response.payload.get("response"),
            agent=response.from_agent
        )

    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## Error Handling

### Pydantic Validation Errors

```python
from pydantic import ValidationError
from fastapi import HTTPException

try:
    user_context = UserContext(**raw_data)
except ValidationError as e:
    # Log detailed validation error
    logger.error(f"Context validation failed: {e.json()}")
    raise HTTPException(status_code=422, detail="Invalid user context data")
```

### Agent Processing Errors

- **Invalid Context**: Return structured error, request missing data from orchestrator
- **Claude API Failures**: Retry with exponential backoff, fallback to template responses
- **Database Errors**: Log error, return user-friendly message, don't crash conversation
- **Parsing Errors**: Use Pydantic's built-in error handling for structured feedback

### System Errors

- **FastAPI Exception Handlers**: Centralized error handling with proper HTTP status codes
- **Database Connection Issues**: Implement connection pooling and retry logic
- **Authentication Failures**: Return 401 with clear error message
- **Rate Limiting**: Implement per-user rate limits on agent endpoints

## Performance Considerations

- **Context Caching**: Cache user profiles and recent knowledge locally
- **Lazy Loading**: Initialize agents only when needed
- **Background Processing**: Handle knowledge analysis asynchronously
- **Real-time Updates**: Use Supabase subscriptions for live agent responses

## Security Notes

- **Row Level Security**: All database queries respect user ownership
- **Input Validation**: Sanitize all user content before processing
- **API Rate Limits**: Implement reasonable limits on AI agent calls
- **Content Filtering**: Basic content safety checks on user uploads

## Deployment

### MVP Deployment (Quick)

- **Backend**: Railway/Render (FastAPI auto-deploy from GitHub)
- **Frontend**: Vercel (React auto-deploy from GitHub)
- **Database**: Supabase cloud (managed PostgreSQL)
- **AI Integration**: Claude API (Anthropic)

### Environment Variables

```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:port/dbname
ANTHROPIC_API_KEY=your-claude-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-service-key

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Quality Standards

- **Code Quality**: Python type hints, Pydantic validation, FastAPI best practices
- **Agent Quality**: Natural responses with proper context awareness and personality
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling
- **Data Integrity**: SQLAlchemy relationships and constraints, Pydantic model validation
- **User Experience**: Smooth onboarding flow, intuitive agent interactions, real-time updates

## Success Metrics for MVP

- **Onboarding Completion**: Users finish the profile interview
- **Knowledge Processing**: Articles/notes get properly analyzed
- **Content Generation**: Memoir agent produces coherent, personal content
- **Agent Handoffs**: Smooth transitions between agents
- **Performance**: Sub-2s response times for agent interactions

---

Remember: Focus on core agent functionality first, polish later. Every component should serve the agent architecture defined in `\backend\AGENT.md`.
