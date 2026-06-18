# Política de Matching

## Contexto

Para o MVP da plataforma App BiT B2B, a funcionalidade central é o matching entre vagas e candidatos. O objetivo é demonstrar que recrutadores podem obter uma shortlist qualificada, priorizando não apenas skills, mas também a redução de vieses e a consideração do contexto geográfico (conectividade, região), promovendo um recrutamento inclusivo e mensurável.

## Decisão recomendada

O matching será executado de forma **determinística e auditável pelo backend**, com base em uma fórmula predefinida de score individual. A IA não interferirá no cálculo da nota; ela apenas interpretará e explicará o resultado. A **diversidade** será tratada como métrica agregada e filtro de composição da shortlist, e não como pontuação aditiva cega por indivíduo, evitando vieses tokenistas. 

## Regras de Pontuação (Score de Matching)

O score de compatibilidade individual terá um teto de 100 pontos, dividido na seguinte proporção:

| Critério | Peso | Explicação |
|---|---|---|
| **Skills (50%)** | 0.50 | Verifica a interseção percentual entre skills da vaga e do candidato. Fundamental para a utilidade da shortlist. |
| **Nível Profissional (15%)** | 0.15 | Penaliza diferenças entre a senioridade exigida e a ofertada (ex: buscar Sênior e oferecer Júnior reduz a nota bruscamente). |
| **Região / Localização (15%)** | 0.15 | Em vagas presenciais/híbridas, candidatos mais próximos ganham mais pontos. Em vagas remotas, a distância não penaliza significativamente. |
| **Disponibilidade / Modalidade (10%)** | 0.10 | Cruza a expectativa da vaga (ex: Remoto) com a modalidade preferida pelo candidato. |
| **Contexto Territorial (10%)** | 0.10 | Dado originado do CDRView. Usa fatores como acessibilidade de mobilidade; *não* penaliza o candidato por baixa conectividade, mas pode gerar tags/insights de necessidade de auxílio infraestrutura. |

## Fórmula Conceitual

```
score_match = (score_skills * 0.50) + (score_nivel * 0.15) + (score_regiao * 0.15) + (score_disponibilidade * 0.10) + (score_contexto_territorial * 0.10)
```

## Como a Diversidade é Tratada

- **A nível individual:** Exibida apenas como "Badge Declarativo" (ex: "Mulher na tecnologia", "Pessoa negra"). Não soma +10 pontos no score individual, garantindo que os recomendados sejam tecnicamente qualificados.
- **A nível de Shortlist:** O backend calcula a `diversidade_shortlist = (candidatos_badge / total_shortlist)` e avalia se `meta_diversidade_atendida`. Se o recrutador definir 40% de diversidade mínima, a plataforma filtra ou reordena a shortlist (entre os que passaram no corte técnico) para atender a meta.

## Como a Conectividade é Tratada

Não reduz a pontuação. Se um candidato apto reside numa área 3G/congestionada, o agente de IA avisa: "Candidato compatível. Região com baixa conectividade: sugere-se apoio para internet."

## Justificativa

Um algoritmo determinístico facilita o debug, evita alucinações de IA ranqueando candidatos, demonstra transparência total perante o recrutador (e possíveis auditorias ESG) e impede a redução equivocada da qualidade técnica dos selecionados apenas para cumprir metas de diversidade.

## Alternativas avaliadas

| Alternativa | Vantagens | Riscos | Veredito |
|---|---|---|---|
| **Matching via LLM (IA gerando o ranking)** | Requer menos código de backend, parece "mágico". | IA pode alucinar scores, inviesar a lista, zero auditabilidade, custo de token alto, lento. | **Descartada** |
| **Somar pontos por pertencer à minoria** | Fácil de codificar. | Risco legal e ético grave; tokenização; contratação vista como "favor" e não por mérito. | **Descartada** |
| **Algoritmo determinístico + IA como explicadora (Recomendada)** | Rápido, transparente, focado no mérito técnico e ajustável a metas da empresa. | Requer definição rígida das fórmulas no código. | **Aprovada** |

## Impacto no planejamento

- **Backend:** Precisará codificar as funções matemáticas de similaridade (ex: matching exato de strings ou arrays para skills e cálculo de distância se houver latitude/longitude).
- **Frontend:** Deverá exibir claramente o `score_match` geral e a composição das métricas de diversidade no painel.
- **IA:** Em vez de fazer o match, ela consome o payload de resposta do backend para gerar os parágrafos narrativos e insights da busca.
