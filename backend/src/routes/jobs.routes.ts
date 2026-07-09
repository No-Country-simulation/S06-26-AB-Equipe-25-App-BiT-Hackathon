import { Router } from "express";
import { z } from "zod";
import type { EntityMetadata, FindManyOptions, ObjectLiteral, Repository } from "typeorm";

import { AppDataSource } from "../data-source.js";
import { runPersistentMatching } from "./match.routes.js";

type EntityRepository = {
  metadata: EntityMetadata;
  repository: Repository<ObjectLiteral>;
};

const jobEntityNames = ["Job", "Vaga", "jobs", "vagas"];

const jobSchema = z.object({
  company_id: z.string().min(1).optional(),
  empresa_id: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  titulo: z.string().min(1).optional(),
  area: z.string().min(1).optional(),
  description: z.string().optional(),
  descricao: z.string().optional(),
  skills: z.array(z.string().min(1)).min(1).optional(),
  skills_requeridas: z.union([z.array(z.string().min(1)).min(1), z.string().min(1)]).optional(),
  level: z.enum(["estagio", "junior", "pleno", "senior"]).optional(),
  nivel: z.enum(["estagio", "junior", "pleno", "senior"]).optional(),
  region: z.string().min(1).optional(),
  regiao: z.string().min(1).optional(),
  work_model: z.enum(["remoto", "hibrido", "presencial"]).optional(),
  modalidade: z.enum(["remoto", "hibrido", "presencial"]).optional(),
  diversity_minimum: z.number().min(0).max(100).optional(),
  diversidade_minima: z.number().min(0).max(100).optional(),
  deadline: z.string().min(1).optional(),
  data_prazo: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
});

export const jobsRoutes = Router();

function getEntityRepository(names: string[]): EntityRepository | null {
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

function getColumnProperty(metadata: EntityMetadata, candidates: string[]): string | null {
  const column = metadata.columns.find((item) =>
    candidates.some(
      (candidate) =>
        item.propertyName.toLowerCase() === candidate.toLowerCase() ||
        item.databaseName.toLowerCase() === candidate.toLowerCase(),
    ),
  );

  return column?.propertyName ?? null;
}

function getRelationProperty(metadata: EntityMetadata, candidates: string[]): string | null {
  const relation = metadata.relations.find((item) =>
    candidates.some(
      (candidate) =>
        item.propertyName.toLowerCase() === candidate.toLowerCase() ||
        item.joinColumns.some(
          (joinColumn) => joinColumn.databaseName.toLowerCase() === candidate.toLowerCase(),
        ),
    ),
  );

  return relation?.propertyName ?? null;
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

function normalizeSkills(value: string[] | string | undefined): string[] | string | undefined {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return undefined;
}

jobsRoutes.post("/", async (req, res) => {
  const parsedBody = jobSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Dados da vaga invalidos",
      issues: parsedBody.error.issues,
    });
  }

  const job = getEntityRepository(jobEntityNames);

  if (!job) {
    return res.status(501).json({
      message: "Entidade Job/Vaga nao registrada no backend",
    });
  }

  const title = parsedBody.data.title ?? parsedBody.data.titulo;
  const level = parsedBody.data.level ?? parsedBody.data.nivel;
  const region = parsedBody.data.region ?? parsedBody.data.regiao;
  const workModel = parsedBody.data.work_model ?? parsedBody.data.modalidade;
  const skills = normalizeSkills(parsedBody.data.skills ?? parsedBody.data.skills_requeridas);
  const companyId = parsedBody.data.company_id ?? parsedBody.data.empresa_id;

  if (!title || !level || !region || !workModel || !skills) {
    return res.status(400).json({
      message: "Campos obrigatorios: titulo/title, skills/skills_requeridas, nivel/level, regiao/region e modalidade/work_model",
    });
  }

  if (job.metadata.relations.some((relation) => relation.propertyName === "company") && !companyId) {
    return res.status(400).json({
      message: "Empresa obrigatoria para criar vaga",
    });
  }

  const entity = job.repository.create();
  assignRelationById(entity, job.metadata, ["company", "company_id", "empresa_id"], companyId);
  assignIfColumn(entity, job.metadata, ["title", "titulo"], title);
  assignIfColumn(entity, job.metadata, ["area"], parsedBody.data.area ?? title);
  assignIfColumn(entity, job.metadata, ["description", "descricao"], parsedBody.data.description ?? parsedBody.data.descricao);
  assignIfColumn(entity, job.metadata, ["skills", "skills_requeridas", "required_skills"], skills);
  assignIfColumn(entity, job.metadata, ["level", "nivel"], level);
  assignIfColumn(entity, job.metadata, ["region", "regiao"], region);
  assignIfColumn(entity, job.metadata, ["work_model", "modalidade"], workModel);
  assignIfColumn(entity, job.metadata, ["diversity_minimum", "diversidade_minima"], parsedBody.data.diversity_minimum ?? parsedBody.data.diversidade_minima ?? 40);
  assignIfColumn(entity, job.metadata, ["deadline", "data_prazo"], parsedBody.data.deadline ?? parsedBody.data.data_prazo);
  assignIfColumn(entity, job.metadata, ["status"], parsedBody.data.status ?? "aberta");
  assignIfColumn(entity, job.metadata, ["data_publicacao", "published_at", "created_at"], new Date());

  const savedJob = await job.repository.save(entity);

  return res.status(201).json({
    message: "Vaga criada com sucesso",
    job: savedJob,
  });
});

jobsRoutes.get("/", async (req, res) => {
  try {
    const job = getEntityRepository(jobEntityNames);

    if (!job) {
      return res.status(501).json({
        message: "Entidade Job/Vaga nao registrada no backend",
      });
    }

    const companyId = req.query.company_id ?? req.query.empresa_id;
    const companyRelation = getRelationProperty(job.metadata, ["company", "company_id", "empresa_id"]);
    const companyProperty = getColumnProperty(job.metadata, ["company_id", "empresa_id"]);
    const options: FindManyOptions<ObjectLiteral> = {};

    if (typeof companyId === "string" && companyRelation) {
      options.where = { [companyRelation]: { id: companyId } };
    } else if (typeof companyId === "string" && companyProperty) {
      options.where = { [companyProperty]: companyId };
    }

    const orderProperty = getColumnProperty(job.metadata, [
      "created_at",
      "data_publicacao",
      "published_at",
    ]);

    if (orderProperty) {
      options.order = { [orderProperty]: "DESC" };
    }

    const jobs = await job.repository.find(options);

    return res.json({ jobs });
  } catch (error: unknown) {
    console.error("Erro ao listar vagas:", error);

    return res.status(500).json({
      message: "Erro interno ao listar vagas",
    });
  }
});

jobsRoutes.post("/:id/matches", async (req, res) => {
  try {
    const result = await runPersistentMatching(req.params.id);

    return res.status(result.status).json(result.body);
  } catch (error: unknown) {
    console.error("Erro ao persistir matching da vaga:", error);

    return res.status(500).json({
      message: "Erro interno ao persistir matching da vaga",
    });
  }
});
