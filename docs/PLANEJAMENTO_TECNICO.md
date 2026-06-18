# Planejamento Técnico — MVP App BiT B2B

## Visão Geral

Este documento unifica e orquestra todas as estratégias técnicas, de arquitetura e de produto do MVP da Plataforma de Matching Inclusivo App BiT B2B. O objetivo principal deste MVP é demonstrar à banca avaliadora que é possível transformar os requisitos de uma vaga corporativa em uma *shortlist* inteligente, equitativa e baseada em evidências territoriais do dataset Vísent CDRView.

### O que o MVP entrega?
Um fluxo web (SPA) simples e limpo, focado na figura do **Recrutador**. Ele pública a vaga, a aplicação faz o *match* matemático com base nos currículos de uma base mockada, e enriquece a decisão com mapas geográficos e insights de IA que contextualizam conectividade, acessibilidade e diversidade (meta ESG) da amostra.

### O que o MVP exclui?
- Telas B2C (aplicativo do candidato real).
- Lógica de billing / pagamento ou painéis administrativos complexos.
- Inferência de IA decidindo pesos ocultos ou classificando candidatos automaticamente (evitando o "black-box HR AI risk").

---

## Estratégias Core Consolidadas

Para se aprofundar, consulte os artefatos gerados deste planejamento:

1. [**Estratégia do Dataset (`DATASET_STRATEGY.md`)**](./DATASET_STRATEGY.md)
   * **Resumo:** O arquivo CDRView atua como camada territorial. Nenhuma leitura de CSV será feita on-the-fly pela API. Um script Node/Python prévio construirá agregados territoriais e índices de conectividade (ETL).

2. [**Estratégia de Candidatos (`MOCK_CANDIDATES_STRATEGY.md`)**](./MOCK_CANDIDATES_STRATEGY.md)
   * **Resumo:** Para contornar a ausência de skills no CDRView e restrições da LGPD, 100% dos candidatos serão sintéticos/fictícios, com habilidades plausíveis atreladas explicitamente a `clusters_id` e coordenadas extraídas do dataset base.

3. [**Política de Matching (`MATCHING_POLICY.md`)**](./MATCHING_POLICY.md)
   * **Resumo:** Um motor de cálculo determinístico no backend ditará a relevância dos candidatos (Skill = 50%, Nível = 15%, Região = 15%, Modalidade = 10%, Territorial = 10%). A meta de diversidade entra como validador da composição da shortlist (agregada) e não como bônus pontual no indivíduo.

4. [**Papel do Agente de IA (`AI_AGENT_STRATEGY.md`)**](./AI_AGENT_STRATEGY.md)
   * **Resumo:** A IA atua como um *explicador e recomendador*. Ao receber o payload do backend contendo a shortlist pronta e o resumo geográfico, o LLM gera parágrafos de insights em linguagem natural, validando a segurança do processo e recomendando apoios operacionais (ex: suporte à internet para áreas 3G).

5. [**Contratos de API (`API_CONTRACT.md`)**](./API_CONTRACT.md)
   * **Resumo:** Contrato REST minimalista focado em `/api/v1/match` e `/api/v1/insights`, reduzindo complexidade e latência na integração front/back.

6. [**Decisões Arquiteturais (`ARCHITECTURE.md`) e Técnicas (`DECISOES_TECNICAS.md`)**](./ARCHITECTURE.md)
   * **Resumo:** Uso de TypeScript/Node.js, React (Next/Vite) e SQLite/Prisma. Foco absoluto em familiaridade da equipe e estabilidade para a demo (menos DevOps, mais lógica de negócio).

---

## Fases de Execução Recomendadas

### Fase 1: Fundação & Dados (Dias 1-2)
- **Repo & Ambiente:** Criação do repositório no GitHub (Monorepo Front+Back simplifica a vida para o MVP).
- **ETL Simples:** Extrair as coordenadas e estatísticas macro dos arquivos `tensor_concentracao.csv`, `antenas_flp.csv` e `tensor_mobilidade.csv`.
- **Seed.ts:** Escrever o script que gera a tabela de candidatos mockados cruzada com as regiões extraídas no passo anterior e salva no SQLite.

### Fase 2: Backend & Motor de Matching (Dias 3-5)
- **API Setup:** Instanciar o servidor Express/Fastify.
- **Lógica Central:** Programar o motor de scoring matemático.
- **Testes Manuais:** Testar payloads via Insomnia/Postman; certificar de que as notas priorizam skills e respeitam as regras da *Matching Policy*.

### Fase 3: Frontend & IA (Dias 6-8)
- **Telas Básicas:** Construção dos forms de vagas, design system (ex: Tailwind) usando a estratégia de Cores de Acessibilidade (alto contraste).
- **Integração IA:** Conectar o endpoint do backend à API do OpenAI/Gemini injetando a shortlist + CDRView. Renderizar a string da IA no UI.

### Fase 4: Polimento Demo (Dias 9-10)
- **Data Cleanup:** Garantir que existam candidatos perfeitos na base de Seed para as buscas que serão testadas na banca. A demo não deve dar chance ao azar de buscar algo e retornar vazio.
- **Roteiro Demo:** Redação do `DEMO_SCRIPT.md` focado no storytelling do recrutador descobrindo uma região sub-atendida de alta empregabilidade.

---

## Riscos Principais a Monitorar

- **Overengineering de Dados:** Tentar plotar milhôes de pontos dos CSVs num mapa. A interface vai travar. Use apenas pontos agrupados (clusters).
- **Alucinação da IA:** Garantir que o Prompt limite radicalmente a criatividade da IA ("Responda apenas com base neste JSON: [payload]").
- **Cores & UX Genérica:** Tratando-se de ESG, invista em design inclusivo e não caia em "dashboards cinzas com tabelas chatas". A visualização das badges, score bars e mapa deve saltar aos olhos.

---
**Status do Planejamento:** CONCLUÍDO / PRONTO PARA EXECUÇÃO.
