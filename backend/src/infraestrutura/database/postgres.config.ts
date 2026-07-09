import type { DataSourceOptions } from "typeorm";

import type { DatabaseConfigContext, DatabaseProvider } from "./contracts.js";

function optionalSsl() {
  if (process.env.DATABASE_SSL !== "true") {
    return false;
  }

  return {
    rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
  };
}

export const postgresDatabaseProvider: DatabaseProvider = {
  driver: "postgres",
  createOptions(context: DatabaseConfigContext): DataSourceOptions {
    const baseOptions = {
      type: "postgres" as const,
      synchronize: false,
      logging: false,
      entities: context.entities,
      migrations: context.migrations,
      subscribers: [],
      ssl: optionalSsl(),
    };

    if (process.env.DATABASE_URL) {
      return {
        ...baseOptions,
        url: process.env.DATABASE_URL,
      };
    }

    return {
      ...baseOptions,
      host: process.env.POSTGRES_HOST ?? process.env.PGHOST ?? "localhost",
      port: Number(process.env.POSTGRES_PORT ?? process.env.PGPORT ?? 5432),
      username: process.env.POSTGRES_USER ?? process.env.PGUSER ?? "postgres",
      password: process.env.POSTGRES_PASSWORD ?? process.env.PGPASSWORD ?? "postgres",
      database: process.env.POSTGRES_DB ?? process.env.PGDATABASE ?? "appbit",
    };
  },
};
