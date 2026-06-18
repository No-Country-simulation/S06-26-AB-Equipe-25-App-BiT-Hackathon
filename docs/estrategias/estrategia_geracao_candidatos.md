# Estratégia de Geração de Candidatos Mockados

## Decisão principal

A base de candidatos do MVP será gerada de forma sintética, com aleatoriedade controlada por regras de negócio, e enriquecida com dados territoriais derivados do dataset CDRView.

A estratégia recomendada é:

> Gerar candidatos sintéticos controlados, usar taxonomias ou referências externas apenas como apoio para vocabulário de skills e ocupações, e enriquecer cada candidato com contexto territorial derivado do CDRView.

Não será utilizada uma base pública de currículos como fonte principal da massa de candidatos. Datasets externos de currículos podem conter problemas de privacidade, licenciamento, viés, inconsistência estrutural e baixa aderência ao contexto territorial do CDRView. Para o MVP, é mais seguro e eficiente controlar a geração dos perfis para demonstrar os cenários desejados da solução.

---

## Justificativa da decisão

O dataset CDRView não contém currículos profissionais, skills técnicas, senioridade, experiências, disponibilidade ou preferências de trabalho. Por isso, esses atributos precisam ser simulados.

Ao mesmo tempo, a massa de candidatos não deve ser puramente aleatória. Ela precisa ser coerente o suficiente para demonstrar o matching, gerar métricas úteis e sustentar a narrativa de recrutamento inclusivo com inteligência territorial.

A solução será gerar candidatos mockados com atributos profissionais sintéticos e associá-los a regiões, clusters e indicadores derivados do CDRView.

---

## Fontes usadas na geração

| Camada de dados           | Fonte                                 | Descrição                                                                                  | Uso no MVP                                                                       |
| ------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Perfil profissional**   | Geração sintética controlada          | Skills, área de atuação, senioridade, experiência, disponibilidade e modalidade preferida. | Base principal do matching.                                                      |
| **Vocabulário de skills** | Taxonomia/referência externa opcional | Lista de skills e ocupações usada apenas como inspiração para criar perfis mais realistas. | Evitar skills incoerentes ou genéricas demais.                                   |
| **Localização**           | CDRView pré-processado                | Município, cluster, latitude, longitude e região.                                          | Distribuição geográfica dos candidatos e mapas.                                  |
| **Conectividade**         | CDRView pré-processado                | Tecnologia predominante, qualidade de rede, congestionamento e acessibilidade digital.     | Insights para vagas remotas/híbridas e recomendações de suporte.                 |
| **Mobilidade**            | CDRView pré-processado                | Distância, deslocamento médio, fluxos regionais e acessibilidade territorial.              | Apoio para vagas presenciais ou híbridas.                                        |
| **Diversidade**           | Mock declarativo                      | Badges de diversidade e indicador de grupo sub-representado.                               | Métricas agregadas, composição da shortlist e demonstração do impacto inclusivo. |

---

## O que não será usado como fonte principal

Não será usada uma base pública de currículos como fonte principal dos candidatos do MVP.

Motivos:

1. Pode haver risco de privacidade ou dados pessoais.
2. A licença pode não permitir uso, modificação ou redistribuição.
3. O dataset pode carregar vieses reais do mercado.
4. A estrutura dos currículos pode exigir muito trabalho de limpeza.
5. Os dados dificilmente terão relação com os clusters e indicadores do CDRView.
6. O foco do MVP não é construir um parser de currículos, mas provar matching inclusivo com inteligência territorial.

---

## Recorte profissional inicial

Para reduzir complexidade, o MVP deve focar em uma ou poucas áreas profissionais. A recomendação inicial é começar com tecnologia, pois facilita a simulação de skills e o cálculo de compatibilidade.

Recorte sugerido:

* Desenvolvedor Backend
* Desenvolvedor Frontend
* Desenvolvedor Full Stack
* Analista de Dados
* QA / Testes
* UX/UI Designer

Para a primeira demo, pode ser usado um caso principal:

> Vaga de Desenvolvedor Backend Júnior ou Pleno.

Esse recorte permite demonstrar matching por skills, nível, disponibilidade, região, diversidade e contexto territorial sem tornar a base ampla demais.

---

## Regras de geração dos candidatos

A geração dos candidatos deve seguir regras controladas.

### 1. Área profissional

Cada candidato deve pertencer a uma área principal.

Exemplos:

* Backend
* Frontend
* Full Stack
* Dados
* QA
* UX/UI

### 2. Senioridade

A senioridade deve ser coerente com anos de experiência.

| Senioridade | Faixa sugerida  |
| ----------- | --------------- |
| Júnior      | 0 a 2 anos      |
| Pleno       | 2 a 5 anos      |
| Sênior      | Acima de 5 anos |

### 3. Skills

As skills devem ser geradas a partir de conjuntos coerentes por área.

Exemplo para Backend:

* Node.js
* TypeScript
* PostgreSQL
* APIs REST
* Docker
* Redis
* Express
* Prisma
* Testes automatizados

Exemplo para Dados:

* Python
* SQL
* Pandas
* ETL
* PostgreSQL
* Power BI
* Dashboards
* Data Cleaning

### 4. Disponibilidade

A disponibilidade deve variar de forma controlada.

Exemplos:

* Imediata
* 15 dias
* 30 dias
* 60 dias

### 5. Modalidade preferida

A modalidade deve considerar o tipo de vaga e a região do candidato.

Exemplos:

* Remoto
* Híbrido
* Presencial

### 6. Localização

Cada candidato deve ser associado a uma região, município ou cluster derivado do CDRView.

A localização permitirá:

