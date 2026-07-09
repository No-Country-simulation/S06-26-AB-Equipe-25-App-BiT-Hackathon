import "reflect-metadata"
import { DataSource } from "typeorm"
import { Candidate } from "./entities/Candidate.js"
import path from "path"
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: path.join(__dirname, "..", "database.sqlite"),
    synchronize: true, // Auto-cria as tabelas no MVP
    logging: false,
    entities: [Candidate],
    migrations: [],
    subscribers: [],
})
