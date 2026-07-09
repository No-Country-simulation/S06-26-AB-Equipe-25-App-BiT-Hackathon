import { Router } from "express";
import { z } from "zod";
import type { EntityMetadata, ObjectLiteral, Repository } from "typeorm";

import { AppDataSource } from "../data-source.js";
import { Candidate } from "../entities/Candidate.js";
import {
  buildLocalInsight,
  buildShortlist,
  calculateDiversityPercentage,
  type JobInput,
  type MatchFilters,
} from "../services/matching-engine.js";

type EntityRepository = {
  metadata: EntityMetadata;
  repository: Repository<ObjectLiteral>;
};

const jobEntityNames = ["Job", "Vaga", "jobs", "vagas"];
const matchEntityNames = ["Match", "matches"];

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
  filtros: z
    .object({
      anti_vies: z.boolean().default(true),
      diversidade_minima: z.number().min(0).max(100).default(40),
    })
    .default({ anti_vies: true, diversidade_minima: 40 }),
});

export function getEntityRepository(names: string[]): EntityRepository | null {
  const metadata = AppDataSource.entityMetadatas.find((entityMetadata) =>
    names.some(
      (name) =>
        entityMetadata.name.toLowerCase() === name.toLowerCase() ||
        entityMetadata.tableName.toLowerCase() === name.toLowerCase(),
    ),
  );

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    repository: AppDataSource.getRepository<ObjectLiteral>(metadata.target),
  };
}

export function getColumnProperty(metadata: EntityMetadata, candidates: string[]): string | null {
  const column = metadata.columns.find((item) =>
    candidates.some(
      (candidate) =>
        item.propertyName.toLowerCase() === candidate.toLowerCase() ||
        item.databaseName.toLowerCase() === candidate.toLowerCase(),
    ),
  );

  return column?.propertyName ?? null;
}

function assignIfColumn(
  entity: ObjectLiteral,
  metadata: EntityMetadata,
  candidates: string[],
  value: unknown,
) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  const propertyName = getColumnProperty(metadata, candidates);

  if (propertyName) {
    entity[propertyName] = value;
  }
}

function assignRelationById(
  entity: ObjectLiteral,
  metadata: EntityMetadata,
  candidates: string[],
  id: string | undefined,
) {
  if (!id) {
    return;
  }

  const relation = metadata.relations.find((item) =>
    candidates.some(
      (candidate) =>
        item.propertyName.toLowerCase() === candidate.toLowerCase() ||
        item.joinColumns.some(
          (joinColumn) => joinColumn.databaseName.toLowerCase() === candidate.toLowerCase(),
        ),
    ),
  );

  if (relation) {
    entity[relation.propertyName] = { id };
    return;
  }

  assignIfColumn(entity, metadata, candidates, id);
}

function readValue<T>(
  entity: ObjectLiteral,
  metadata: EntityMetadata,
  candidates: string[],
): T | undefined {
  const propertyName = getColumnProperty(metadata, candidates);

  if (!propertyName) {
    return undefined;
  }

  return entity[propertyName] as T | undefined;
}

function normalizeSkills(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
}

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function findMatchedSkills(jobSkills: string[], candidateSkills: string[]): string[] {
  const normalizedCandidateSkills = new Set(candidateSkills.map(normalize));

  return jobSkills.filter((skill) => normalizedCandidateSkills.has(normalize(skill)));
}

function candidateResponse(shortlist: ReturnType<typeof buildShortlist>) {
  return shortlist.map(({ candidate, score_match }) => ({
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
  }));
}

export async function buildMatchingResponse(job: JobInput, filters: MatchFilters) {
  const candidateRepository = AppDataSource.getRepository(Candidate);
  const candidates = await candidateRepository.find();
  const shortlist = buildShortlist(candidates, job, filters);
  const diversityPercentage = calculateDiversityPercentage(shortlist);

  return {
    shortlist,
    response: {
      candidatos: candidateResponse(shortlist),
      metricas: {
        total_analisados: candidates.length,
        diversidade_resultado: {
          percentual_diversidade: diversityPercentage,
          criterio_minimo_atendido: diversityPercentage >= filters.diversidade_minima,
        },
      },
      ai_insight: buildLocalInsight(shortlist, diversityPercentage, filters.diversidade_minima),
    },
  };
}

