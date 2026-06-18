# Perguntas e Respostas para definição do planejamento inicial do projeto

## 1. Qual é o problema exato que o MVP precisa provar na demo?

Resposta:  
O MVP precisa provar que é possível transformar uma vaga em uma shortlist inteligente de
candidatos qualificados, considerando critérios técnicos, localização e diversidade, com uma
lógica de matching transparente e mecanismos básicos para reduzir vieses no processo de triagem.

A principal hipótese a ser validada é que uma empresa consegue encontrar talentos de grupos
sub-representados de forma mais eficiente, objetiva e mensurável do que em uma busca tradicional,
recebendo candidatos compatíveis, indicadores de diversidade e justificativas claras sobre os
critérios utilizados.

## 2. Qual será o fluxo principal demonstrado do ponto de vista do recrutador?

Resposta:
O fluxo principal demonstrado do ponto de vista do recrutador será:
O recrutador informa os dados básicos da vaga, como título, nível, skills necessárias, modalidade e região de interesse.
A plataforma processa os critérios da vaga e normaliza as informações relevantes para o matching, como skills, senioridade e localização.
O backend executa o matching entre a vaga e a base de candidatos disponível, retornando uma shortlist ranqueada por compatibilidade.
O recrutador visualiza os candidatos recomendados com score de match, principais skills compatíveis, região, badge de diversidade e uma explicação objetiva dos critérios utilizados.
A plataforma apresenta métricas básicas da shortlist, como percentual de candidatos de grupos sub-representados, distribuição regional e aderência mínima à meta de diversidade definida.
Como apoio à decisão, o recrutador acessa um resumo inteligente gerado pelo agente de IA, explicando por que aquela shortlist é relevante e quais pontos merecem atenção.
O objetivo da demo não é cobrir todo o ciclo de recrutamento, mas provar que o recrutador consegue transformar uma vaga em uma shortlist qualificada, diversa e justificável, reduzindo triagem manual e tornando a decisão inicial mais orientada por dados.

## 3. Os candidatos usados no matching serão mockados, derivados do dataset ou uma combinação dos dois?

Resposta:
Os candidatos usados no matching serão uma combinação entre dados mockados e dados derivados do dataset.
A base principal de candidatos será mockada, porque o dataset disponibilizado não representa currículos profissionais completos, skills técnicas, senioridade, experiências, disponibilidade ou preferências de trabalho. Esses atributos precisam ser simulados para permitir o funcionamento do matching.
Por outro lado, o dataset será usado como camada de enriquecimento geográfico e analítico. Cada candidato mockado poderá estar associado a uma região, município ou cluster compatível com os dados do CDRView. A partir disso, a plataforma poderá gerar insights como concentração regional de talentos, distribuição geográfica da shortlist, conectividade da região, concentração por zona e apoio visual para gráficos e mapas.
Dessa forma, o matching usa dados mockados para avaliar compatibilidade profissional e usa o dataset para contextualizar a decisão com inteligência geográfica. Isso permite demonstrar valor real do dataset sem distorcer sua finalidade original.
A decisão proposta é: candidatos serão mockados em seus atributos profissionais, mas enriquecidos com atributos regionais derivados ou compatíveis com o dataset, permitindo gerar métricas, mapas e insights geográficos relevantes para recrutamento inclusivo.

## 4.  O dataset CDRView será usado diretamente na aplicação ou apenas pré-processado para gerar dados agregados?

Resposta:
O CDRView será usado como fonte de dados para pré-processamento e geração de agregados territoriais. Esses agregados serão consumidos diretamente pela aplicação para enriquecer candidatos mockados, calcular métricas, apoiar o matching e gerar visualizações como gráficos e mapas. O backend não fará leitura dos CSVs brutos pesados durante as requisições; ele utilizará dados já tratados e otimizados para garantir performance e simplicidade no MVP.

> O dataset bruto será tratado como fonte de dados para ETL. A aplicação consumirá dados derivados, agregados e otimizados, não os CSVs pesados diretamente em runtime.

## 5. Quais arquivos do dataset realmente agregam valor ao MVP: concentração, antenas, assinantes, origem-destino, mobilidade ou fluxo de vias?

Resposta:
O dataset CDRView será utilizado como camada de inteligência territorial do MVP. A proposta não é tratar o dataset como uma base real de candidatos profissionais, mas usá-lo para enriquecer candidatos mockados, gerar métricas regionais, apoiar visualizações geográficas e produzir insights relevantes para recrutamento inclusivo.

