# Papel do Agente de IA

## Contexto

A solução tem a proposta de usar um Agente de IA para apoiar as decisões no processo de recrutamento inclusivo, mas é preciso demarcar sua responsabilidade para evitar "caixas-pretas" algorítmicas, decisões subjetivas e alucinações sobre candidatos de minorias. 

## Decisão recomendada

O Agente de IA será um **copiloto do recrutador e explicador de dados**, e **nunca um tomador de decisão** ou um classificador de candidatos. O ranqueamento (matching) será inteiramente realizado pelo backend. O agente entrará em ação logo após a geração da shortlist para gerar resumos, relatórios executivos e insights que unam os dados de competência dos candidatos com as métricas geográficas do CDRView e metas ESG da empresa.

## Responsabilidades Principais (MVP)

1. **Interpretar a Vaga (Data Normalization):**
   - Transforma a linguagem natural do recrutador (ex: "Preciso de um dev backend junior com Node e banco") em um JSON estruturado de filtros (`skills`, `nível`, `modalidade`).
2. **Explicar a Shortlist:**
   - Elabora um parágrafo que justifica por que determinados candidatos estão no topo (ex: "A lista foca em alta aderência técnica às skills requeridas e forte compatibilidade regional").
3. **Gerar Insights de Inclusão e Infraestrutura:**
   - Detectar e avisar sobre barreiras territoriais identificadas na integração com os dados do CDRView (ex: "30% dos candidatos qualificados encontram-se em áreas de menor conectividade. Recomendamos apoio com infraestrutura").
4. **Sugerir Melhorias no Filtro da Vaga:**
   - Alertar o recrutador quando requisitos limitam desnecessariamente o pool de talentos. (ex: "Exigir presencialidade restringe o alcance em 80% do potencial diverso, considere abrir modalidade híbrida").

## O que a IA NÃO pode fazer (Restrições Éticas)

- Decidir quem entra ou sai da shortlist;
- Inventar ou interpolar atributos profissionais (skills/senioridade) ou declarativos (badges de diversidade) para candidatos reais ou mockados;
- Penalizar candidatos com base no perfil comportamental;
- Substituir o algoritmo matemático de matching do backend.

## Justificativa

Separar as responsabilidades aumenta o nível de confiança (Trust) do usuário no sistema. Para empresas grandes e metas ESG rigorosas, decisões de seleção sem explicabilidade algorítmica ou tomadas por IAs puras podem incorrer em grandes penalizações regulatórias e quebrar a confiança na plataforma.

## Alternativas avaliadas

| Alternativa | Vantagens | Riscos | Veredito |
|---|---|---|---|
| **IA processa todos os dados e retorna o ranking ("Full-AI")** | Impressiona como IA generativa pura. | Alto custo de token, resultados imprevisíveis e não auditáveis, alucinações. | **Descartada** |
| **Agente restrito apenas ao chatbot suporte** | Muito simples e seguro. | Baixo valor agregado; não auxilia a inteligência estratégica de recrutamento. | **Descartada** |
| **IA Copiloto Explicadora (Recomendada)** | Agrega valor à tomada de decisão sem ferir políticas éticas e LGPD. | Exige montar os prompts e templates cuidadosamente no backend. | **Aprovada** |

## Impacto no planejamento

- **Backend:** Precisará montar endpoints que recebam a `shortlist` e o JSON do `CDRView` e enviem como contexto ao LLM (OpenAI/Gemini). O backend então orquestrará a resposta da IA.
- **Frontend:** Implementará componentes de UI como "Insight do Recrutador" e "Resumo de Diversidade" que exibe o retorno da IA logo acima ou ao lado da shortlist.
- **Dados:** Fornecer os resumos territoriais formatados e enxutos para não estourar os limites de token da IA.
- **Demo:** Teremos um momento de "Aha!" quando a IA mostrar que entende não apenas de currículos, mas de geografia social de conectividade para promover impacto ESG.
