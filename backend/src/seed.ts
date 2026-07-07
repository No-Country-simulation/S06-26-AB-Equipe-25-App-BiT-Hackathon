import "reflect-metadata"
import { AppDataSource } from "./data-source.js"
import { Candidate } from "./entities/Candidate.js"

async function runSeed() {
    await AppDataSource.initialize()
    console.log("Banco de dados SQLite conectado. Iniciando processo de seed...");

    const candidateRepo = AppDataSource.getRepository(Candidate)

    // Limpa a tabela atual para não duplicar no dev
    await candidateRepo.clear()

    const mockCandidates = [
        {
            name: "Ana Souza",
            skills: ["Node.js", "PostgreSQL", "Docker", "TypeScript", "SQL"],
            level: "pleno",
            work_model: "remoto",
            region: "Zona Norte - SP",
            lat: -23.498,
            lng: -46.620,
            diversity_badge: "Mulher negra em tecnologia"
        },
        {
            name: "Carlos Mendes",
            skills: ["React", "JavaScript", "Figma", "UI/UX"],
            level: "junior",
            work_model: "hibrido",
            region: "Região Metropolitana - Salvador",
            lat: -12.9714,
            lng: -38.5014,
            diversity_badge: "PCD"
        },
        {
            name: "Juliana Martins",
            skills: ["Node.js", "AWS", "SQL", "Express", "MongoDB"],
            level: "senior",
            work_model: "remoto",
            region: "Interior - MG",
            lat: -19.9167,
            lng: -43.9345,
            diversity_badge: "Mulheres na liderança"
        },
        {
            name: "Roberto Silva",
            skills: ["Python", "Django", "PostgreSQL", "React"],
            level: "pleno",
            work_model: "presencial",
            region: "Zona Sul - RJ",
            lat: -22.9068,
            lng: -43.1729,
            diversity_badge: null
        }
    ]

    for (const data of mockCandidates) {
        const candidate = candidateRepo.create(data)
        await candidateRepo.save(candidate)
    }

    console.log(`Seed concluído com sucesso! ${mockCandidates.length} candidatos mockados e inseridos.`);
    process.exit(0)
}

runSeed().catch(err => {
    console.error("Erro fatal durante o seed:", err)
    process.exit(1)
})
