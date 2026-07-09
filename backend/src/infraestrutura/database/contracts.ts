import type { DataSourceOptions } from "typeorm";

export type DatabaseDriver = "sqlite" | "postgres";

export type DatabaseConfigContext = {
  rootDir: string;
  entities: NonNullable<DataSourceOptions["entities"]>;
  migrations: NonNullable<DataSourceOptions["migrations"]>;
};

export type DatabaseProvider = {
  driver: DatabaseDriver;
  createOptions(context: DatabaseConfigContext): DataSourceOptions;
};
