import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import type { Relation } from "typeorm"

import { Company } from "./Company.js"
import { Match } from "./Match.js"

@Entity("jobs")
export class Job {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("varchar")
    title!: string

    @Column("varchar")
    area!: string

    @Column("simple-json")
    skills!: string[]

    @Column("varchar")
    level!: string

    @Column("varchar")
    work_model!: string

    @Column("varchar")
    region!: string

    @Column("varchar", { default: "open" })
    status!: string

    @Column("text", { nullable: true })
    description!: string | null

    @ManyToOne(() => Company, (company) => company.jobs, { onDelete: "CASCADE" })
    @JoinColumn({ name: "company_id" })
    company!: Relation<Company>

    @OneToMany(() => Match, (match) => match.job)
    matches!: Relation<Match[]>

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}
