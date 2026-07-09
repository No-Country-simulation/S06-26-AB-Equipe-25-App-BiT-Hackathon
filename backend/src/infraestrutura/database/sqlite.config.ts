import path from "node:path";
import type { DataSourceOptions } from "typeorm";

import type { DatabaseConfigContext, DatabaseProvider } from "./contracts.js";

export const sqliteDatabaseProvider: DatabaseProvider = {
  driver: "sqlite",
  createOptions(context: DatabaseConfigContext): DataSourceOptions {
    return {
      type: "sqlite",
      database: process.env.DATABASE_PATH ?? path.join(context.rootDir, "..", "database.sqlite"),
      synchronize: false,
      logging: false,
      entities: context.entities,
      migrations: context.migrations,
      subscribers: [],
    };
  },
};
