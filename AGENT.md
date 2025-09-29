# AGENT.md - Personal Knowledge & Content Generation System

## System Overview

This system is a personal knowledge management and content generation platform that helps users capture, organize, and transform their learning journey into various forms of content. The architecture is built around specialized AI agents that work together to create a seamless experience from onboarding to content creation.

## Core Concept

Users go through a comprehensive onboarding process to build a foundational profile, then continuously feed knowledge and experiences into the system. The platform identifies patterns, themes, and connections in their learning, enabling them to generate personalized content like memoir chapters, podcast episodes, and video concepts.

---

## Agent Architecture

### Agent Hierarchy

```
┌─────────────────────────────────────────┐
│           MAIN ORCHESTRATOR             │
│    (Central Router & Conversation)      │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐    ┌───▼───┐    ┌───▼───┐
│ ONBO  │    │ KNOWL │    │ CONTE │
│ AGENT │    │ AGENT │    │ AGENT │
└───────┘    └───────┘    └───┬───┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
                ┌───▼───┐  ┌───▼───┐  ┌───▼───┐
                │MEMOIR │  │PODCAST│  │ VIDEO │
                │ AGENT │  │ AGENT │  │ AGENT │
                └───────┘  └───────┘  └───────┘
```

---

## Agent Specifications

### 1. ONBOARDING AGENT

**Purpose:** Extract comprehensive user profile during initial setup

**Responsibilities:**

- Conduct structured personality interview (15-20 strategic questions)
- Map personal history, defining moments, and life timeline
- Identify learning patterns, curiosities, and knowledge preferences
- Establish content creation goals and preferred output formats
- Build foundational user context for all future interactions

**Key Capabilities:**

- Adaptive questioning based on user responses
- Deep psychological profiling through conversation
- Timeline construction and life event mapping
- Learning style identification

**Input:** User responses to guided interview questions
**Output:** Structured user profile → `user_profiles` table
**State Management:** Maintains conversation context, tracks completion percentage

### 2. MAIN ORCHESTRATOR

**Purpose:** Central routing, conversation management, and system coordination

**Responsibilities:**

- Route user requests to appropriate specialized agents
- Maintain conversation continuity across agent handoffs
- Synthesize responses from multiple agents into coherent replies
- Handle general queries and system navigation
- Manage agent communication protocol

**Key Capabilities:**

- Intent recognition and agent selection
- Context preservation across conversations
- Multi-agent response synthesis
- Fallback handling for unknown requests

**Input:** User messages, agent responses, system state
**Output:** User-facing responses, agent routing decisions
**State Management:** Current conversation context, active agent tracking, session management

### 3. KNOWLEDGE AGENT

**Purpose:** Process, analyze, and organize incoming knowledge and content

**Responsibilities:**

- Parse and analyze uploaded content (articles, notes, podcasts, thoughts)
- Extract key themes, concepts, and actionable insights
- Categorize and tag information for easy retrieval
- Identify connections and patterns across knowledge entries
- Generate user reflections and learning summaries

**Key Capabilities:**

- Multi-format content processing (text, audio transcripts, PDFs)
- Theme extraction using NLP techniques
- Concept relationship mapping
- Pattern recognition across time and topics

**Input:** Raw content uploads, user reflections, learning notes
**Output:** Processed knowledge entries → `knowledge_entries` table
**State Management:** Processing queue, extraction patterns, user learning trends

### 4. CONTENT GENERATION AGENTS

#### MEMOIR AGENT

**Purpose:** Generate autobiographical and reflective content

**Context Requirements:**

- Complete user profile and personality data
- Relevant life events and defining moments
- Related knowledge entries that inform the narrative
- User's preferred writing style and tone

**Output Formats:**

- Memoir chapters organized chronologically or thematically
- Life story excerpts and vignettes
- Reflective essays on personal growth
- Timeline-based narrative structures

**Style:** Reflective, narrative-driven, chronologically coherent, emotionally resonant

#### PODCAST AGENT

**Purpose:** Create conversational audio content and episode concepts

**Context Requirements:**

- User's knowledge patterns and areas of expertise
- Communication style and personality traits
- Learning journey and key insights
- Topics of ongoing interest and curiosity

**Output Formats:**

- Episode scripts with natural conversation flow
- Discussion frameworks and talking points
- Solo episode concepts and monologue structures
- Interview question sets based on user expertise

**Style:** Conversational, educational, engaging, accessible

#### VIDEO AGENT

**Purpose:** Generate visual content concepts and video frameworks

**Context Requirements:**

- User's visual learning preferences
- Key concepts that benefit from visual explanation
- Storytelling preferences and narrative style
- Technical comfort level with video creation

