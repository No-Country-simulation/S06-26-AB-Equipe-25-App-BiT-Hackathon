from pydantic import BaseModel, Field
from typing import List, Literal

class RegistryValidationResult(BaseModel):
    skills: List[str] = Field(
        description="Lista de habilidades/tecnologias exigidas na vaga"
    )
    level: Literal["intern", "junior", "mid", "senior", "estagio", "pleno"] = Field(
        description="Nível da vaga"
    )
    work_model: Literal["remote", "hybrid", "on-site", "remoto", "hibrido", "presencial"] = Field(
        description="Modelo de trabalho"
    )
