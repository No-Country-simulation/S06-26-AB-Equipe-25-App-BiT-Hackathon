from langchain.agents import create_agent
from core.config import settings
from prompts.insights import INSIGHTS_PROMPT

def generate_insights(shortlist_json: str, cdrview_json: str) -> str:
    agent = create_agent(
        model=settings.MODEL_NAME,
        system_prompt=INSIGHTS_PROMPT,
    )
    user_content = f"[SHORTLIST_JSON]\n{shortlist_json}\n\n[CDRVIEW_JSON]\n{cdrview_json}"
    
    result = agent.invoke(
        {"messages": [{"role": "user", "content": user_content}]}
    )
    return result["messages"][-1].content