A estratégia recomendada é dividir o uso dos arquivos em camadas:

* **Base principal do MVP:** arquivos usados diretamente para concentração regional, geolocalização e geração de massa mockada.
* **Base analítica de pré-processamento:** arquivos usados para gerar indicadores derivados, como conectividade e acessibilidade digital.
* **Base complementar:** arquivos usados para mobilidade, deslocamento e acessibilidade territorial.
* **Base opcional:** arquivos úteis para visualizações avançadas, mas não essenciais para a primeira entrega.
* **Fora do MVP funcional inicial:** arquivos com alto custo ou baixa relevância imediata para o fluxo principal.

---

### Tabela de avaliação dos arquivos

| Nome                            | Prioridade / utilidade                                                | Descrição                                                                                                                                                                                                                                                                           | Casos de uso                                                                                                                                                                                                                     | Insights / ideias                                                                                                                                                                                                                                                                    |
| ------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tensor_concentracao.csv`       | **Alta — essencial para insights geográficos**                        | Arquivo agregado por antena, cluster, município, dia e período. Contém informações como volume de usuários ativos, sessões, tráfego, congestionamento médio e coordenadas.                                                                                                          | Gerar mapa de calor; criar ranking de regiões com maior concentração; apoiar endpoint de insights; mostrar distribuição geográfica da shortlist; alimentar gráficos por município ou cluster.                                    | Regiões com maior concentração de talentos potenciais; zonas com maior atividade digital; hotspots regionais; distribuição territorial dos candidatos recomendados; comparação entre regiões com maior e menor presença digital.                                                     |
| `antenas_flp.csv`               | **Alta — referência geográfica base**                                 | Catálogo das antenas/ERBs com identificador, cluster, município, latitude e longitude. Serve como base de normalização geográfica.                                                                                                                                                  | Associar antenas a clusters; plotar pontos no mapa; validar coordenadas; conectar concentração, mobilidade e candidatos mockados a regiões coerentes.                                                                            | Base para geolocalização no frontend; normalização de município e cluster; associação de candidatos mockados a regiões; visualização da infraestrutura territorial.                                                                                                                  |
| `assinantes.csv`                | **Alta/Média — geração de massa mockada coerente**                    | Contém perfis sintéticos com cluster provável de residência, município, faixa de renda, faixa etária, padrão de mobilidade e tipo de dispositivo.                                                                                                                                   | Apoiar geração de candidatos mockados; distribuir candidatos por região; criar variação sintética mais realista; enriquecer a massa de dados com contexto territorial e socioeconômico agregado.                                 | Candidatos mockados com distribuição regional mais realista; talentos em regiões de menor renda; segmentação territorial; possíveis indicadores de vulnerabilidade ou necessidade de suporte.                                                                                        |
| `tensor_mobilidade.csv`         | **Alta para pré-processamento; baixa para leitura direta em runtime** | Base principal de mobilidade. Contém atividade por assinante, antena, período, tipo de conteúdo, tecnologia de rede, sessões, tráfego, taxa de drop e congestionamento. Por ser um arquivo grande, deve ser usado via pré-processamento, não em leitura direta durante requisições. | Gerar indicadores de tecnologia predominante por região; calcular qualidade de conectividade; identificar congestionamento médio; apoiar métricas de acessibilidade digital; enriquecer matching para vagas remotas ou híbridas. | Regiões com predominância de 3G, 4G ou 5G; zonas com baixa acessibilidade digital; candidatos de regiões com conectividade limitada podem precisar de suporte; métrica ESG de inclusão digital; sugestão para empresas oferecerem auxílio internet, equipamento ou estrutura remota. |
| `tensor_od.csv`                 | **Média — mobilidade entre regiões**                                  | Matriz origem-destino entre clusters, com quantidade de usuários, viagens, distância média e período predominante.                                                                                                                                                                  | Avaliar deslocamento entre região do candidato e região da vaga; apoiar vagas presenciais ou híbridas; medir acessibilidade territorial; identificar fluxo entre regiões periféricas e polos de trabalho.                        | Talentos de regiões periféricas com fluxo para polos corporativos; viabilidade de trabalho híbrido; distância como barreira de inclusão; recomendação de modalidade remota para ampliar diversidade.                                                                                 |
| `trajetos_comuns.csv`           | **Média — alternativa mais segura para origem-destino**               | Versão pública e k-anonimizada dos pares origem-destino. Possui valor semelhante ao `tensor_od.csv`, mas com maior segurança para demonstração pública.                                                                                                                             | Usar fluxos agregados com menor risco; demonstrar cuidado com privacidade; apoiar análises territoriais sem granularidade individual; substituir o `tensor_od.csv` quando a narrativa exigir conformidade e simplicidade.        | Insights de mobilidade com menor risco de exposição; base mais defensável para demo pública; análise territorial respeitando privacidade; demonstração de cuidado com LGPD e anonimização.                                                                                           |
| `tensor_fluxo_vias.csv`         | **Média/Baixa — visualização avançada**                               | Arquivo agregado com fluxos entre pares de antenas consecutivas, incluindo volume de usuários, transições, distância e percentual de fluxo.                                                                                                                                         | Criar camada visual de corredores no mapa; identificar gargalos; mostrar deslocamento urbano; enriquecer dashboards ou mapas caso haja tempo.                                                                                    | Corredores de deslocamento com maior volume; gargalos de acesso a regiões de trabalho; zonas com alto fluxo, mas baixa oportunidade; visualização forte para demo, porém não essencial ao matching.                                                                                  |
| `tensor_tempo_deslocamento.csv` | **Média/Baixa — acessibilidade territorial**                          | Estatísticas de distância entre clusters, incluindo média e percentis de deslocamento.                                                                                                                                                                                              | Calcular distância média entre região do candidato e região da vaga; apoiar score geográfico; sugerir modalidade remota ou híbrida; medir barreiras físicas de acesso.                                                           | Candidatos compatíveis tecnicamente, mas distantes da vaga; recomendação de trabalho remoto; barreira física como fator de exclusão; métrica de acessibilidade ao emprego.                                                                                                           |
| `tensor_sequencias.csv`         | **Baixa para MVP — alto custo e uso específico**                      | Sequência de antenas visitadas por assinante por dia. Permite análise de trajetos individuais sintéticos, mas possui maior complexidade e menor aderência ao fluxo principal do MVP.                                                                                                | Estudos avançados de trajeto; validação de fluxos; geração de análises futuras; apoio indireto para arquivos agregados.                                                                                                          | Não usar diretamente no MVP; evitar granularidade individual na demo; priorizar arquivos agregados; considerar apenas para evolução futura da solução.                                                                                                                               |

---

### Decisão recomendada

Para o MVP, o dataset será usado em camadas.

| Camada                                  | Arquivos                                                                | Decisão                                                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Base principal do MVP**               | `tensor_concentracao.csv`, `antenas_flp.csv`, `assinantes.csv`          | Usar para concentração regional, geolocalização, geração/enriquecimento de candidatos mockados e métricas territoriais.      |
| **Base analítica de pré-processamento** | `tensor_mobilidade.csv`                                                 | Usar para gerar indicadores de conectividade, tecnologia predominante, congestionamento e acessibilidade digital por região. |
| **Base complementar**                   | `tensor_od.csv`, `trajetos_comuns.csv`, `tensor_tempo_deslocamento.csv` | Usar para insights de mobilidade, distância, acessibilidade e viabilidade de trabalho presencial/híbrido.                    |
| **Base opcional / visual**              | `tensor_fluxo_vias.csv`                                                 | Usar se houver tempo para enriquecer o mapa com corredores, fluxos e gargalos.                                               |
| **Fora do MVP funcional inicial**       | `tensor_sequencias.csv`                                                 | Evitar no runtime e na primeira entrega; considerar apenas como referência analítica ou evolução futura.                     |

---

### Síntese da decisão

O dataset CDRView não será usado como uma base direta de currículos ou talentos reais. Ele será usado como fonte de inteligência territorial para enriquecer candidatos mockados, gerar métricas e apoiar visualizações.

A base principal do MVP será formada por concentração, antenas e assinantes. O arquivo de mobilidade será usado em pré-processamento para gerar indicadores de conectividade e acessibilidade digital. Arquivos de origem-destino e deslocamento serão usados como camada complementar para análises de mobilidade. Fluxos de vias serão opcionais para visualização avançada. Sequências individuais ficarão fora do escopo funcional inicial.

Essa abordagem permite demonstrar uso real do dataset sem distorcer sua finalidade original e sem comprometer a entrega com processamento pesado em runtime.

## 6. ## Qual insight prático o dataset entregará ao recrutador?

O principal insight prático entregue pelo dataset será o **potencial regional de recrutamento inclusivo**.

Em vez de usar o dataset apenas para mostrar um mapa, a plataforma deverá transformar os dados territoriais em uma leitura útil para o recrutador: **onde existem candidatos compatíveis, quais regiões concentram maior oportunidade de busca, quais localidades apresentam boa conectividade para trabalho remoto ou híbrido e quais áreas podem exigir maior suporte por barreiras digitais ou de deslocamento**.

Esse insight será composto por quatro dimensões principais:

| Dimensão                        | O que responde para o recrutador                                                             | Exemplo de aplicação                                                                                               |
| ------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Concentração regional**       | Onde há maior concentração de pessoas/candidatos associados à região?                        | Identificar clusters ou municípios com maior volume de candidatos mockados compatíveis com a vaga.                 |
| **Conectividade**               | A região possui boa infraestrutura digital para trabalho remoto ou híbrido?                  | Sugerir se candidatos de determinada região podem precisar de apoio com internet, equipamento ou estrutura remota. |
| **Mobilidade / acessibilidade** | O deslocamento entre a região do candidato e a região da vaga é viável?                      | Apoiar decisão entre vaga presencial, híbrida ou remota com base em distância e fluxos regionais.                  |
| **Potencial de talentos**       | Onde a empresa deve concentrar a busca para ampliar diversidade com viabilidade operacional? | Cruzar compatibilidade profissional dos candidatos mockados com concentração, conectividade e localização.         |

A decisão proposta é que o dataset não seja usado apenas como elemento visual, mas como uma camada de inteligência territorial aplicada ao recrutamento. O recrutador não verá apenas “onde existem pessoas”, mas sim **quais regiões apresentam maior oportunidade, quais barreiras podem limitar a inclusão e quais ações podem ampliar o acesso de talentos sub-representados**.

Dessa forma, o dataset entrega valor em três níveis:

1. **Decisão de busca:** indicar regiões com maior concentração de candidatos compatíveis.
2. **Decisão de modalidade:** apoiar escolha entre remoto, híbrido ou presencial com base em conectividade e mobilidade.
3. **Decisão de inclusão:** revelar barreiras territoriais ou digitais que podem exigir suporte da empresa.

Portanto, o insight central do MVP será:

> A plataforma ajuda o recrutador a identificar regiões com maior potencial de contratação inclusiva, combinando concentração de candidatos, conectividade, mobilidade e compatibilidade com a vaga.

## 7. ## O score de matching será baseado em quais critérios?

O score de matching será baseado principalmente em critérios objetivos de compatibilidade entre a vaga e o candidato, com uso complementar de dados territoriais e métricas de diversidade.

A decisão recomendada é separar o score em duas camadas:

1. **Score individual de compatibilidade**
2. **Métricas agregadas de diversidade e inclusão da shortlist**

Essa separação evita que atributos sensíveis sejam tratados de forma inadequada no ranqueamento individual e permite que a plataforma continue promovendo diversidade de forma auditável, mensurável e defensável.

---

### Critérios principais do score individual

| Critério                              |                                                                Uso no score | Peso sugerido | Observação                                                                                                                              |
| ------------------------------------- | --------------------------------------------------------------------------: | ------------: | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Skills**                            |       Principal critério de compatibilidade técnica entre vaga e candidato. |       **50%** | Deve comparar skills obrigatórias e desejáveis. Skills obrigatórias podem funcionar como critério mínimo de elegibilidade.              |
| **Nível profissional**                |        Mede aderência entre senioridade da vaga e senioridade do candidato. |       **15%** | Exemplo: junior, pleno, senior. Evita recomendar candidatos muito abaixo ou muito acima do recorte esperado.                            |
| **Região / localização**              | Mede compatibilidade entre região do candidato e região/modalidade da vaga. |       **15%** | Para vagas remotas, deve ter peso menor. Para vagas presenciais/híbridas, pode ter peso maior.                                          |
| **Disponibilidade**                   |    Mede aderência entre disponibilidade do candidato e necessidade da vaga. |       **10%** | Considera disponibilidade imediata, parcial, futura, remoto, híbrido ou presencial.                                                     |
| **Aderência ao contexto territorial** |         Usa dados derivados do dataset para enriquecer o matching regional. |       **10%** | Pode considerar concentração regional, acessibilidade territorial e conectividade, mas sem penalizar candidatos de regiões vulneráveis. |

---

### Tratamento da diversidade

A diversidade não deve ser usada como um fator simples de “pontuação individual” que aumenta ou reduz artificialmente o score de um candidato. Isso pode gerar risco ético, parecer tokenização e dificultar a explicação do algoritmo.

A recomendação é tratar diversidade em três níveis:

1. **Badge declarativo**

   * Indica pertencimento a grupo sub-representado com base em dados mockados/declarados.
   * Não deve ser inferido automaticamente a partir de nome, aparência, localização ou comportamento.

2. **Métrica agregada da shortlist**

   * Percentual de candidatos de grupos sub-representados.
   * Distribuição por região.
   * Aderência à meta mínima de diversidade definida pela empresa.

3. **Critério de composição da shortlist**

   * A diversidade pode ser usada para avaliar se a shortlist final está alinhada à meta de inclusão.
   * Essa composição deve ocorrer apenas entre candidatos tecnicamente elegíveis.
   * O sistema não deve selecionar candidatos sem compatibilidade técnica apenas para cumprir uma métrica.

---

### Tratamento da conectividade

A conectividade deve ser usada como insight de inclusão digital, não como penalidade direta contra o candidato.

Por exemplo, se um candidato está em uma região com conectividade limitada, o sistema não deve simplesmente reduzir seu score. Isso poderia reforçar exclusões territoriais já existentes. Em vez disso, a plataforma pode gerar um alerta ou recomendação:

* candidato compatível, mas região apresenta menor acessibilidade digital;
* considerar auxílio internet ou equipamento;
* recomendar modalidade híbrida ou suporte remoto estruturado;
* indicar que a empresa pode ampliar inclusão oferecendo infraestrutura.

Assim, a conectividade entra como dado de contexto para decisão e suporte, não como fator automático de exclusão.

---

### Fórmula conceitual sugerida

```txt
score_match =
  score_skills * 0.50 +
  score_nivel * 0.15 +
  score_regiao * 0.15 +
  score_disponibilidade * 0.10 +
  score_contexto_territorial * 0.10
