import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm"
import type { Relation } from "typeorm"

import { Job } from "./Job.js"

@Entity("companies")
export class Company {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("varchar")
    name!: string

    @Column("varchar")
    segment!: string

    @Column("varchar")
    region!: string

    @Column("varchar", { nullable: true })
    contact_email!: string | null

    @Column("varchar")
    password!: string

    @Column("float", { default: 0.45 })
    diversity_goal!: number

    @OneToMany(() => Job, (job) => job.company)
    jobs!: Relation<Job[]>

    @CreateDateColumn()
    created_at!: Date
}
