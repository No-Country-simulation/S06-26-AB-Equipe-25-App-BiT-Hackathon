from pydantic import BaseModel, Field
from typing import List, Literal, Optional

class RegistryValidationResult(BaseModel):
    skills: List[str] = Field(
        description="Lista de habilidades/tecnologias exigidas na vaga"
    )
    level: Optional[Literal["intern", "junior", "mid", "senior", "estagio", "pleno"]] = Field(
        default=None,
        description="Nível da vaga"
    )
    work_model: Optional[Literal["remote", "hybrid", "on-site", "remoto", "hibrido", "presencial"]] = Field(
        default=None,
        description="Modelo de trabalho"
    )
