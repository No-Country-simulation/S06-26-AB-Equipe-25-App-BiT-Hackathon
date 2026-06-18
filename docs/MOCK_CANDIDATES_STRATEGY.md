# Estratégia de Candidatos Mockados

## Contexto

A plataforma necessita de uma base de candidatos para que o motor de matching funcione de forma realista. Contudo, o dataset CDRView não fornece dados curriculares, de habilidades (skills) ou de nível profissional, já que seu foco é infraestrutura e mobilidade. Além disso, o uso de currículos reais esbarra em restrições da LGPD e falta de aderência com as coordenadas das antenas do CDRView.

## Decisão recomendada

A base de candidatos será **100% sintética (mockada)** em seus atributos profissionais (nome anonimizado, skills, senioridade, disponibilidade, diversidade), mas será **enriquecida geograficamente** usando os dados do dataset CDRView. A geração dessa base deve ser feita por um script de *seed* antes do início da demo.

## Composição do Candidato Mockado

Cada candidato terá três camadas de dados:

1. **Atributos Profissionais (Mockados com aleatoriedade controlada):**
   - Nome (ex: "Candidato A"), Senioridade (Junior, Pleno, Sênior), Skills (Node.js, Python, React, etc.), Modalidade preferida (Remoto, Híbrido, Presencial).
2. **Atributos de Diversidade (Declarativos e Mockados):**
   - Badge de diversidade (ex: "Mulher na tecnologia", "Pessoa preta/parda", "Neurodivergente"). Isso permite validar o matching sem envolver modelos preditivos sensíveis.
3. **Atributos Territoriais (Derivados do CDRView):**
   - Latitude/Longitude, Município, Cluster, Nível de conectividade (3G/4G/5G).

## Justificativa

Usar candidatos sintéticos atrelados a regiões do dataset é a forma mais ágil, segura e defensável de provar o valor do projeto no MVP. Elimina-se o risco de LGPD, resolve-se a limitação de variáveis do CDRView, e garante-se que a plataforma sempre terá candidatos para combinar com qualquer vaga inserida na demo.

## Alternativas avaliadas

| Alternativa | Vantagens | Riscos | Veredito |
|---|---|---|---|
| **Base pública de currículos reais** | Dados mais realistas. | Riscos de privacidade (LGPD), viés incontrolável, incompatibilidade com regiões do dataset. | **Descartada** |
| **Inferir diversidade/skills a partir do CDRView** | Integra 100% com o dataset original. | Tecnicamente inviável e eticamente problemático (inferir skill e diversidade por tráfego de rede). | **Descartada** |
| **Geração sintética ancorada territorialmente (Recomendada)** | Agilidade, controle total para a demo, livre de riscos de privacidade, valida o fluxo real. | Pode não representar as correlações exatas de uma população real no MVP. | **Aprovada** |

## Impacto no planejamento

- **Backend:** Deverá rodar um script de *seed* (`seed.js` ou similar) para popular o banco/arquivos JSON com candidatos antes da aplicação iniciar.
- **Frontend:** Consumirá a API normalmente sem saber que são dados mockados. A interface de UI mostrará as badges e o mapa baseados nesses mocks.
- **Dados:** O script de geração precisa de uma tabela (taxonomia) de skills comuns e precisa referenciar as antenas/clusters do CDRView para a geolocalização realista.
- **IA:** O agente usará a badge declarada do mock, garantindo que não alucine a diversidade de ninguém.
- **Demo:** Fluxo livre de falhas de "Nenhum candidato encontrado" (pois podemos forçar a criação de candidatos para vagas chave da demonstração).
