# Estratégia de Uso do Dataset CDRView

## Objetivo

O dataset CDRView será utilizado como camada de inteligência territorial do MVP, com o objetivo de transformar dados de mobilidade, concentração, conectividade e região em informações úteis para o recrutador.

A finalidade não é usar o dataset como uma base real de currículos ou talentos profissionais, mas sim como fonte de contexto geográfico e analítico para enriquecer candidatos mockados, gerar métricas, apoiar o matching e produzir insights visuais, como mapas e gráficos.

---

## Decisão principal

O dataset bruto será usado em uma etapa de pré-processamento. A aplicação consumirá dados derivados, agregados e otimizados, evitando leitura direta dos CSVs pesados durante as requisições.

A decisão central é:

> O CDRView será usado como fonte de inteligência territorial. O backend consumirá dados pré-processados para enriquecer candidatos mockados, calcular métricas, apoiar o matching e gerar insights regionais.

---

## Estratégia de uso em camadas

| Camada                                     | Finalidade                                                                  | Arquivos principais                                                     | Resultado esperado                                                                 |
| ------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Referência geográfica**                  | Mapear regiões, clusters, municípios e coordenadas.                         | `antenas_flp.csv`                                                       | Base de localização para mapas, candidatos e insights.                             |
| **Concentração regional**                  | Identificar regiões com maior atividade e densidade populacional sintética. | `tensor_concentracao.csv`                                               | Ranking de regiões, mapa de calor e distribuição territorial.                      |
| **Geração/enriquecimento de candidatos**   | Associar candidatos mockados a regiões coerentes com a base.                | `assinantes.csv`                                                        | Candidatos distribuídos por cluster, município e contexto territorial.             |
| **Conectividade e acessibilidade digital** | Avaliar infraestrutura digital por região.                                  | `tensor_mobilidade.csv`                                                 | Tecnologia predominante, qualidade de rede, congestionamento e alertas de suporte. |
| **Mobilidade e deslocamento**              | Avaliar viabilidade territorial para vagas presenciais ou híbridas.         | `tensor_od.csv`, `trajetos_comuns.csv`, `tensor_tempo_deslocamento.csv` | Insights de deslocamento, acessibilidade e barreiras geográficas.                  |
| **Visualização avançada**                  | Enriquecer mapas com corredores e fluxos.                                   | `tensor_fluxo_vias.csv`                                                 | Camada opcional de fluxos, gargalos e corredores urbanos.                          |

---

## Dados derivados esperados

O pré-processamento deve gerar estruturas mais simples para a aplicação, como:

| Dado derivado                | Descrição                                                               | Uso no MVP                                                    |
| ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| `region_insights`            | Indicadores agregados por região, município ou cluster.                 | Endpoint de insights, gráficos e mapa.                        |
| `connectivity_by_region`     | Tecnologia predominante, qualidade de conexão e congestionamento médio. | Recomendações para vagas remotas/híbridas.                    |
| `mobility_by_region`         | Distância média, fluxo e acessibilidade entre regiões.                  | Apoio à decisão de modalidade da vaga.                        |
| `candidate_geo_distribution` | Distribuição sintética de candidatos por região.                        | Geração de candidatos mockados e métricas da shortlist.       |
| `regional_potential_score`   | Indicador composto de potencial regional.                               | Apoio ao recrutador na identificação de regiões estratégicas. |

---

## Uso no matching

O dataset não será responsável por definir a compatibilidade profissional do candidato. Essa compatibilidade será baseada em dados mockados, como skills, nível, experiência e disponibilidade.

O dataset será usado como contexto complementar para:

* ajustar análise regional;
* identificar concentração de candidatos por zona;
* indicar conectividade da região;
* apontar possíveis barreiras digitais;
* apoiar decisão entre remoto, híbrido e presencial;
* gerar métricas territoriais da shortlist;
* enriquecer a explicação do agente de IA.

---

## Uso nas métricas

O dataset permitirá gerar métricas como:

* distribuição da shortlist por região;
* concentração de candidatos por cluster;
* regiões com maior potencial de busca;
* regiões com menor acessibilidade digital;
* regiões com predominância de 3G, 4G ou 5G;
* possíveis barreiras de deslocamento;
* aderência regional à vaga;
* necessidade de suporte para candidatos de determinadas localidades.

---

## Uso pelo agente de IA

O agente de IA receberá dados já processados pelo backend. Ele não consultará diretamente os CSVs brutos.

O agente poderá usar os dados derivados para:

* explicar por que determinada região tem maior potencial;
* destacar barreiras de conectividade;
* sugerir melhorias na vaga;
* recomendar suporte para candidatos de regiões com menor acesso digital;
* gerar resumo da shortlist com perspectiva territorial;
* transformar métricas técnicas em linguagem compreensível para o recrutador.

---

## O que não será feito

O MVP não deve:

* tratar registros do dataset como candidatos reais;
* inferir skills profissionais a partir de mobilidade;
* inferir diversidade a partir de localização, renda, idade ou comportamento;
* ler CSVs grandes diretamente durante requisições;
* usar conectividade como penalidade automática contra candidatos;
* transformar o projeto em um painel genérico de mobilidade urbana.

---

## Síntese da decisão

O CDRView será usado como base de inteligência territorial para o MVP. Seus dados serão pré-processados em agregados regionais e consumidos pelo backend para enriquecer candidatos mockados, gerar métricas, apoiar matching, alimentar mapas e produzir insights de recrutamento inclusivo.

A aplicação não usará os CSVs brutos pesados em runtime. O backend consumirá dados derivados, otimizados e alinhados ao fluxo principal da demo.
