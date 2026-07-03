from dotenv import load_dotenv
from langchain.agents import create_agent
from typing import List, Literal
from pydantic import BaseModel, Field

load_dotenv()


def get_weather(city: str) -> str:
    """Get weather for a given city."""
    return f"It's always sunny in {city}!"


class RegistryValidationResult(BaseModel):
    skills: List[str] = Field(
        description="Lista de habilidades/tecnologias exigidas na vaga"
    )
    level: Literal["intern", "junior", "mid", "senior"] = Field(
        description="Nível da vaga"
    )
    work_model: Literal["remote", "hybrid", "on-site"] = Field(
        description="Modelo de trabalho"
    )


job_normalization_prompt = """
# PERSONA E PAPEL
Você é um Engenheiro de Dados especialista em Recursos Humanos (Recrutamento e Seleção). Sua única função é analisar textos livres de descrição de vagas de emprego enviados por recrutadores e extrair informações de forma estritamente estruturada.

# DIRETRIZES DE EXTRAÇÃO (CHAVES DO JSON)
Você deve identificar e mapear as seguintes informações na saída:

1. **`skills`**: Uma lista (array) contendo todas as ferramentas, linguagens de programação, frameworks e soft skills mencionadas explicitamente no texto.
2. **`nivel`**: O nível de senioridade da vaga. Classifique estritamente entre uma destas opções: `estagio`, `junior`, `pleno` ou `senior`.
3. **`modalidade`**: O modelo de trabalho. Classifique estritamente entre uma destas opções: `presencial`, `hibrido` ou `remoto`.

# REGRAS CRÍTICAS

* **Ausência de Dados:** Se uma informação (como o nível ou a modalidade) não for explicitamente mencionada no texto, defina o valor da chave como `null`.
* **Proibição de Alucinação:** Não invente, deduza ou assuma requisitos que não foram textualmente citados pelo recrutador.
* **Formato de Saída:** A resposta deve ser estritamente o objeto JSON gerado. É proibido incluir qualquer tipo de saudação, introdução, notas de rodapé ou explicações antes ou depois do JSON.

# EXEMPLO DE SAÍDA ESPERADA
{
  "skills": ["JavaScript", "React", "Comunicação"],
  "nivel": "junior",
  "modalidade": "hibrido"
}
"""
job_normalization = create_agent(
    model="google_genai:gemini-2.5-flash-lite",
    # tools=[get_weather],
    system_prompt=job_normalization_prompt,
    response_format=RegistryValidationResult,
)

# Teste agent normalização de vagas
# result = job_normalization.invoke(
#     {
#         "messages": [
#             {
#                 "role": "user",
#                 "content": "Olá, estamos expandindo a equipe e preciso urgente abrir uma posição para pessoa desenvolvedora backend de nível pleno. O profissional tem que ter experiência sólida construindo APIs com Node.js e manjar de banco de dados, preferencialmente PostgreSQL. Conhecimento em AWS e Docker são grandes diferenciais. A vaga é no formato 100% remoto, então candidato pode estar em qualquer estado.",
#             }
#         ]
#     }
# )


insights_prompt = """
# PERSONA e PAPEL
Você é o "App BiT Copilot", um consultor sênior especialista em impacto ESG, diversidade corporativa e inteligência territorial. Seu papel é explicar o contexto territorial de forma neutra, consultiva e analítica, sem realizar julgamentos de valor sobre quem é melhor ou pior.

# CONTEXTO DE ENTRADA
Você receberá dois blocos de dados essenciais:
1. **SHORTLIST:** Dados dos candidatos previamente selecionados e aprovados matematicamente pelo nosso motor determinístico.
2. **CDRVIEW:** Dados macroeconômicos e de infraestrutura de telecomunicação (cobertura 3G/4G/5G, adensamento urbano, etc.) das regiões onde residem esses candidatos.

# SUA TAREFA
Escreva um **resumo executivo** direcionado ao recrutador. 
* **Tamanho máximo:** Até 3 parágrafos curtos.
* **Tom:** Corporativo, encorajador e consultivo.

# DIRETRIZES E REGRAS CRÍTICAS

* **Proibição de Ranquear:** Você NÃO tem permissão para ranquear candidatos, apontar "o melhor", nem avaliar as capacidades técnicas individuais de ninguém.
* **Foco Territorial (CDRView):** Foque em analisar as barreiras territoriais encontradas nos dados locais. 
  * *Exemplo:* "Notei que 40% dos talentos estão em regiões com baixa cobertura 4G/5G."
* **Soluções Construtivas:** Sugira formas práticas para a empresa apoiar esses candidatos e mitigar os desafios geográficos.
  * *Exemplo:* "Para viabilizar a contratação remota e cumprir a meta ESG, considere fornecer auxílio-conectividade ou hotspot móvel."
* **Diversidade:** Destaque positivamente como a amostra atual atende aos critérios e metas de diversidade procurados pela organização.
* **Ancoragem em Dados:** Não invente ou alucine dados. Utilize estritamente as informações presentes nos blocos fornecidos.

# FORMATO DA SAÍDA
* Retorne o texto utilizando Markdown limpo (organizado com negritos e bullet points onde necessário para garantir a legibilidade).
"""

insights_agent = create_agent(
    model="google_genai:gemini-2.5-flash-lite",
    # tools=[get_weather],
    system_prompt=insights_prompt,
)

result = insights_agent.invoke(
    {
        "messages": [
            {
                "role": "user",
                "content": """
                [SHORTLIST_JSON]
                {
                "total_candidatos": 5,
                "perfil_predominante": "Desenvolvedor Node.js Pleno",
                "representatividade_diversidade": "80% da lista é composta por mulheres e pessoas negras"   
                }
            
                [CDRVIEW_JSON]
                {
                "regioes_afetadas": ["Zona Norte - SP", "Região Metropolitana - Salvador"],
                "conectividade_media": "3G / Sinal instável",
                "infraestrutura_logistica": "Baixo adensamento de serviços"
                }

                """,
            }
        ]
    }
)

# O objeto da mensagem padrão do LangChain utiliza '.content' e não '.content_blocks'
print(result["messages"][-1].content)
