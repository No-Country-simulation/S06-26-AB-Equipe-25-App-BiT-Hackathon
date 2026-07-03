from fastapi import FastAPI
from api.routes import router

app = FastAPI(title="App BiT - AI Agent Copilot")

app.include_router(router, prefix="/api/v1")
@app.get("/")
async def root():
    return {"message": "Bem vindo ao agente LumiAI - O agente que ilumina talentos onde o mercado não enxerga."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