```

A diversidade deve ser calculada separadamente:

```txt
diversidade_shortlist =
  candidatos_subrepresentados_na_shortlist / total_candidatos_shortlist
```

E a aderência à meta pode ser representada como:

```txt
meta_diversidade_atendida =
  diversidade_shortlist >= diversidade_minima_definida
```

---

### Decisão proposta

O score de matching será baseado em skills, nível profissional, região, disponibilidade e contexto territorial. Skills e nível serão os critérios centrais de compatibilidade. Região e disponibilidade ajustarão a aderência ao formato da vaga. O contexto territorial, derivado do dataset, será usado para enriquecer o matching com concentração regional, mobilidade e conectividade.

A diversidade não será tratada como simples peso individual do score. Ela será usada como badge declarativo, métrica agregada da shortlist e critério de avaliação da composição final, garantindo que a plataforma promova inclusão sem comprometer a objetividade técnica do matching.

A conectividade também não deve penalizar candidatos individualmente. Ela será usada para gerar insights de acessibilidade digital e recomendações de suporte, especialmente para vagas remotas ou híbridas.

## 8. # Papel do Agente de IA no MVP

Qual será o papel real do agente de IA: interpretar vaga, explicar shortlist, sugerir melhorias, gerar relatório ou combinar candidatos?

### Resposta proposta

O agente de IA atuará como uma camada de apoio à decisão do recrutador, responsável por interpretar informações, explicar resultados e gerar recomendações a partir dos dados calculados pelo backend.

O agente não será o responsável direto por combinar candidatos nem por definir o ranking final da shortlist. O matching deve ser calculado por regras determinísticas no backend, com critérios objetivos como skills, nível, região, disponibilidade e contexto territorial. A IA entra depois, para tornar o resultado mais compreensível, útil e acionável para o recrutador.

A função principal do agente será transformar dados estruturados em uma explicação clara sobre a shortlist, destacando compatibilidade técnica, diversidade, distribuição geográfica, conectividade regional e possíveis barreiras de inclusão.

---

### Decisão recomendada

O agente de IA terá quatro responsabilidades principais no MVP:

| Função                              | Prioridade | Descrição                                                                                                                       | Exemplo de uso                                                                                                                   |
| ----------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Interpretar a vaga**              | Alta       | Ajudar a extrair ou normalizar informações da vaga, como skills, senioridade, modalidade e região.                              | Recrutador informa “dev backend junior com Node e banco”; agente estrutura isso como `skills`, `nivel`, `modalidade` e `regiao`. |
| **Explicar a shortlist**            | Alta       | Gerar uma explicação sobre por que determinados candidatos foram recomendados, usando os dados do score calculado pelo backend. | “Os candidatos foram priorizados por aderência em Node.js, PostgreSQL, disponibilidade imediata e compatibilidade regional.”     |
| **Sugerir melhorias na vaga**       | Média/Alta | Identificar critérios que podem restringir diversidade ou reduzir alcance da vaga.                                              | “Exigir presencialidade integral pode limitar candidatos de regiões com alto potencial, mas maior distância de deslocamento.”    |
| **Gerar resumo ou relatório curto** | Média      | Criar um resumo executivo da busca, com métricas de diversidade, distribuição regional e insights de acessibilidade.            | “A shortlist possui 62% de candidatos de grupos sub-representados, com maior concentração nas regiões X e Y.”                    |

---

### O que o agente não deve fazer no MVP

O agente não deve:

* decidir quem entra ou sai da shortlist;
* alterar diretamente o score de matching;
* inferir diversidade a partir de nome, aparência, localização ou comportamento;
* substituir a lógica de matching do backend;
* inventar candidatos ou atributos profissionais;
* justificar decisões que não estejam baseadas nos dados calculados;
* ranquear candidatos por critérios subjetivos não auditáveis.

Essa separação é importante porque o MVP precisa demonstrar inteligência sem perder controle, rastreabilidade e responsabilidade sobre os critérios de decisão.

---

### Arquitetura conceitual

O fluxo recomendado é:

```txt
Vaga informada pelo recrutador
        ↓
