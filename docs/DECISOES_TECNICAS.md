# Registro de Decisões Técnicas

Este documento centraliza as principais decisões de engenharia, dados e produto para o MVP da Plataforma App BiT B2B.

---

## Decisão 1: Uso restrito do dataset CDRView como inteligência territorial

## Motivo
O dataset contém informações de telecomunicação (antenas, conectividade, tráfego), mas não dados curriculares. Usá-lo diretamente como currículo geraria inconsistências e feriria propósitos éticos e LGPD. A extração de inteligência focará no enriquecimento regional.

## Alternativas avaliadas

| Alternativa | Vantagens | Riscos | Veredito |
|---|---|---|---|
| Usar bruto em runtime | Dispensa preparação | Lento, pesado, não performa em Web | Descartada |
| Usar como base de CV | 100% integração visual | Falso e inviável tecnicamente | Descartada |
| Pré-processar (ETL) e enriquecer mocks | Alta performance, utilidade validada | Requer script pré-demo | **Aprovada** |

## Impacto no planejamento
- **Backend:** Consultas rápidas focadas em região/cluster.
- **Dados:** Criação de ETL simplificado (Node.js/Python) para agregar CSVs pesados em JSONs/tabelas leves.
- **Demo:** Fluxo ágil e focado na apresentação de valor.

---

## Decisão 2: Uso de candidatos 100% sintéticos (mockados)

## Motivo
Evita vazamento de dados (LGPD), alucinações incontroláveis e ausência de atributos fundamentais para a vaga (skills, nível). Os candidatos mockados garantem que a jornada fim a fim do recrutador seja perfeita na demonstração.

## Alternativas avaliadas

| Alternativa | Vantagens | Riscos | Veredito |
|---|---|---|---|
| CVs Públicos da Web | Realismo de dados | Processo moroso de scraping, adequação LGPD | Descartada |
| Base Mockada + CDRView | Seguro, controlável | Sensação de dados falsos se mal balanceado | **Aprovada** |

## Impacto no planejamento
- **Backend:** Deverá conter script de Seed para injetar cerca de 100 a 200 candidatos falsos no banco.
- **Frontend:** Consome de forma transparente.
- **Dados:** Devem associar cada mock a uma coordenada/cluster real do CDRView.

---

## Decisão 3: Matching determinístico no Backend

## Motivo
A diversidade não deve ser uma nota cega ou punitiva. Um algoritmo baseado em regras fixas garante transparência (exigida em pautas ESG), fácil testabilidade e foca primariamente na qualificação técnica, evitando "tokenismo".

## Alternativas avaliadas

| Alternativa | Vantagens | Riscos | Veredito |
|---|---|---|---|
| Matching via LLM Prompt | Rápido para implementar sem lógica relacional | Alucinação, viés incontrolável, custo | Descartada |
| Filtro de minorias forçado | Fácil de programar | Falha ética grave de recrutamento | Descartada |
| Fórmula de Pesos Estáticos | Auditável, seguro, configurável | Necessita fine-tuning dos pesos na demo | **Aprovada** |

## Impacto no planejamento
- **Backend:** Criação da classe `MatchingEngine` responsável pelas matemáticas vetoriais e de distância.

---

## Decisão 4: Agente de IA restrito à Explicabilidade (Copiloto)

## Motivo
Decisões de seleção baseadas puramente em modelos preditivos generativos (LLMs) carregam riscos jurídicos e viéses ocultos. O LLM atuará depois que a lista já foi gerada e ordenada, apenas interpretando os resultados e cruzando com metas ESG e problemas de conectividade regional do dataset.

## Alternativas avaliadas

| Alternativa | Vantagens | Riscos | Veredito |
|---|---|---|---|
| Agente avaliador de CV | Impressionante para demo tecnológica | Julgamento injusto, não aprovado em RH | Descartada |
| Agente Chatbot Lateral | Simples de injetar na UI | Não agrega valor real ao fluxo principal | Descartada |
| Copiloto Explicador | Máximo valor agregado sem risco ético | Prompts mais elaborados com injeção de JSON | **Aprovada** |

## Impacto no planejamento
- **Backend:** API do LLM será chamada com um payload restrito contendo o JSON da shortlist + json do CDRView para elaborar a resposta de insight.

---

## Decisão 5: Stack orientada à simplicidade (Node.js/TS + React)

## Motivo
Para um MVP com prazo muito curto, tecnologias de curva de aprendizado baixa e integração FullStack unificada (ex: TypeScript ponta a ponta) evitam erros de conversão e promovem velocidade máxima de entrega. SQLite como banco provê o SQL relacional necessário sem overhead de Docker ou DevOps local.
