import { Router } from "express";

export const insightsRoutes = Router();

insightsRoutes.get("/", (_req, res) => {
  return res.json({
    mapa_talentos: [
      {
        regiao: "Florianopolis - SC",
        cluster_id: 101,
        concentracao_candidatos: 42,
        tecnologia_predominante: "4G/5G",
        indicador_mobilidade: "alta",
        perfis_disponiveis: ["Desenvolvedor Backend", "Analista de Dados"],
      },
      {
        regiao: "Sao Jose - SC",
        cluster_id: 102,
        concentracao_candidatos: 31,
        tecnologia_predominante: "4G",
        indicador_mobilidade: "media",
        perfis_disponiveis: ["Desenvolvedor Frontend", "QA"],
      },
      {
        regiao: "Palhoca - SC",
        cluster_id: 103,
        concentracao_candidatos: 24,
        tecnologia_predominante: "3G/4G",
        indicador_mobilidade: "media",
        perfis_disponiveis: ["Desenvolvedor Backend", "UX/UI Designer"],
      },
    ],
  });
});
