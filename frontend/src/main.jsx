import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronDown,
  Eye,
  EyeOff,
  Filter,
  Laptop,
  MapPin,
  Monitor,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
} from "lucide-react";
import "./styles.css";

const steps = [
  { id: "login", number: "01", label: "Login", public: true },
  { id: "signup", number: "02", label: "Cadastro", public: true },
  { id: "publish", number: "03", label: "Publicar Vaga" },
  { id: "jobs", number: "04", label: "Vagas Publicadas" },
  { id: "results", number: "05", label: "Resultados" },
];

const audiences = ["PcD", "Mulher", "Pessoa negra", "Pessoa LGBTQIA+", "Profissional 50+"];

const company = {
  nome: "Ambev S.A.",
  iniciais: "AM",
  setor: "Bebidas e consumo",
  regiao: "CBD_BEIRAMAR",
  metaDiversidade: 0.45,
};

const jobs = [
  {
    id: 47,
    titulo: "Analista de Dados Sênior",
    data: "18 jun. 2026",
    status: "Ativa",
    nivel: "senior",
    skills: ["Python", "SQL", "Spark"],
    regiao: "CBD_BEIRAMAR",
  },
  {
    id: 32,
    titulo: "Desenvolvedora Full-Stack Pleno",
    data: "02 jun. 2026",
    status: "Ativa",
    nivel: "pleno",
    skills: ["React", "Node.js", "PostgreSQL"],
    regiao: "TRINDADE",
  },
  {
    id: 18,
    titulo: "Coordenadora de Diversidade e Inclusão",
    data: "14 mai. 2026",
    status: "Encerrada",
    nivel: "senior",
    skills: ["ESG", "People Analytics", "Liderança"],
    regiao: "SAO_JOSE_CENTRO",
  },
];

const candidates = [
  {
    id: "#0001",
    initials: "MS",
    name: "Mariana Souza",
    score: 91,
    badge: true,
    tags: ["Pessoa com Deficiência (PcD)", "Mulher"],
    role: "Analista de Dados Sr.",
    education: "Ciência da Computação",
    skills: ["Python", "SQL", "Spark"],
  },
  {
    id: "#0002",
    initials: "LC",
    name: "Lucas Carvalho",
    score: 87,
    badge: true,
    tags: ["Pessoa negra"],
    role: "Engenheiro de Dados Pleno",
    education: "Sistemas de Informação",
    skills: ["Python", "Airflow", "BigQuery"],
  },
  {
    id: "#0003",
    initials: "AR",
    name: "Ana Ribeiro",
    score: 82,
    badge: true,
    tags: ["Mulher", "Profissional 50+"],
    role: "Especialista BI",
    education: "Estatística",
    skills: ["Power BI", "SQL", "Databricks"],
  },
  {
    id: "#0004",
    initials: "JP",
    name: "João Pereira",
    score: 76,
    badge: false,
    tags: ["Região prioritária"],
    role: "Analista de Dados Pleno",
    education: "Engenharia de Produção",
    skills: ["Python", "Excel", "Tableau"],
  },
];

function App() {
  const [screen, setScreen] = useState("login");
  const [isAuthed, setIsAuthed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(47);

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? jobs[0],
    [selectedJobId]
  );

  function navigate(nextScreen) {
    const target = steps.find((step) => step.id === nextScreen);
    if (!target) return;
    if (!target.public && !isAuthed) return;
    setScreen(nextScreen);
  }

  function authenticate(nextScreen = "publish") {
    setIsAuthed(true);
    setScreen(nextScreen);
  }

  return (
    <main className="page-shell">
      {screen === "login" && (
        <AuthLayout activeStep="login" isAuthed={isAuthed} onStepClick={navigate}>
          <LoginScreen
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onLogin={() => authenticate("jobs")}
            onSignup={() => navigate("signup")}
          />
        </AuthLayout>
      )}

      {screen === "signup" && (
        <AuthLayout activeStep="signup" mode="signup" isAuthed={isAuthed} onStepClick={navigate}>
          <SignupScreen
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onCreate={() => authenticate("publish")}
            onLogin={() => navigate("login")}
          />
        </AuthLayout>
      )}

      {screen === "publish" && (
        <DashboardLayout activeStep="publish" isAuthed={isAuthed} onStepClick={navigate}>
          <PublishJobScreen onPublish={() => navigate("jobs")} />
        </DashboardLayout>
      )}

      {screen === "jobs" && (
        <DashboardLayout activeStep="jobs" isAuthed={isAuthed} onStepClick={navigate}>
          <JobsScreen
            jobs={jobs}
            onSelectJob={(jobId) => {
              setSelectedJobId(jobId);
              navigate("results");
            }}
          />
        </DashboardLayout>
      )}

      {screen === "results" && (
        <DashboardLayout activeStep="results" isAuthed={isAuthed} onStepClick={navigate} compact>
          <ResultsScreen job={selectedJob} candidates={candidates} onBack={() => navigate("jobs")} />
        </DashboardLayout>
      )}
    </main>
  );
}

