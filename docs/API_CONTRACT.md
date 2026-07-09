# Contrato Inicial da API

## Contexto

Para garantir agilidade no desenvolvimento do MVP e evitar bloqueios entre as frentes de Frontend e Backend, é necessário estabelecer um contrato inicial para a API (OpenAPI/REST). A prioridade máxima do MVP é o fluxo de publicação de vagas e retorno da shortlist, enriquecida por insights do agente de IA e dados territoriais.

## Decisão recomendada

A API seguirá o padrão **RESTful usando JSON**, focando inicialmente em dois endpoints principais obrigatórios para a demo: `POST /match` (cálculo da shortlist) e `GET /insights` (dados agregados geográficos). Outros endpoints complementares podem ser mockados se houver falta de tempo.

## Endpoints Principais (MVP)

### 0. Autenticação da Empresa

Cria e autentica a conta corporativa usada pelo fluxo B2B.

**Endpoint:** `POST /api/v1/auth/signup`

```json
{
  "company_name": "Empresa Demo",
  "segment": "Tecnologia",
  "email": "talentos@empresa.com",
  "password": "appbit123",
  "regiao": "Florianopolis - SC",
  "meta_diversidade": 45
}
```

**Endpoint:** `POST /api/v1/auth/login`

```json
{
  "email": "talentos@empresa.com",
  "password": "appbit123"
}
```

Resposta esperada:

```json
{
  "message": "Login realizado com sucesso",
  "company": {
    "id": "uuid-empresa-x",
    "name": "Empresa Demo",
    "segment": "Tecnologia",
    "region": "Florianopolis - SC",
    "contact_email": "talentos@empresa.com",
    "diversity_goal": 0.45
  }
}
```

---

### 0.1. Vagas Publicadas

Cria e lista vagas persistidas por empresa.

**Endpoint:** `GET /api/v1/jobs?company_id=uuid-empresa-x`

**Endpoint:** `POST /api/v1/jobs`

```json
{
  "company_id": "uuid-empresa-x",
  "titulo": "Desenvolvedor Backend Pleno",
  "area": "Backend",
  "skills": ["Node.js", "TypeScript", "PostgreSQL"],
  "nivel": "pleno",
  "regiao": "Florianopolis - SC",
  "modalidade": "remoto",
  "descricao": "Desenvolvimento de APIs REST com Node.js e TypeScript.",
  "diversidade_minima": 40,
  "status": "aberta"
}
```

**Endpoint:** `POST /api/v1/jobs/{job_id}/matches`

Gera uma shortlist a partir da vaga persistida, substitui os matches anteriores dessa vaga e retorna o mesmo formato principal de `POST /api/v1/match`, acrescido de `job_id` e `matches`.

---

### 1. Criar Matching e Gerar Shortlist

Gera a lista de candidatos com base na vaga informada e retorna também as métricas e o insight gerado pela IA.

**Endpoint:** `POST /api/v1/match`

#### Payload de Requisição (Request)

```json
{
  "empresa_id": "uuid-empresa-x",
  "vaga": {
    "titulo": "Desenvolvedor Backend Júnior",
    "skills": ["Node.js", "PostgreSQL", "APIs REST"],
    "nivel": "junior",
    "regiao": "Salvador - BA",
    "modalidade": "hibrido"
  },
  "filtros": {
    "anti_vies": true,
    "diversidade_minima": 40
  }
}
```

#### Payload de Resposta (Response)

```json
{
  "candidatos": [
    {
      "candidato_id": "uuid-candidato-y",
      "nome": "C. Silva",
      "score_match": 87,
      "badge_diversidade": ["Mulher negra em tecnologia"],
      "skills": ["Node.js", "PostgreSQL", "Docker"],
      "localizacao": {
        "regiao": "Salvador - BA",
        "lat": -12.9714,
        "lng": -38.5014,
        "conectividade": "4G"
      }
    }
  ],
  "metricas": {
    "total_analisados": 120,
    "diversidade_resultado": {
      "percentual_diversidade": 62,
      "criterio_minimo_atendido": true
    }
  },
  "ai_insight": "A shortlist apresenta forte aderência técnica (especialmente Node e Postgre) e supera a meta de diversidade (62%). Notamos candidatos em áreas de 4G instável; caso avance, cogite modelo remoto e apoio de equipamento."
}
```

---

### 2. Obter Insights Geográficos (Mapa de Talentos)

Recupera os dados macro de potencial regional, cruzando o dataset CDRView com as categorias de candidatos sintéticos.

**Endpoint:** `GET /api/v1/insights`

#### Payload de Resposta (Response)

```json
{
  "mapa_talentos": [
    {
      "regiao": "Salvador - BA",
      "cluster_id": 105,
      "concentracao_candidatos": 78,
      "tecnologia_predominante": "4G",
      "indicador_mobilidade": "alta",
      "perfis_disponiveis": [
        "Desenvolvedor Backend",
        "Analista de Dados"
      ]
    }
  ]
}
```

## Justificativa

Um contrato simplificado que mescla o score de match, os dados de candidato e a resposta da IA em um único endpoint (`/match`) reduz drásticamente o número de chamadas de rede no front-end, garantindo uma demo rápida. O frontend pode carregar a tela completa com apenas um request após o envio do formulário.

## Impacto no planejamento

- **Backend:** Deverá orquestrar três passos dentro de `POST /match`: (1) Filtrar e ranquear DB, (2) Calcular métricas, (3) Chamar LLM para construir a string `ai_insight`, antes de retornar a request ao cliente.
- **Frontend:** Pode iniciar o mock local usando estes exatos JSONs para codificar e estilizar a UI imediatamente.
- **IA:** O prompt no backend consumirá este formato base de candidato e métricas para montar o parágrafo humanizado.
