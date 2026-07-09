import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Candidate {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("simple-json")
    skills!: string[]

    @Column("varchar")
    name!: string

    @Column("varchar", { default: "Profissional de Tecnologia" })
    professional_title!: string

    @Column("varchar", { default: "Tecnologia" })
    area!: string

    @Column("varchar")
    level!: string

    @Column("int", { default: 0 })
    experience_years!: number

    @Column("varchar", { default: "30 dias" })
    availability!: string

    @Column("varchar")
    work_model!: string

    @Column("varchar")
    region!: string

    @Column("float")
    lat!: number

    @Column("float")
    lng!: number

    @Column("varchar", { default: "4G" })
    connectivity!: string

    @Column("boolean", { default: false })
    is_underrepresented!: boolean

    @Column("varchar", { nullable: true })
    diversity_badge?: string | null
}