**Output Formats:**

- Video concept outlines with visual elements
- Script structures optimized for visual storytelling
- Educational content frameworks
- Short-form video concepts for social platforms

**Style:** Dynamic, visual-first, narrative-driven, platform-optimized

---

## Data Architecture

### Database Schema (Platform-Agnostic Logical Design)

The data architecture should support these core entities regardless of implementation:

```
User Profiles Table:
- user_id (Primary Key, UUID)
- personality_profile (Structured JSON/Document)
  * Big 5 personality traits, communication preferences
  * Learning styles and content consumption patterns
- life_timeline (Structured JSON/Document)
  * Key events, milestones, defining moments with timestamps
- learning_preferences (Structured JSON/Document)
  * Preferred formats, topics, pace, complexity levels
- content_goals (Structured JSON/Document)
  * Desired output formats, audiences, purposes, frequency
- onboarding_completed (Boolean flag)
- metadata (Timestamps, versioning, flags)

Knowledge Entries Table:
- id (Primary Key, UUID)
- user_id (Foreign Key reference)
- content_type (Enumerated: article, note, thought, podcast, book, video)
- title (Text, indexed for search)
- raw_content (Large text field for original content)
- processed_themes (Structured JSON/Document)
  * Extracted themes with confidence scores and relationships
- extracted_concepts (Structured JSON/Document)
  * Key ideas, definitions, insights with metadata
- user_reflection (Text field for personal thoughts)
- tags (Array/List of strings, both user and auto-generated)
- source_metadata (JSON for URLs, authors, publication data)
- processing_status (Enumerated: pending, processing, complete, error)
- metadata (Timestamps, processing logs, version info)

Generated Content Table:
- id (Primary Key, UUID)
- user_id (Foreign Key reference)
- agent_type (Enumerated: memoir, podcast, video, etc.)
- content_type (Enumerated: chapter, episode, script, outline)
- title (Text, user-editable)
- content (Large text field for generated content)
- source_knowledge_ids (Array of UUIDs referencing knowledge entries)
- generation_context (Structured JSON/Document)
  * User context, prompts, model parameters used
- user_feedback (Text field for user response/edits)
- quality_score (Numeric rating for content quality)
- is_favorite (Boolean flag for user preferences)
- version_info (For content revision tracking)
- metadata (Generation timestamps, model used, processing time)

Agent Conversations Table:
- id (Primary Key, UUID)
- user_id (Foreign Key reference)
- agent_type (Enumerated agent identifier)
- conversation_state (Structured JSON/Document)
  * Current step, completion status, collected data
- message_history (Array of structured message objects)
- session_metadata (Context, preferences, temporary data)
- last_active (Timestamp for session management)
- is_complete (Boolean flag for conversation status)
- metadata (Session duration, message count, outcomes)
```

### Relationship Design Principles:

- **User-Centric**: All data tied to authenticated users with proper access controls
- **Flexible Schema**: JSON/Document fields for agent-specific data structures
- **Audit Trail**: Comprehensive metadata for debugging and improvement
- **Performance**: Proper indexing on frequently queried fields (user_id, timestamps, content_type)
- **Scalability**: UUID primary keys for distributed system compatibility

### Data Flow Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   USER      │◄──►│ ORCHESTRATOR │◄──►│   AGENT     │
│ INTERFACE   │    │    LAYER     │    │  NETWORK    │
│             │    │              │    │             │
│ - Chat UI   │    │ - Routing    │    │ - Onboard   │
│ - Upload    │    │ - Context    │    │ - Knowledge │
│ - Display   │    │ - Synthesis  │    │ - Content   │
└─────────────┘    └──────┬───────┘    └─────────────┘
                          │
                 ┌────────▼────────┐
                 │   DATA LAYER    │
                 │   (Supabase)    │
                 │                 │
                 │ - Real-time DB  │
                 │ - Auth          │
                 │ - File Storage  │
                 └─────────────────┘
