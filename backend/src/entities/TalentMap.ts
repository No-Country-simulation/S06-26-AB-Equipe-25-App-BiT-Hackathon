import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"

@Entity("talent_maps")
export class TalentMap {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @Column("varchar")
    region!: string

    @Column("int", { unique: true })
    cluster_id!: number

    @Column("int")
    candidate_concentration!: number

    @Column("varchar")
    predominant_technology!: string

    @Column("varchar")
    mobility_indicator!: string

    @Column("simple-json")
    available_profiles!: string[]

    @Column("float", { nullable: true })
    lat!: number | null

    @Column("float", { nullable: true })
    lng!: number | null

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date
}