* distribuição por mapa;
* análise por cluster;
* comparação entre região do candidato e região da vaga;
* métricas de concentração territorial;
* análise de acessibilidade digital e mobilidade.

### 7. Diversidade

A diversidade será declarativa e mockada.

Exemplos de badges:

* Mulher em tecnologia
* Pessoa negra
* Pessoa com deficiência
* Pessoa LGBTQIA+
* Pessoa de baixa renda
* Pessoa de região periférica

A diversidade não deve ser inferida a partir de nome, localização, renda, idade, conectividade ou comportamento.

---

## Estrutura conceitual do candidato

```json
{
  "id": "cand_001",
  "nome": "Ana Souza",
  "titulo_profissional": "Desenvolvedora Backend Júnior",
  "area": "Backend",
  "skills": ["Node.js", "TypeScript", "PostgreSQL", "APIs REST", "Docker"],
  "nivel": "junior",
  "anos_experiencia": 1,
  "disponibilidade": "imediata",
  "modalidade_preferida": "remoto",
  "diversidade": {
    "is_subrepresentado": true,
    "badges": ["Mulher em tecnologia", "Pessoa negra"]
  },
  "localizacao": {
    "municipio": "Florianópolis",
    "cluster": "TRINDADE",
    "lat": -27.6011,
    "lon": -48.5320
  },
  "contexto_territorial": {
    "concentracao_regional": 78,
    "tecnologia_predominante": "4G/5G",
    "acessibilidade_digital": "boa",
    "mobilidade_para_regiao_vaga": "viavel"
  }
}
```

---

## Relação com o dataset CDRView

O CDRView será usado para enriquecer a base mockada com informações territoriais.

| Arquivo / agregado                      | Uso na geração                                                                           |
| --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `antenas_flp.csv`                       | Associar clusters, municípios e coordenadas.                                             |
| `tensor_concentracao.csv`               | Definir concentração regional e distribuição territorial.                                |
| `assinantes.csv`                        | Apoiar distribuição sintética por cluster de residência e contexto demográfico agregado. |
| `tensor_mobilidade.csv`                 | Gerar indicadores de conectividade, tecnologia predominante e acessibilidade digital.    |
| `tensor_od.csv` / `trajetos_comuns.csv` | Apoiar insights de deslocamento e mobilidade regional.                                   |
| `tensor_tempo_deslocamento.csv`         | Calcular barreiras de distância e acessibilidade territorial.                            |

---

## Estratégia de aleatoriedade controlada

A aleatoriedade deve ser usada apenas dentro de limites definidos.

Exemplos de regras:

* Um candidato Backend deve ter pelo menos uma linguagem backend e uma skill de banco de dados.
* Um candidato Frontend deve ter pelo menos uma skill de interface e uma tecnologia web.
* Um candidato Pleno não deve ter menos de 2 anos de experiência.
* Um candidato Sênior não deve ter apenas skills introdutórias.
* A diversidade deve ter distribuição suficiente para demonstrar métricas, mas sem parecer artificialmente perfeita.
* A distribuição regional deve refletir diferentes clusters e níveis de conectividade.
* Candidatos de regiões com baixa conectividade não devem ser penalizados automaticamente.

---

## Casos de teste que a massa mockada deve permitir

A base de candidatos deve incluir cenários úteis para a demo.

| Cenário                                      | Objetivo                                                |
| -------------------------------------------- | ------------------------------------------------------- |
| Candidato com alta compatibilidade técnica   | Demonstrar ranking por skills.                          |
| Candidato diverso e tecnicamente compatível  | Demonstrar inclusão sem abrir mão da aderência técnica. |
| Candidato de região com baixa conectividade  | Gerar insight de suporte digital.                       |
| Candidato distante da região da vaga         | Demonstrar impacto de modalidade presencial/híbrida.    |
| Candidato com skills parciais                | Demonstrar diferença de score.                          |
| Candidato tecnicamente bom, mas indisponível | Demonstrar peso da disponibilidade.                     |
| Shortlist com boa diversidade agregada       | Demonstrar métrica de diversidade.                      |
| Shortlist abaixo da meta de diversidade      | Permitir recomendação do agente para ampliar alcance.   |

---

## Relação com o matching

O matching será calculado principalmente com base nos atributos profissionais sintéticos:

* skills;
* senioridade;
* experiência;
* disponibilidade;
* modalidade;
* região.

Os atributos derivados do CDRView serão usados como contexto territorial:

* concentração regional;
* conectividade;
* acessibilidade digital;
* mobilidade;
* distância;
* potencial regional.

A diversidade será usada como:

* badge declarativo;
* métrica agregada da shortlist;
* critério de composição responsável;
* indicador de aderência à meta de diversidade.

A diversidade não deve ser usada como bônus cego no score individual.

---

## Relação com o agente de IA

O agente de IA poderá usar os candidatos mockados e os dados territoriais para gerar explicações como:

* por que a shortlist foi recomendada;
* quais critérios técnicos tiveram maior impacto;
* quais regiões concentram mais candidatos compatíveis;
* quais candidatos podem precisar de suporte digital;
* como ajustar a vaga para ampliar diversidade;
* se a modalidade da vaga restringe alcance territorial.

O agente não deve inventar atributos dos candidatos nem alterar o ranking calculado pelo backend.

---

## Síntese da decisão

A geração de candidatos do MVP será baseada em dados sintéticos controlados, e não em uma base pública de currículos.

A massa será construída com perfis profissionais mockados, regras coerentes de skills e senioridade, diversidade declarativa e enriquecimento territorial derivado do CDRView.

Essa abordagem reduz riscos de privacidade e licenciamento, dá maior controle sobre a demo, evita vieses externos difíceis de auditar e permite demonstrar o valor central do MVP: matching inclusivo com inteligência territorial.
