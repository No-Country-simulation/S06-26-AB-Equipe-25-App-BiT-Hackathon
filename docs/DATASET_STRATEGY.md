# Estratégia de Uso do Dataset CDRView

## Contexto

A plataforma App BiT B2B tem como objetivo conectar empresas a talentos de grupos sub-representados. O projeto tem à disposição o dataset Vísent CDRView, que fornece dados geoespaciais, de mobilidade e conectividade baseados em ERBs (antenas). O desafio é extrair valor deste dataset para apoiar o recrutamento inclusivo sem tratá-lo incorretamente como uma base real de currículos.

## Decisão recomendada

O dataset CDRView atuará exclusivamente como **camada de inteligência territorial**. Ele não será consultado em runtime bruto, mas sim processado previamente (ETL) para gerar dados agregados que alimentarão a aplicação. O foco do uso será entender o **potencial regional de recrutamento inclusivo**, não a avaliação individual técnica de candidatos.

## Uso em Camadas

O consumo do dataset será segmentado em camadas de prioridade para o MVP:

1. **Base Principal (Essencial):** `tensor_concentracao.csv`, `antenas_flp.csv`, `assinantes.csv`.
   - **Uso:** Geolocalização, concentração regional de talentos potenciais e base de distribuição para os candidatos mockados.
2. **Base Analítica (Pré-processamento):** `tensor_mobilidade.csv`.
   - **Uso:** Geração de indicadores agregados por região sobre conectividade (tecnologia predominante), taxa de drop e acessibilidade digital.
3. **Base Complementar:** `tensor_od.csv`, `trajetos_comuns.csv`, `tensor_tempo_deslocamento.csv`.
   - **Uso:** Análise de mobilidade, viabilidade de vagas presenciais/híbridas e barreiras físicas de deslocamento.
4. **Base Opcional (Despriorizada no MVP):** `tensor_fluxo_vias.csv` e `tensor_sequencias.csv`.
   - **Uso:** Apenas se houver tempo, para mapas visuais avançados. Sequências não serão usadas devido à complexidade e risco à anonimização.

## Justificativa

Tratar arquivos pesados em tempo real (runtime) adicionaria complexidade técnica, alto custo computacional e latência incompatível com a experiência web. Além disso, o dataset original reflete comportamento de dispositivos e tráfego, não currículos. Processar previamente estes dados para associá-los a regiões e enriquecer candidatos sintéticos garante viabilidade, segurança (LGPD) e alinhamento com a meta do MVP.

## Alternativas consideradas

| Alternativa | Vantagens | Riscos | Veredito |
|---|---|---|---|
| **Ler CSVs brutos via backend em cada request** | Evita etapa de ETL; dados sempre "atualizados" se o arquivo mudar. | Lento, travamentos no servidor, consumo excessivo de memória, inviabiliza demo ágil. | **Descartada** |
| **Usar CDRView como base primária de candidatos** | Usa o dado fornecido diretamente. | Ausência de skills, cargos, nível profissional; viés de comportamento de rede não reflete talento. | **Descartada** |
| **ETL para banco relacional/JSON estático (Recomendada)** | Alta performance, estrutura sob medida para os endpoints, estabilidade na demo. | Requer script prévio de carga de dados. | **Aprovada** |

## Impacto técnico e no MVP

- **Backend:** Deverá consultar tabelas ou arquivos JSON estáticos já agregados por `regiao_id` ou `cluster_id`.
- **Frontend:** Receberá dados mastigados para plotar mapas de concentração e exibir badges de "Baixa Conectividade Regional".
- **Dados:** Necessidade de construir um script Python ou Node.js (ETL) simples antes do backend subir para agregar dados das antenas e concentração.
- **IA:** Terá acesso aos agregados territoriais para explicar ao recrutador (ex: "Candidato ideal está em uma região com conectividade limitada, considere auxílio internet").
- **Demo:** Fluxo rápido, sem gargalos de processamento de dados, focando no insight visual e na decisão.
