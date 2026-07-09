import "reflect-metadata"
import { DataSource } from "typeorm"
import { Candidate } from "./entities/Candidate.js"
import { Company } from "./entities/Company.js"
import { Job } from "./entities/Job.js"
import { Match } from "./entities/Match.js"
import { TalentMap } from "./entities/TalentMap.js"
import { createDatabaseOptions } from "./infraestrutura/database/index.js"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource(createDatabaseOptions({
    rootDir: __dirname,
    entities: [Candidate, Company, Job, Match, TalentMap],
    migrations: [path.join(__dirname, "migrations", "*.{ts,js}")],
}))