Backend normaliza e valida dados
        ↓
Backend calcula matching determinístico
        ↓
Backend gera shortlist, score e métricas
        ↓
Backend envia dados estruturados para o agente
        ↓
Agente gera explicação, recomendações e resumo
        ↓
Recrutador visualiza shortlist + insights
```

---

### Entradas do agente

O agente deve receber apenas dados estruturados e já tratados pelo backend, como:

* dados da vaga;
* critérios usados no matching;
* lista de candidatos recomendados;
* breakdown do score;
* métricas de diversidade da shortlist;
* distribuição geográfica dos candidatos;
* indicadores de conectividade por região;
* indicadores de mobilidade ou acessibilidade territorial;
* eventuais alertas de anti-viés.

---

### Saídas do agente

O agente pode retornar:

* resumo da shortlist;
* explicação dos principais critérios de compatibilidade;
* alertas sobre possíveis filtros restritivos;
* sugestões para ampliar diversidade;
* recomendações de suporte para candidatos de regiões com menor conectividade;
* resumo das métricas de diversidade;
* texto curto para relatório ou apresentação.

---

### Exemplo de resposta do agente

```txt
A shortlist foi gerada com base em compatibilidade técnica, nível profissional, disponibilidade e aderência regional.

Os candidatos com maior score apresentam forte compatibilidade com as skills obrigatórias da vaga, especialmente Node.js, PostgreSQL e APIs REST. A shortlist também atende à meta mínima de diversidade definida, com presença relevante de candidatos de grupos sub-representados.

Do ponto de vista territorial, há concentração de candidatos compatíveis em regiões com boa atividade digital. Algumas regiões, porém, apresentam menor indicador de conectividade, o que pode indicar necessidade de suporte para trabalho remoto, como auxílio internet ou fornecimento de equipamento.

Para ampliar o alcance inclusivo da vaga, recomenda-se manter modalidade remota ou híbrida e evitar exigências presenciais desnecessárias.
```

---

### Decisão proposta para o planejamento

O agente de IA será utilizado como copiloto do recrutador, não como motor de decisão do matching.

Sua função será interpretar a vaga, explicar a shortlist, sugerir melhorias inclusivas e gerar resumos com base nos dados calculados pelo backend. O ranqueamento dos candidatos será feito por uma lógica determinística e auditável, enquanto a IA será responsável por transformar os resultados em linguagem clara, contextualizada e útil para tomada de decisão.

---

### Síntese

A melhor definição para o MVP é:

> O agente de IA não combina candidatos diretamente. Ele interpreta a vaga, explica os resultados do matching, sugere melhorias para ampliar inclusão e gera insights acionáveis a partir da shortlist, das métricas de diversidade e dos dados territoriais do CDRView.