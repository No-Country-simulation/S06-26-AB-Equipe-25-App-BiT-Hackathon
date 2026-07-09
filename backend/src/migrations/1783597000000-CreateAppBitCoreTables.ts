import type { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAppBitCoreTables1783597000000 implements MigrationInterface {
    name = "CreateAppBitCoreTables1783597000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "candidate" (
                "id" varchar PRIMARY KEY NOT NULL,
                "skills" text NOT NULL,
                "name" varchar NOT NULL,
                "professional_title" varchar NOT NULL DEFAULT ('Profissional de Tecnologia'),
                "area" varchar NOT NULL DEFAULT ('Tecnologia'),
                "level" varchar NOT NULL,
                "experience_years" integer NOT NULL DEFAULT (0),
                "availability" varchar NOT NULL DEFAULT ('30 dias'),
                "work_model" varchar NOT NULL,
                "region" varchar NOT NULL,
                "lat" float NOT NULL,
                "lng" float NOT NULL,
                "connectivity" varchar NOT NULL DEFAULT ('4G'),
                "is_underrepresented" boolean NOT NULL DEFAULT (0),
                "diversity_badge" varchar
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "companies" (
                "id" varchar PRIMARY KEY NOT NULL,
                "name" varchar NOT NULL,
                "segment" varchar NOT NULL,
                "region" varchar NOT NULL,
                "contact_email" varchar,
                "password" varchar NOT NULL,
                "diversity_goal" float NOT NULL DEFAULT (0.45),
                "created_at" datetime NOT NULL DEFAULT (datetime('now'))
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "jobs" (
                "id" varchar PRIMARY KEY NOT NULL,
                "title" varchar NOT NULL,
                "area" varchar NOT NULL,
                "skills" text NOT NULL,
                "level" varchar NOT NULL,
                "work_model" varchar NOT NULL,
                "region" varchar NOT NULL,
                "status" varchar NOT NULL DEFAULT ('open'),
                "description" text,
                "company_id" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_jobs_company" FOREIGN KEY ("company_id") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "matches" (
                "id" varchar PRIMARY KEY NOT NULL,
                "score_match" integer NOT NULL,
                "status" varchar NOT NULL DEFAULT ('shortlisted'),
                "matched_skills" text NOT NULL,
                "insight" text,
                "job_id" varchar,
                "candidate_id" varchar,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "FK_matches_job" FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") ON DELETE CASCADE ON UPDATE NO ACTION,
                CONSTRAINT "FK_matches_candidate" FOREIGN KEY ("candidate_id") REFERENCES "candidate" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
            )
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "talent_maps" (
                "id" varchar PRIMARY KEY NOT NULL,
                "region" varchar NOT NULL,
                "cluster_id" integer NOT NULL,
                "candidate_concentration" integer NOT NULL,
                "predominant_technology" varchar NOT NULL,
                "mobility_indicator" varchar NOT NULL,
                "available_profiles" text NOT NULL,
                "lat" float,
                "lng" float,
                "created_at" datetime NOT NULL DEFAULT (datetime('now')),
                "updated_at" datetime NOT NULL DEFAULT (datetime('now')),
                CONSTRAINT "UQ_talent_maps_cluster_id" UNIQUE ("cluster_id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "talent_maps"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "matches"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "jobs"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "companies"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "candidate"`);
    }
}
