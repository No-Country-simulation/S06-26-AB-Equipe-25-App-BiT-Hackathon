import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm"
import type { Relation } from "typeorm"

import { Candidate } from "./Candidate.js"
import { Job } from "./Job.js"

@Entity("matches")
export class Match {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("int")
    score_match!: number

    @Column("varchar", { default: "shortlisted" })
    status!: string

    @Column("simple-json")
    matched_skills!: string[]

    @Column("text", { nullable: true })
    insight!: string | null

    @ManyToOne(() => Job, (job) => job.matches, { onDelete: "CASCADE" })
    @JoinColumn({ name: "job_id" })
    job!: Relation<Job>

    @ManyToOne(() => Candidate, { onDelete: "CASCADE" })
    @JoinColumn({ name: "candidate_id" })
    candidate!: Relation<Candidate>

    @CreateDateColumn()
    created_at!: Date
}
