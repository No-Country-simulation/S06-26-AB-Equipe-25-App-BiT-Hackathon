import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Candidate {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("simple-json")
    skills!: string[]

    @Column("varchar")
    name!: string

    @Column("varchar")
    level!: string

    @Column("varchar")
    work_model!: string

    @Column("varchar")
    region!: string

    @Column("float")
    lat!: number

    @Column("float")
    lng!: number

    @Column("varchar", { nullable: true })
    diversity_badge?: string | null
}
