import "reflect-metadata"
import { AppDataSource } from "./data-source.js"
import { Candidate } from "./entities/Candidate.js"

const mockCandidates = [
    {
        name: "Ana Souza",
        professional_title: "Desenvolvedora Backend Pleno",
        area: "Backend",
        skills: ["Node.js", "TypeScript", "PostgreSQL", "APIs REST", "Docker"],
        level: "pleno",
        experience_years: 4,
        availability: "imediata",
        work_model: "remoto",
        region: "Florianopolis - SC",
        lat: -27.5949,
        lng: -48.5482,
        connectivity: "4G/5G",
        is_underrepresented: true,
        diversity_badge: "Mulher negra em tecnologia"
    },
    {
        name: "Bruna Lima",
        professional_title: "Desenvolvedora Backend Junior",
        area: "Backend",
        skills: ["Node.js", "JavaScript", "PostgreSQL", "APIs REST"],
        level: "junior",
        experience_years: 1,
        availability: "15 dias",
        work_model: "hibrido",
        region: "Sao Jose - SC",
        lat: -27.6136,
        lng: -48.6366,
        connectivity: "4G",
        is_underrepresented: true,
        diversity_badge: "Mulher em tecnologia"
    },
    {
        name: "Caio Fernandes",
        professional_title: "Desenvolvedor Backend Junior",
        area: "Backend",
        skills: ["Node.js", "TypeScript", "MySQL", "APIs REST", "Express"],
        level: "junior",
        experience_years: 2,
        availability: "30 dias",
        work_model: "remoto",
        region: "Palhoca - SC",
        lat: -27.6455,
        lng: -48.6697,
        connectivity: "3G/4G",
        is_underrepresented: true,
        diversity_badge: "Pessoa de regiao periferica"
    },
    {
        name: "Daniel Rocha",
        professional_title: "Desenvolvedor Backend Pleno",
        area: "Backend",
        skills: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "Docker"],
        level: "pleno",
        experience_years: 3,
        availability: "imediata",
        work_model: "hibrido",
        region: "Florianopolis - SC",
        lat: -27.6011,
        lng: -48.532,
        connectivity: "5G",
        is_underrepresented: false,
        diversity_badge: null
    },
    {
        name: "Elisa Santos",
        professional_title: "Desenvolvedora Backend Junior",
        area: "Backend",
        skills: ["Node.js", "PostgreSQL", "APIs REST", "Git", "Docker"],
        level: "junior",
        experience_years: 1,
        availability: "imediata",
        work_model: "remoto",
        region: "Florianopolis - SC",
        lat: -27.5969,
        lng: -48.5495,
        connectivity: "4G",
        is_underrepresented: true,
        diversity_badge: "Pessoa LGBTQIA+"
    },
    {
        name: "Fabio Costa",
        professional_title: "Desenvolvedor Backend Senior",
        area: "Backend",
        skills: ["Node.js", "TypeScript", "PostgreSQL", "AWS", "APIs REST"],
        level: "senior",
        experience_years: 7,
        availability: "60 dias",
        work_model: "remoto",
        region: "Sao Jose - SC",
        lat: -27.5966,
        lng: -48.6088,
        connectivity: "4G/5G",
        is_underrepresented: false,
        diversity_badge: null
    },
    {
        name: "Gabriela Nunes",
        professional_title: "Desenvolvedora Full Stack Pleno",
        area: "Full Stack",
        skills: ["Node.js", "React", "TypeScript", "PostgreSQL", "APIs REST"],
        level: "pleno",
        experience_years: 4,
        availability: "15 dias",
        work_model: "hibrido",
        region: "Palhoca - SC",
        lat: -27.6488,
        lng: -48.6747,
        connectivity: "3G/4G",
        is_underrepresented: true,
        diversity_badge: "Pessoa com deficiencia"
    },
    {
        name: "Helena Martins",
        professional_title: "Desenvolvedora Backend Junior",
        area: "Backend",
        skills: ["JavaScript", "Node.js", "MongoDB", "Express", "APIs REST"],
        level: "junior",
        experience_years: 2,
        availability: "30 dias",
        work_model: "presencial",
        region: "Florianopolis - SC",
        lat: -27.5878,
        lng: -48.5476,
        connectivity: "4G",
        is_underrepresented: true,
        diversity_badge: "Mulher de baixa renda"
    },
    {
        name: "Igor Almeida",
        professional_title: "Desenvolvedor Frontend Junior",
        area: "Frontend",
        skills: ["React", "JavaScript", "CSS", "HTML", "Figma"],
        level: "junior",
        experience_years: 1,
        availability: "imediata",
        work_model: "remoto",
        region: "Florianopolis - SC",
        lat: -27.6032,
        lng: -48.5171,
        connectivity: "5G",
        is_underrepresented: false,
        diversity_badge: null
    },
    {
        name: "Joana Pereira",
        professional_title: "Analista de Dados Pleno",
        area: "Dados",
        skills: ["Python", "SQL", "Pandas", "Power BI", "ETL"],
        level: "pleno",
        experience_years: 3,
        availability: "15 dias",
        work_model: "remoto",
        region: "Sao Jose - SC",
        lat: -27.6127,
        lng: -48.6351,
        connectivity: "4G",
        is_underrepresented: true,
        diversity_badge: "Mulher em dados"
    },
    {
        name: "Kaique Oliveira",
        professional_title: "QA Junior",
        area: "QA",
        skills: ["Testes automatizados", "Cypress", "JavaScript", "APIs REST"],
        level: "junior",
        experience_years: 1,
        availability: "imediata",
        work_model: "hibrido",
        region: "Palhoca - SC",
        lat: -27.6429,
        lng: -48.6673,
        connectivity: "3G/4G",
        is_underrepresented: true,
        diversity_badge: "Pessoa negra"
    },
    {
        name: "Laura Batista",
        professional_title: "UX/UI Designer Pleno",
        area: "UX/UI",
        skills: ["Figma", "Pesquisa", "Prototipacao", "Acessibilidade"],
        level: "pleno",
        experience_years: 4,
        availability: "30 dias",
        work_model: "remoto",
        region: "Florianopolis - SC",
        lat: -27.5904,
        lng: -48.5518,
        connectivity: "4G/5G",
        is_underrepresented: true,
        diversity_badge: "Mulher LGBTQIA+"
    },
    {
        name: "Marcos Silva",
        professional_title: "Desenvolvedor Backend Junior",
        area: "Backend",
        skills: ["Node.js", "PostgreSQL", "SQL", "Git", "APIs REST"],
        level: "junior",
        experience_years: 1,
        availability: "imediata",
        work_model: "hibrido",
        region: "Sao Jose - SC",
        lat: -27.6098,
        lng: -48.6323,
        connectivity: "4G",
        is_underrepresented: true,
        diversity_badge: "Pessoa negra"
    },
    {
        name: "Nadia Ramos",
        professional_title: "Desenvolvedora Backend Pleno",
        area: "Backend",
        skills: ["TypeScript", "PostgreSQL", "NestJS", "APIs REST", "Docker"],
        level: "pleno",
        experience_years: 5,
        availability: "60 dias",
        work_model: "remoto",
        region: "Florianopolis - SC",
        lat: -27.6047,
        lng: -48.5312,
        connectivity: "5G",
        is_underrepresented: true,
        diversity_badge: "Mulher em tecnologia"
    },
    {
        name: "Otavio Reis",
        professional_title: "Desenvolvedor Full Stack Junior",
        area: "Full Stack",
        skills: ["React", "Node.js", "JavaScript", "MongoDB"],
        level: "junior",
        experience_years: 2,
        availability: "30 dias",
        work_model: "presencial",
        region: "Palhoca - SC",
        lat: -27.6471,
        lng: -48.6722,
        connectivity: "3G",
        is_underrepresented: false,
        diversity_badge: null
    },
    {
        name: "Patricia Gomes",
        professional_title: "Analista de Dados Junior",
        area: "Dados",
        skills: ["Python", "SQL", "Excel", "Dashboards"],
        level: "junior",
        experience_years: 1,
        availability: "imediata",
        work_model: "hibrido",
        region: "Sao Jose - SC",
        lat: -27.6154,
        lng: -48.6372,
        connectivity: "4G",
        is_underrepresented: true,
        diversity_badge: "Pessoa de baixa renda"
    },
    {
        name: "Rafael Araujo",
        professional_title: "Desenvolvedor Backend Junior",
        area: "Backend",
        skills: ["Node.js", "TypeScript", "SQLite", "Express", "APIs REST"],
        level: "junior",
        experience_years: 2,
        availability: "15 dias",
        work_model: "remoto",
        region: "Florianopolis - SC",
        lat: -27.5952,
        lng: -48.5433,
        connectivity: "4G/5G",
        is_underrepresented: false,
        diversity_badge: null
    },
    {
        name: "Sofia Cardoso",
        professional_title: "Desenvolvedora Frontend Pleno",
        area: "Frontend",
        skills: ["React", "TypeScript", "Tailwind", "Acessibilidade"],
        level: "pleno",
        experience_years: 3,
        availability: "30 dias",
        work_model: "remoto",
        region: "Palhoca - SC",
        lat: -27.6403,
        lng: -48.6662,
        connectivity: "3G/4G",
        is_underrepresented: true,
        diversity_badge: "Mulher negra em tecnologia"
    },
    {
        name: "Tiago Moreira",
        professional_title: "QA Pleno",
        area: "QA",
        skills: ["Testes automatizados", "Playwright", "APIs REST", "SQL"],
        level: "pleno",
        experience_years: 4,
        availability: "15 dias",
        work_model: "hibrido",
        region: "Sao Jose - SC",
        lat: -27.6071,
        lng: -48.6291,
        connectivity: "4G",
        is_underrepresented: false,
        diversity_badge: null
    },
    {
        name: "Vitoria Melo",
        professional_title: "Desenvolvedora Backend Junior",
        area: "Backend",
        skills: ["Node.js", "TypeScript", "PostgreSQL", "APIs REST", "Testes automatizados"],
        level: "junior",
        experience_years: 2,
        availability: "imediata",
        work_model: "remoto",
        region: "Palhoca - SC",
        lat: -27.6501,
        lng: -48.6789,
        connectivity: "3G/4G",
        is_underrepresented: true,
        diversity_badge: "Pessoa neurodivergente"
    }
]

async function runSeed() {
    await AppDataSource.initialize()
    console.log("Banco de dados SQLite conectado. Iniciando processo de seed...");

    const candidateRepo = AppDataSource.getRepository(Candidate)

    await candidateRepo.clear()

    for (const data of mockCandidates) {
        const candidate = candidateRepo.create(data)
        await candidateRepo.save(candidate)
    }

    console.log(`Seed concluido com sucesso! ${mockCandidates.length} candidatos mockados e inseridos.`);
    process.exit(0)
}

runSeed().catch(err => {
    console.error("Erro fatal durante o seed:", err)
    process.exit(1)
})