function AuthLayout({ children, activeStep, isAuthed, onStepClick, mode = "login" }) {
  return (
    <section className={`auth-stage ${mode}`} aria-label="App BiT autenticação">
      <aside className="auth-brand-panel">
        <AppLogo variant="light" />
        {mode === "login" ? <LoginBrandCopy /> : <SignupBrandCopy />}
      </aside>

      <section className="auth-form-panel">
        <AccessibilityButton />
        {children}
      </section>

      <StepNav activeStep={activeStep} isAuthed={isAuthed} onStepClick={onStepClick} authVariant />
    </section>
  );
}

function LoginBrandCopy() {
  return (
    <>
      <div className="login-brand-copy">
        <div className="esg-badge">
          <Sparkles size={18} strokeWidth={2.8} />
          <span>Plataforma ESG de talentos</span>
        </div>
        <h1>Conectando empresas a talentos que transformam culturas</h1>
        <p>Matching inteligente entre suas metas ESG e candidatos de grupos sub-representados.</p>
        <div className="audience-tags" aria-label="Grupos contemplados">
          {audiences.map((item) => (
            <span className={item === "Mulher" ? "tag highlight" : "tag"} key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="social-proof" aria-label="Empresas parceiras">
        <div className="avatar-stack">
          <span>RH</span>
          <span>MG</span>
          <span>TA</span>
        </div>
        <strong>+2.400 empresas parceiras</strong>
      </div>
    </>
  );
}

function SignupBrandCopy() {
  return (
    <div className="signup-brand-copy">
      <h1>Comece sua jornada de inclusão hoje</h1>
      <p>Crie sua conta, publique vagas e encontre talentos que refletem a diversidade do Brasil.</p>

      <ul>
        <li><span>🎯</span> Matching baseado em IA com score de compatibilidade</li>
        <li><span>🏅</span> Relatórios ESG prontos para stakeholders</li>
        <li><span>🤝</span> Suporte dedicado para metas de diversidade</li>
      </ul>

      <div className="trial-card">
        <strong>Gratuito por 30 dias</strong>
        <span>Sem necessidade de cartão de crédito</span>
      </div>
    </div>
  );
}

function LoginScreen({ showPassword, setShowPassword, onLogin, onSignup }) {
  return (
    <div className="form-card login-card">
      <AppLogo variant="dark" />
      <div className="welcome">
        <h2>Bem-vindo de volta</h2>
        <p>Acesse sua conta corporativa para continuar</p>
      </div>

      <form
        className="stacked-form"
        onSubmit={(event) => {
          event.preventDefault();
          onLogin();
        }}
      >
        <Field label="E-mail corporativo" placeholder="nome@empresa.com.br" type="email" />
        <PasswordField
          label="Senha"
          placeholder="••••••••"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <a className="forgot-link" href="#recuperar-senha">Esqueci minha senha</a>
        <button className="primary-button" type="submit">Entrar</button>
      </form>

      <p className="switch-copy">
        Não tem conta? <button type="button" onClick={onSignup}>Cadastre sua empresa</button>
      </p>
    </div>
  );
}

function SignupScreen({ showPassword, setShowPassword, onCreate, onLogin }) {
  return (
    <div className="form-card signup-card">
      <AppLogo variant="dark" />
      <div className="welcome">
        <h2>Cadastre sua empresa</h2>
        <p>Preencha os dados para criar sua conta</p>
      </div>

      <form
        className="stacked-form signup-form"
        onSubmit={(event) => {
          event.preventDefault();
          onCreate();
        }}
      >
        <Field label="Nome da empresa" placeholder="Ex: Tech Solutions Ltda." />
        <SelectLike label="Setor / segmento" placeholder="Selecione o setor" />
        <Field label="E-mail corporativo" placeholder="rh@empresa.com.br" type="email" />
        <PasswordField
          label="Senha"
          placeholder="Mínimo 8 caracteres"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
        />
        <Field label="Confirmar senha" placeholder="••••••••" type="password" />

        <label className="terms-row">
          <input type="checkbox" />
          <span>Concordo com os <a href="#termos">Termos de Uso</a> e a <a href="#privacidade">Política de Privacidade</a></span>
        </label>

        <button className="primary-button" type="submit">Criar conta</button>
      </form>

      <p className="switch-copy">
        Já tem conta? <button type="button" onClick={onLogin}>Fazer login</button>
      </p>
    </div>
  );
}

function DashboardLayout({ children, activeStep, isAuthed, onStepClick, compact = false }) {
  return (
    <section className={`dashboard-stage ${compact ? "compact" : ""}`}>
      <AccessibilityButton />
      <header className="app-header">
        <AppLogo variant="dark" size="small" />
        <div className="company-chip">
          <strong>{company.nome}</strong>
          <span>{company.iniciais}</span>
        </div>
      </header>
      <div className="dashboard-body">{children}</div>
      <StepNav activeStep={activeStep} isAuthed={isAuthed} onStepClick={onStepClick} />
    </section>
  );
}

function PublishJobScreen({ onPublish }) {
  const [workMode, setWorkMode] = useState("Híbrido");
  const [level, setLevel] = useState("Pleno");

  return (
    <div className="publish-page content-narrow">
      <PageTitle title="Nova vaga" subtitle="Preencha os detalhes e encontre novos talentos para a sua equipe" />

      <form
        className="job-form-card"
        onSubmit={(event) => {
          event.preventDefault();
          onPublish();
        }}
      >
        <Field label="Título da vaga" placeholder="Ex: Analista de Dados Sênior" />
        <Field label="Área / departamento" placeholder="Ex: Tecnologia, Marketing, RH..." />

        <ChoiceGroup label="Modalidade">
          {[
            { label: "Presencial", icon: Building2 },
            { label: "Híbrido", icon: Monitor },
            { label: "Remoto", icon: MapPin },
          ].map((option) => (
            <ChoiceCard
              key={option.label}
              active={workMode === option.label}
              icon={option.icon}
              label={option.label}
              onClick={() => setWorkMode(option.label)}
            />
          ))}
        </ChoiceGroup>

        <ChoiceGroup label="Nível da vaga" compact>
          {["Estágio", "Júnior", "Pleno", "Sênior"].map((option) => (
            <button
              className={level === option ? "level-pill active" : "level-pill"}
              type="button"
              key={option}
              onClick={() => setLevel(option)}
            >
              {option}
            </button>
          ))}
        </ChoiceGroup>

        <label className="field-block">
          <span>Descrição da vaga</span>
          <textarea placeholder="Descreva responsabilidades, requisitos e diferenciais..." />
        </label>

        <button className="primary-button publish-button" type="submit">Publicar vaga</button>
      </form>
    </div>
  );
}

function JobsScreen({ jobs: jobList, onSelectJob }) {
  return (
    <div className="jobs-page content-narrow">
      <PageTitle title="Vagas publicadas" subtitle="Clique em uma vaga para ver os perfis recomendados" />
      <div className="jobs-list">
        {jobList.map((job) => (
          <button className="job-card" type="button" key={job.id} onClick={() => onSelectJob(job.id)}>
            <span>
              <strong>{job.titulo}</strong>
              <small>Publicada em {job.data}</small>
            </span>
            <StatusPill status={job.status} />
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultsScreen({ job, candidates: candidateList, onBack }) {
  return (
    <div className="results-page content-narrow">
      <button className="back-button" type="button" onClick={onBack}>
        <ArrowLeft size={18} />
        Voltar
      </button>
      <span className="process-label">PROCESSO #2024-{job.id} · {job.titulo.toUpperCase()}</span>

      <div className="results-heading">
        <h1>Perfis recomendados</h1>
        <span className="found-pill">4 candidatos encontrados</span>
      </div>

      <div className="filter-row">
        <div className="segmented">
          <button className="active" type="button">Todos (4)</button>
          <button type="button">Score &gt; 80% (2)</button>
        </div>
        <button className="sort-button" type="button">
          <SlidersHorizontal size={18} />
          Ordenar
          <ChevronDown size={16} />
        </button>
      </div>

      <article className="analysis-card">
        <div className="analysis-title">
          <Sparkles size={20} />
          <strong>ANÁLISE DA SHORTLIST</strong>
          <span>Gerado agora</span>
        </div>
        <p>Encontramos 4 perfis com alta compatibilidade para esta vaga.</p>
        <p><b>Mariana Souza</b> se destaca com <b>91% de compatibilidade</b> e experiência alinhada às competências prioritárias da posição.</p>
        <footer>Fonte: modelo de matching interno v2.3 · Critérios: técnico 60% / cultural 25% / diversidade 15%</footer>
      </article>

      <div className="candidate-divider"><span>LISTA DE CANDIDATOS</span></div>

      <div className="candidate-list">
        {candidateList.map((candidate) => (
          <CandidateCard candidate={candidate} key={candidate.id} />
        ))}
      </div>
    </div>
  );
}

function CandidateCard({ candidate }) {
  return (
    <article className="candidate-card">
      <div className="candidate-top">
        <span className="candidate-avatar">{candidate.initials}</span>
        <div>
          <h2>{candidate.name}</h2>
          <p>ID {candidate.id}</p>
        </div>
        <div className="score">
          <span>COMPATIBILIDADE</span>
          <strong>{candidate.score}%</strong>
        </div>
      </div>

      {candidate.badge && <span className="eligible-pill"><Check size={17} /> Elegível para vaga afirmativa</span>}

      <section className="declaration-box">
        <h3>AUTODECLARAÇÃO</h3>
        <p>O candidato se autodeclarou como:</p>
        <div className="mini-tags">
          {candidate.tags.map((tag) => (
            <span className={tag === "Mulher" ? "mini-tag pink" : "mini-tag"} key={tag}>{tag}</span>
          ))}
        </div>
      </section>

      <h3 className="candidate-section-title">EXPERIÊNCIAS, FORMAÇÃO E HABILIDADES</h3>
      <div className="candidate-grid">
        <span>{candidate.role}</span>
        <span>{candidate.education}</span>
        <span>{candidate.skills.join(" · ")}</span>
      </div>
    </article>
  );
}

function StepNav({ activeStep, isAuthed, onStepClick, authVariant = false }) {
  return (
    <nav className={`step-nav ${authVariant ? "auth-nav" : ""}`} aria-label="Fluxo App BiT">
      {steps.map((step) => {
        const locked = !step.public && !isAuthed;
        return (
          <button
            className={activeStep === step.id ? "step active" : "step"}
            type="button"
            key={step.id}
            disabled={locked}
            onClick={() => onStepClick(step.id)}
            title={locked ? "Faça login ou cadastro para acessar" : step.label}
          >
            <strong>{step.number}</strong>
            <span>{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function Field({ label, placeholder, type = "text" }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="field-block" htmlFor={id}>
      <span>{label}</span>
      <input id={id} placeholder={placeholder} type={type} />
    </label>
  );
}

function PasswordField({ label, placeholder, showPassword, setShowPassword }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="field-block" htmlFor={id}>
      <span>{label}</span>
      <div className="password-field">
        <input id={id} placeholder={placeholder} type={showPassword ? "text" : "password"} />
        <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label="Mostrar senha">
          {showPassword ? <EyeOff size={21} /> : <Eye size={21} />}
        </button>
      </div>
    </label>
  );
}

function SelectLike({ label, placeholder }) {
  return (
    <label className="field-block">
      <span>{label}</span>
      <button className="select-like" type="button">
        {placeholder}
        <ChevronDown size={21} />
      </button>
    </label>
  );
}

function ChoiceGroup({ label, children, compact = false }) {
  return (
    <fieldset className={compact ? "choice-group compact" : "choice-group"}>
      <legend>{label}</legend>
      <div>{children}</div>
    </fieldset>
  );
}

function ChoiceCard({ active, icon: Icon, label, onClick }) {
  return (
    <button className={active ? "choice-card active" : "choice-card"} type="button" onClick={onClick}>
      <Icon size={28} />
      <span>{label}</span>
    </button>
  );
}

function PageTitle({ title, subtitle }) {
  return (
    <header className="page-title">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}

function StatusPill({ status }) {
  return <strong className={status === "Ativa" ? "status active" : "status closed"}>{status}</strong>;
}

function AppLogo({ variant, size = "regular" }) {
  return (
    <div className={`app-logo ${variant} ${size}`}>
      <span className="logo-mark">
        <UsersRound size={size === "small" ? 25 : 31} strokeWidth={3.4} />
      </span>
      <span className="logo-text">App <b>BiT</b></span>
    </div>
  );
}

function AccessibilityButton() {
  return (
    <button className="accessibility-button" aria-label="Acessibilidade" type="button">
      <span>D</span>
    </button>
  );
}

createRoot(document.getElementById("root")).render(<App />);
