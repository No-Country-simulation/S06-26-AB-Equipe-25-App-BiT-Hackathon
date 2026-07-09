import { Router } from "express";
import { z } from "zod";
import { createHash } from "node:crypto";
import type { EntityMetadata, ObjectLiteral, Repository } from "typeorm";

import { AppDataSource } from "../data-source.js";

type EntityRepository = {
  metadata: EntityMetadata;
  repository: Repository<ObjectLiteral>;
};

const companyEntityNames = ["Company", "Empresa", "empresas", "companies"];

const signupSchema = z.object({
  name: z.string().min(1).optional(),
  nome: z.string().min(1).optional(),
  company_name: z.string().min(1).optional(),
  razao_social: z.string().min(1).optional(),
  email: z.string().email(),
  segment: z.string().min(1).optional(),
  sector: z.string().min(1).optional(),
  segmento: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  senha: z.string().min(6).optional(),
  cnpj: z.string().min(1).optional(),
  regiao: z.string().min(1).optional(),
  meta_diversidade: z.number().min(0).max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).optional(),
  senha: z.string().min(1).optional(),
});

export const authRoutes = Router();

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

function omitSensitiveFields(entity: ObjectLiteral) {
  const { password: _password, senha: _senha, password_hash: _passwordHash, ...safeEntity } = entity;

  return safeEntity;
}

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

authRoutes.post("/signup", async (req, res) => {
  const parsedBody = signupSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Dados de cadastro invalidos",
      issues: parsedBody.error.issues,
    });
  }

  const company = getEntityRepository(companyEntityNames);

  if (!company) {
    return res.status(501).json({
      message: "Entidade Company/Empresa nao registrada no backend",
    });
  }

  const emailProperty = getColumnProperty(company.metadata, ["email", "contact_email"]);

  if (!emailProperty) {
    return res.status(500).json({
      message: "Entidade Company/Empresa nao possui coluna de email",
    });
  }

  const existingCompany = await company.repository.findOne({
    where: { [emailProperty]: parsedBody.data.email },
  });

  if (existingCompany) {
    return res.status(409).json({
      message: "Empresa ja cadastrada com este email",
    });
  }

  const password = parsedBody.data.password ?? parsedBody.data.senha;
  const passwordProperty = getColumnProperty(company.metadata, ["password", "senha", "password_hash"]);
  const companyName =
    parsedBody.data.name ??
    parsedBody.data.nome ??
    parsedBody.data.company_name ??
    parsedBody.data.razao_social;

  if (passwordProperty && !password) {
    return res.status(400).json({
      message: "Senha obrigatoria",
    });
  }

  if (!companyName) {
    return res.status(400).json({
      message: "Nome da empresa obrigatorio",
    });
  }

  const entity = company.repository.create();
  assignIfColumn(entity, company.metadata, ["name", "nome", "company_name", "razao_social"], companyName);
  assignIfColumn(entity, company.metadata, ["email", "contact_email"], parsedBody.data.email);
  assignIfColumn(entity, company.metadata, ["segment", "sector", "segmento"], parsedBody.data.segment ?? parsedBody.data.sector ?? parsedBody.data.segmento ?? "Tecnologia");
  assignIfColumn(entity, company.metadata, ["password", "senha", "password_hash"], password ? hashPassword(password) : undefined);
  assignIfColumn(entity, company.metadata, ["cnpj"], parsedBody.data.cnpj);
  assignIfColumn(entity, company.metadata, ["regiao", "region"], parsedBody.data.regiao ?? "Brasil");
  const diversityGoal =
    parsedBody.data.meta_diversidade !== undefined
      ? parsedBody.data.meta_diversidade > 1
        ? parsedBody.data.meta_diversidade / 100
        : parsedBody.data.meta_diversidade
      : undefined;
  assignIfColumn(entity, company.metadata, ["meta_diversidade", "diversity_goal"], diversityGoal);

  const savedCompany = await company.repository.save(entity);

  return res.status(201).json({
    message: "Empresa cadastrada com sucesso",
    company: omitSensitiveFields(savedCompany),
  });
});

authRoutes.post("/login", async (req, res) => {
  const parsedBody = loginSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({
      message: "Dados de login invalidos",
      issues: parsedBody.error.issues,
    });
  }

  const company = getEntityRepository(companyEntityNames);

  if (!company) {
    return res.status(501).json({
      message: "Entidade Company/Empresa nao registrada no backend",
    });
  }

  const emailProperty = getColumnProperty(company.metadata, ["email", "contact_email"]);

  if (!emailProperty) {
    return res.status(500).json({
      message: "Entidade Company/Empresa nao possui coluna de email",
    });
  }

  const foundCompany = await company.repository.findOne({
    where: { [emailProperty]: parsedBody.data.email },
  });
  const password = parsedBody.data.password ?? parsedBody.data.senha;
  const storedPassword =
    foundCompany?.password ?? foundCompany?.senha ?? foundCompany?.password_hash;

  const validPassword =
    storedPassword === undefined ||
    (password !== undefined &&
      (storedPassword === password || storedPassword === hashPassword(password)));

  if (!foundCompany || !validPassword) {
    return res.status(401).json({
      message: "Email ou senha invalidos",
    });
  }

  return res.json({
    message: "Login realizado com sucesso",
    company: omitSensitiveFields(foundCompany),
  });
});
