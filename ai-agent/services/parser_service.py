from langchain.agents import create_agent
from core.config import settings
from prompts.job_parser import JOB_NORMALIZATION_PROMPT
from schemas.job_schema import RegistryValidationResult

def extract_job_info(job_text: str):
    agent = create_agent(
        model=settings.MODEL_NAME,
        system_prompt=JOB_NORMALIZATION_PROMPT,
        response_format=RegistryValidationResult,
    )
    result = agent.invoke(
        {"messages": [{"role": "user", "content": job_text}]}
    )
    # create_agent from your setup returns a dict with 'messages'
    return result["messages"][-1].content
