import type { DataSourceOptions } from "typeorm";

import "../env.js";
import type { DatabaseConfigContext, DatabaseDriver, DatabaseProvider } from "./contracts.js";
import { postgresDatabaseProvider } from "./postgres.config.js";
import { sqliteDatabaseProvider } from "./sqlite.config.js";

const providers: Record<DatabaseDriver, DatabaseProvider> = {
  sqlite: sqliteDatabaseProvider,
  postgres: postgresDatabaseProvider,
};

function resolveDatabaseDriver(): DatabaseDriver {
  const configuredDriver = process.env.DATABASE_DRIVER ?? process.env.DATABASE_TYPE ?? "sqlite";

  if (configuredDriver === "sqlite" || configuredDriver === "postgres") {
    return configuredDriver;
  }

  throw new Error(`Banco de dados nao suportado: ${configuredDriver}`);
}

export function createDatabaseOptions(context: DatabaseConfigContext): DataSourceOptions {
  const driver = resolveDatabaseDriver();

  return providers[driver].createOptions(context);
}