```

---

## Agent Communication Protocol

### Standard Message Format

```javascript
{
  type: "request" | "response" | "handoff" | "context_update",
  from: "orchestrator" | "onboarding" | "knowledge" | "memoir" | "podcast" | "video",
  to: "target_agent_name",
  payload: {
    context: {
      user_profile: {}, // Current user context
      conversation_history: [], // Recent relevant messages
      active_knowledge: [] // Relevant knowledge entries
    },
    request: {
      intent: "string", // What the user wants to accomplish
      parameters: {}, // Specific request parameters
      priority: "high" | "medium" | "low"
    }
  },
  metadata: {
    timestamp: "ISO_DATE_STRING",
    conversation_id: "UUID",
    requires_followup: boolean
  }
}
```

### Agent State Management

Each agent maintains:

- **Active Context:** Current user profile and relevant data
- **Conversation State:** Progress through multi-step processes
- **Working Memory:** Temporary data for current task
- **Capability Status:** Available functions and current capacity

---

## System Workflows

### 1. New User Onboarding Flow

```
User Registration → Authentication → Orchestrator Welcome →
Onboarding Agent Activation → Guided Interview (15-20 questions) →
Profile Construction → Database Storage →
Orchestrator Handback → System Tour → Ready State
```

**Key Questions in Onboarding:**

- Personal history and defining moments
- Current interests and curiosities
- Learning preferences and styles
- Content creation goals
- Communication preferences
- Professional background and expertise
- Values and motivations

### 2. Knowledge Upload & Processing Flow

```
User Uploads Content → Orchestrator Receives →
Knowledge Agent Processing → Content Analysis →
Theme/Concept Extraction → Database Storage →
Pattern Recognition → User Notification →
Suggested Connections/Actions
```

**Processing Steps:**

1. Content format detection and parsing
2. Key concept and theme extraction
3. Relationship mapping to existing knowledge
4. User reflection prompt generation
5. Categorization and tagging
6. Integration with user profile

### 3. Content Generation Flow

```
User Content Request → Orchestrator Analysis →
Context Gathering (Profile + Relevant Knowledge) →
Appropriate Content Agent Selection →
Content Generation → Quality Check →
Database Storage → User Presentation →
Feedback Collection
```

**Generation Process:**

1. Intent recognition and agent selection
2. Context compilation from multiple sources
3. Content generation with user voice/style
4. Internal quality and coherence check
5. User presentation with edit options
6. Feedback incorporation and learning

### 4. Pattern Recognition & Insights Flow

```
Background Process → Knowledge Entry Analysis →
Cross-Reference with User Profile → Pattern Detection →
Insight Generation → Notification/Suggestion Creation →
User Presentation at Appropriate Time
```

---

## Technical Implementation Notes (Still ironing out technical implementation)

<!-- ### Frontend Architecture (React)
- **Component Structure:** Agent-specific UI components
- **State Management:** React Context for user session and agent states
- **Real-time Updates:** Supabase real-time subscriptions for live content
- **Routing:** React Router for navigation between agent interfaces

### Backend Architecture (Supabase + Edge Functions)
- **Database:** PostgreSQL with Row Level Security
- **Authentication:** Supabase Auth with email/password
- **Real-time:** WebSocket connections for live agent communication
- **AI Integration:** Edge Functions calling Claude API
- **File Storage:** Supabase Storage for uploaded documents

### AI Integration
- **Primary Model:** Claude (Anthropic) for all agent personalities
- **Context Management:** Structured prompts with user profile injection
- **Response Processing:** JSON-structured outputs for consistent parsing
- **Error Handling:** Graceful fallbacks and retry mechanisms

### Performance Considerations
- **Lazy Loading:** Agent initialization only when needed
- **Context Caching:** Frequently accessed user data cached locally
- **Background Processing:** Knowledge analysis happens asynchronously
- **Progressive Enhancement:** Core functionality works without real-time features -->

---

## Development Priorities

### Phase 1 (MVP - 5 hours)

1. Onboarding Agent with core interview functionality
2. Basic Knowledge Agent for text processing
3. Simple Memoir Agent for content generation
4. Orchestrator with basic routing
5. Minimal UI with chat interface

### Phase 2 (Enhancement)

1. Advanced pattern recognition
2. Additional content agents (Podcast, Video)
3. Enhanced UI with specialized interfaces
4. Real-time collaboration features
5. Export and sharing capabilities

### Phase 3 (Scale)

1. Multi-modal content processing
2. Advanced personalization
3. Collaborative features
4. Integration with external platforms
5. Analytics and insights dashboard

---

## Success Metrics

**User Engagement:**

- Onboarding completion rate
- Knowledge entries per user per month
- Content generation requests per session
- Time spent in system per visit

**Content Quality:**

- User satisfaction with generated content
- Edit/revision rates on generated content
- Content reuse and sharing rates
- User feedback scores

**System Performance:**

- Agent response times
- Context accuracy in responses
- Error rates and recovery success
- Knowledge processing accuracy

---

This architecture provides a platform-agnostic foundation for building a personal knowledge and content generation system using AI agents. The principles and patterns outlined here can be implemented using various technology stacks while maintaining consistency in agent behavior, data flow, and user experience. The system is designed to scale from a simple MVP to a comprehensive platform for personal knowledge management and content creation.
