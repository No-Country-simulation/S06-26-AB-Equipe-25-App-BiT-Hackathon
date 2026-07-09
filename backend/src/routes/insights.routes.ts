import { Router } from "express";
import type { EntityMetadata, FindManyOptions, ObjectLiteral, Repository } from "typeorm";

import { AppDataSource } from "../data-source.js";

type EntityRepository = {
  metadata: EntityMetadata;
  repository: Repository<ObjectLiteral>;
};

const talentMapEntityNames = ["TalentMap", "MapaTalentos", "mapa_talentos", "talent_maps"];

export const insightsRoutes = Router();

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

function readValue(entity: ObjectLiteral, metadata: EntityMetadata, candidates: string[]) {
  const propertyName = getColumnProperty(metadata, candidates);

  return propertyName ? entity[propertyName] : undefined;
}

insightsRoutes.get("/", async (_req, res) => {
  const talentMap = getEntityRepository(talentMapEntityNames);

  if (!talentMap) {
    return res.status(501).json({
      message: "Entidade TalentMap/mapa_talentos nao registrada no backend",
    });
  }

  const orderProperty = getColumnProperty(talentMap.metadata, [
    "candidate_concentration",
    "concentracao_candidatos",
    "total_pessoas",
    "updated_at",
  ]);
  const options: FindManyOptions<ObjectLiteral> = {};

  if (orderProperty) {
    options.order = { [orderProperty]: "DESC" };
  }

  const rows = await talentMap.repository.find(options);

  return res.json({
    mapa_talentos: rows.map((row) => ({
      regiao:
        readValue(row, talentMap.metadata, ["regiao", "region", "municipio", "cluster"]) ?? "",
      cluster_id: readValue(row, talentMap.metadata, ["cluster_id", "cluster", "id"]),
      concentracao_candidatos:
        readValue(row, talentMap.metadata, [
          "candidate_concentration",
          "concentracao_candidatos",
          "total_pessoas",
        ]) ?? 0,
      tecnologia_predominante:
        readValue(row, talentMap.metadata, [
          "predominant_technology",
          "tecnologia_predominante",
          "connectivity",
          "conectividade",
        ]) ?? "nao informado",
      indicador_mobilidade:
        readValue(row, talentMap.metadata, [
          "indicador_mobilidade",
          "mobility_indicator",
          "periodo_pico",
        ]) ?? "nao informado",
      perfis_disponiveis:
        readValue(row, talentMap.metadata, ["perfis_disponiveis", "available_profiles"]) ?? [],
      lat: readValue(row, talentMap.metadata, ["lat", "latitude"]),
      lng: readValue(row, talentMap.metadata, ["lng", "lon", "longitude"]),
    })),
  });
});
