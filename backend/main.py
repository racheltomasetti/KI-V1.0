from fastapi import FastAPI
from pydantic import BaseModel
from anthropic import AsyncAnthropic
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(title="Minimal AI Agents", version="1.0.0")

# Initialize Anthropic client
anthropic_client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

# Pydantic models for requests/responses
class ChatRequest(BaseModel):
    message: str
    agent_type: str = "onboarding"  # onboarding, knowledge, memoir

class ChatResponse(BaseModel):
    response: str
    agent_type: str

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
async def chat_with_agent(request: ChatRequest):
    """Chat with an AI agent"""
    try:
        # Get the appropriate system prompt
        system_prompt = AGENT_PROMPTS.get(request.agent_type, AGENT_PROMPTS["onboarding"])
        
        # Call Claude API
        response = await anthropic_client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1000,
            temperature=0.7,
            system=system_prompt,
            messages=[{
                "role": "user",
                "content": request.message
            }]
        )
        
        # Extract response text
        response_text = response.content[0].text if response.content else "Sorry, I couldn't process that."
        
        return ChatResponse(
            response=response_text,
            agent_type=request.agent_type
        )
        
    except Exception as e:
        return ChatResponse(
            response=f"Error: {str(e)}",
            agent_type=request.agent_type
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)