export async function runPersistentMatching(jobId: string) {
  const job = getEntityRepository(jobEntityNames);

  if (!job) {
    return {
      status: 501,
      body: { message: "Entidade Job/Vaga nao registrada no backend" },
    };
  }

  const foundJob = await job.repository.findOne({
    where: { [job.metadata.primaryColumns[0]?.propertyName ?? "id"]: jobId },
  });

  if (!foundJob) {
    return {
      status: 404,
      body: { message: "Vaga nao encontrada" },
    };
  }

  const jobInput: JobInput = {
    titulo: readValue<string>(foundJob, job.metadata, ["title", "titulo"]) ?? "",
    skills: normalizeSkills(readValue(foundJob, job.metadata, ["skills", "skills_requeridas", "required_skills"])),
    nivel: readValue<string>(foundJob, job.metadata, ["level", "nivel"]) ?? "",
    regiao: readValue<string>(foundJob, job.metadata, ["region", "regiao"]) ?? "",
    modalidade: readValue<string>(foundJob, job.metadata, ["work_model", "modalidade"]) ?? "remoto",
  };
  const diversityMinimum =
    readValue<number>(foundJob, job.metadata, ["diversity_minimum", "diversidade_minima"]) ?? 40;

  if (!jobInput.titulo || jobInput.skills.length === 0 || !jobInput.nivel || !jobInput.regiao) {
    return {
      status: 422,
      body: { message: "Vaga nao possui dados suficientes para matching" },
    };
  }

  const filters = {
    anti_vies: true,
    diversidade_minima: diversityMinimum,
  };
  const result = await buildMatchingResponse(jobInput, filters);
  const match = getEntityRepository(matchEntityNames);

  if (!match) {
    return {
      status: 501,
      body: {
        message: "Entidade Match nao registrada no backend",
        ...result.response,
      },
    };
  }

  await match.repository
    .createQueryBuilder()
    .delete()
    .where("job_id = :jobId", { jobId })
    .execute();

  const savedMatches = await match.repository.save(
    result.shortlist.map(({ candidate, score_match }) => {
      const entity = match.repository.create();
      assignRelationById(entity, match.metadata, ["job", "job_id", "vaga_id"], jobId);
      assignRelationById(
        entity,
        match.metadata,
        ["candidate", "candidate_id", "candidato_id"],
        candidate.id,
      );
      assignIfColumn(entity, match.metadata, ["score_match"], score_match);
      assignIfColumn(
        entity,
        match.metadata,
        ["matched_skills", "skills_compatíveis", "skills_compativeis"],
        findMatchedSkills(jobInput.skills, candidate.skills),
      );
      assignIfColumn(
        entity,
        match.metadata,
        ["badge_diversidade", "diversity_badge"],
        candidate.is_underrepresented || Boolean(candidate.diversity_badge),
      );
      assignIfColumn(entity, match.metadata, ["insight"], result.response.ai_insight);
      assignIfColumn(entity, match.metadata, ["status"], "shortlisted");
      assignIfColumn(entity, match.metadata, ["created_at"], new Date());

      return entity;
    }),
  );

  return {
    status: 201,
    body: {
      job_id: jobId,
      matches: savedMatches,
      ...result.response,
    },
  };
}

matchRoutes.post("/", async (req, res) => {
  const parsedBody = matchRequestSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Payload de matching invalido",
      issues: parsedBody.error.issues,
    });
  }

  try {
    const { response } = await buildMatchingResponse(parsedBody.data.vaga, parsedBody.data.filtros);

    return res.json(response);
  } catch (error: unknown) {
    console.error("Erro ao calcular matching:", error);

    return res.status(500).json({
      message: "Erro interno ao calcular matching",
    });
  }
});

matchRoutes.post("/echo", (req, res) => {
  return res.json({
    message: "Match endpoint funcionando",
    receivedBody: req.body,
  });
});
