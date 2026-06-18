# Arquitetura Técnica Preliminar

## Objetivo

Definir a estrutura arquitetural, os componentes e a stack tecnológica do MVP da Plataforma App BiT B2B. O foco é em agilidade de implementação, facilidade de deploy e integração simples entre Frontend, Backend e o Agente de IA.

## Componentes

A arquitetura será dividida em quatro componentes principais:

1. **Frontend (SPA/PWA):** Interface responsiva para o recrutador.
2. **Backend (API API RESTful):** Orquestrador de regras de negócio, motor de matching determinístico e integrador de IA.
3. **Persistência / Banco de Dados:** Armazenamento das vagas e da massa de candidatos mockados + dados territoriais agregados.
4. **Agente de IA (LLM):** Serviço externo (OpenAI, Gemini) chamado via API pelo backend para gerar insights explicativos.

## Stack Recomendada (Sugestão para o MVP)

| Componente | Tecnologia Sugerida | Justificativa | Alternativa Aceitável |
|---|---|---|---|
| **Frontend** | React (Next.js ou Vite) + Tailwind | Alta familiaridade da comunidade, ecossistema rico e rápido para UI components. | Vue.js |
| **Backend** | Node.js + Express (ou Fastify/NestJS) | Rápida implementação de APIs JSON, código assíncrono excelente para I/O (integração LLM). | Python (FastAPI) |
| **Linguagem** | TypeScript | Garante tipagem no contrato (Zod) entre Front e Back, evitando erros bobos na demo. | JavaScript |
| **Validação** | Zod | Valida payloads pesados da vaga e respostas da LLM antes de enviar ao Front. | Yup/Joi |
| **Banco de Dados** | SQLite (ou PostgreSQL no Supabase) | SQLite é perfeito para rodar local na demo sem precisar de docker/infra complexa. | JSON estático |
| **ORM/Query** | Prisma | Facilita a modelagem inicial e tipagem automática do TypeScript para o motor de match. | Drizzle / Knex |
| **Deploy** | Render / Vercel | Deploy contínuo atrelado ao GitHub, camada grátis generosa, zero devops. | Railway |

## Fluxo de Dados (Workflow do Matching)

1. **Input:** O Recrutador submete o formulário no Frontend.
2. **Requisição:** O Frontend envia um `POST /match` com payload JSON para o Backend.
3. **Recuperação:** O Backend consulta o Banco de Dados para trazer a base de candidatos mockados disponíveis.
4. **Cálculo Determinístico:** O Backend executa em memória o algoritmo de score (Skills, Nível, Localização, Diversidade).
5. **Composição e Métricas:** O Backend seleciona o Top N candidatos e calcula `diversidade_shortlist`.
6. **Insight de IA:** O Backend pega a Shortlist + Métricas e envia como prompt (via API de IA - ex: OpenAI SDK) pedindo uma explicação da lista e recomendações de conectividade baseada nos dados do CDRView injetados nos candidatos.
7. **Resposta:** A IA devolve o insight textual; o Backend consolida no JSON e devolve para o Frontend.
8. **Visualização:** Frontend renderiza a lista, os crachás de diversidade, o mapa e o texto explicativo da IA.

## Módulos do Backend

- **API Router:** Gerencia rotas e middlewares (ex: validação via Zod).
- **Matching Engine:** Serviço isolado contendo as regras matemáticas/pesos (fácil de debugar e testar).
- **AI Service:** Serviço responsável por empacotar a string do prompt com os dados da shortlist e chamar o provedor de LLM com fallback de segurança (try/catch retornando string genérica se a IA falhar).
- **Seed Script (ETL Simples):** Um arquivo `seed.ts` que deve ser rodado uma única vez para limpar o banco e inserir os "Candidatos Mockados + Regiões do CDRView".

## Riscos e Mitigação

| Risco | Mitigação |
|---|---|
| **Latência alta na IA** | Usar modelos rápidos (ex: GPT-4o-mini ou Gemini Flash). Não deixar a IA fazer processamento pesado, apenas leitura do JSON montado. |
| **IA alucinando atributos** | O backend não usará a resposta da IA para dados estruturados. A IA devolverá apenas um campo de string "insight" para ser lido pelo recrutador. |
| **Lentidão em banco de dados / dataset** | Como não usaremos o CDRView bruto, e sim uma base local (SQLite) mockada de ~200 candidatos com agregados geográficos associados, a latência será próxima de 0. |

## Próximos Passos

1. Configurar o repositório base monorepo ou multi-repo.
2. Definir o Schema do Prisma/Banco de Dados para o objeto `Candidate`.
3. Escrever o script de Seed (`seed.ts`) cruzando Mock com clusters geográficos.
4. Codificar a função base matemática do `Matching Engine`.
