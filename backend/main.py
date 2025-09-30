from fastapi import FastAPI, Depends
from pydantic import BaseModel
from anthropic import AsyncAnthropic
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user, JWTPayload

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Minimal AI Agents", version="1.0.0")

# Connect to frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
         "http://localhost:5174",

        "http://localhost:3000",  # Just in case
        "http://127.0.0.1:5173"   # Alternative localhost
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
# Initialize Anthropic client
anthropic_client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Pydantic models for requests/responses
class ChatRequest(BaseModel):
    message: str
    agent_type: str = "onboarding"  # onboarding, knowledge, memoir
    # Note: user_id now comes from JWT token, not request body

class ChatResponse(BaseModel):
    message: str
    agent: str
    user_id: str

# Agent system prompts
AGENT_PROMPTS = {
    "onboarding": """You are an expert interviewer conducting a comprehensive personality interview. 
    Your goal is to extract deep insights about the user's personality, life experiences, 
    learning preferences, and content creation goals through natural conversation.
    Ask thoughtful, engaging questions that help build a rich user profile.""",
    
    "knowledge": """You are a knowledge processing expert. Analyze the user's content and extract 
    key themes, concepts, and insights. Help them understand patterns in their learning 
    and make connections between different pieces of information.""",
    
    "memoir": """You are a skilled memoir writer. Help users create compelling personal narratives 
    from their experiences and knowledge. Write in their authentic voice and create content 
    that reflects their unique personality and journey."""
}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Minimal AI Agents Backend", "status": "running"}

@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy", "agents": list(AGENT_PROMPTS.keys())}

@app.post("/chat", response_model=ChatResponse)
async def chat_with_agent(
    request: ChatRequest,
    user: JWTPayload = Depends(get_current_user)
):
    """
    Chat with an AI agent - PROTECTED ROUTE
    Requires valid Supabase JWT token in Authorization header
    """
    try:
        # User ID comes from verified JWT token
        user_id = user.sub
        user_email = user.email

        # Get the appropriate system prompt
        system_prompt = AGENT_PROMPTS.get(request.agent_type, AGENT_PROMPTS["onboarding"])

        # Enhance system prompt with user context
        enhanced_prompt = f"{system_prompt}\n\nUser context: ID={user_id}, Email={user_email}"

        # Call Claude API
        response = await anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            temperature=0.7,
            system=enhanced_prompt,
            messages=[{
                "role": "user",
                "content": request.message
            }]
        )

        # Extract response text
        response_text = response.content[0].text if response.content else "Sorry, I couldn't process that."

        return ChatResponse(
            message=response_text,
            agent=request.agent_type,
            user_id=user_id
        )

    except Exception as e:
        return ChatResponse(
            message=f"Error: {str(e)}",
            agent=request.agent_type,
            user_id=user.sub
        )

@app.get("/me")
async def get_user_info(user: JWTPayload = Depends(get_current_user)):
    """
    Get current authenticated user information - PROTECTED ROUTE
    """
    return {
        "user_id": user.sub,
        "email": user.email,
        "role": user.role,
        "onboarding_completed": False  # TODO: Fetch from database
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)