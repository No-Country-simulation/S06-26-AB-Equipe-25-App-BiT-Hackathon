import { Router } from "express";
import { z } from "zod";

import { AppDataSource } from "../data-source.js";
import { Candidate } from "../entities/Candidate.js";
import {
  buildLocalInsight,
  buildShortlist,
  calculateDiversityPercentage,
} from "../services/matching-engine.js";

export const matchRoutes = Router();

const matchRequestSchema = z.object({
  empresa_id: z.string().min(1),
  vaga: z.object({
    titulo: z.string().min(1),
    skills: z.array(z.string().min(1)).min(1),
    nivel: z.enum(["estagio", "junior", "pleno", "senior"]),
    regiao: z.string().min(1),
    modalidade: z.enum(["remoto", "hibrido", "presencial"]),
  }),
  filtros: z.object({
    anti_vies: z.boolean().default(true),
    diversidade_minima: z.number().min(0).max(100).default(40),
  }),
});

matchRoutes.post("/", (req, res) => {
  const parsedBody = matchRequestSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Payload de matching invalido",
      issues: parsedBody.error.issues,
    });
  }

  const { vaga, filtros } = parsedBody.data;
  const candidateRepository = AppDataSource.getRepository(Candidate);

  return candidateRepository.find().then((candidates) => {
    const shortlist = buildShortlist(candidates, vaga, filtros);
    const diversityPercentage = calculateDiversityPercentage(shortlist);

    return res.json({
      candidatos: shortlist.map(({ candidate, score_match }) => ({
        candidato_id: candidate.id,
        nome: candidate.name,
        titulo_profissional: candidate.professional_title,
        score_match,
        badge_diversidade: candidate.diversity_badge ? [candidate.diversity_badge] : [],
        skills: candidate.skills,
        nivel: candidate.level,
        modalidade_preferida: candidate.work_model,
        disponibilidade: candidate.availability,
        localizacao: {
          regiao: candidate.region,
          lat: candidate.lat,
          lng: candidate.lng,
          conectividade: candidate.connectivity,
        },
      })),
      metricas: {
        total_analisados: candidates.length,
        diversidade_resultado: {
          percentual_diversidade: diversityPercentage,
          criterio_minimo_atendido: diversityPercentage >= filtros.diversidade_minima,
        },
      },
      ai_insight: buildLocalInsight(shortlist, diversityPercentage, filtros.diversidade_minima),
    });
  }).catch((error: unknown) => {
    console.error("Erro ao calcular matching:", error);

    return res.status(500).json({
      message: "Erro interno ao calcular matching",
    });
  });
});

matchRoutes.post("/echo", (req, res) => {
  return res.json({
    message: "Match endpoint funcionando",
    receivedBody: req.body
  });
});
