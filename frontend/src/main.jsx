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
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3003/api/v1";

const company = {
  nome: "Ambev S.A.",
  iniciais: "AM",
  setor: "Bebidas e consumo",
  regiao: "CBD_BEIRAMAR",
  metaDiversidade: 0.45,
};

const defaultCompany = {
  nome: "Ambev S.A.",
  iniciais: "AM",
  id: null,
  metaDiversidade: 0.45,
};

function parseSkills(value) {
  if (Array.isArray(value)) return value;
  return String(value ?? "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function formatDate(value) {
  if (!value) return "agora";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function initialsFromName(name) {
  return String(name ?? "??")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "??";
}

function normalizeLevel(level) {
  const value = String(level ?? "pleno").toLowerCase();
  const map = {
    estágio: "estagio",
    estagio: "estagio",
    júnior: "junior",
    junior: "junior",
    pleno: "pleno",
    sênior: "senior",
    senior: "senior",
  };
  return map[value] ?? value;
}

function normalizeWorkMode(mode) {
  const value = String(mode ?? "hibrido").toLowerCase();
  const map = {
    híbrido: "hibrido",
    hibrido: "hibrido",
    remoto: "remoto",
    presencial: "presencial",
  };
  return map[value] ?? value;
}

function normalizeJob(job) {
  const rawStatus = String(job.status ?? "Ativa").toLowerCase();
  const status = rawStatus === "aberta" || rawStatus === "open" || rawStatus === "ativa" ? "Ativa" : "Encerrada";

  return {
    id: job.id ?? job.vaga_id ?? job._id,
    titulo: job.titulo ?? job.title ?? "Vaga sem título",
    data: formatDate(job.created_at ?? job.createdAt ?? job.data_publicacao ?? job.data),
    status,
    nivel: normalizeLevel(job.nivel ?? job.level),
    skills: parseSkills(job.skills ?? job.skills_requeridas ?? job.requisitos),
    regiao: job.regiao ?? job.region ?? company.regiao,
    modalidade: normalizeWorkMode(job.modalidade ?? job.work_model ?? job.modalidade_trabalho),
    descricao: job.descricao ?? job.description ?? "",
    departamento: job.departamento ?? job.area ?? "",
  };
}

function normalizeJobsResponse(data) {
  const list = Array.isArray(data) ? data : data?.vagas ?? data?.jobs ?? data?.data ?? [];
  return list.map(normalizeJob);
}

function normalizeMatchResponse(data) {
  const candidates = data?.candidatos ?? data?.candidates ?? [];
  return {
    candidates: candidates.map((candidate) => ({
      id: candidate.candidato_id ?? candidate.id,
      initials: initialsFromName(candidate.nome ?? candidate.name),
      name: candidate.nome ?? candidate.name ?? "Candidato sem nome",
      score: Math.round(candidate.score_match ?? candidate.score ?? 0),
      badge: Boolean(candidate.badge_diversidade?.length ?? candidate.badge),
      tags: candidate.badge_diversidade?.length ? candidate.badge_diversidade : ["Sem autodeclaração informada"],
      role: candidate.titulo_profissional ?? candidate.role ?? candidate.nivel ?? "Perfil profissional",
      education: candidate.formacao ?? candidate.education ?? candidate.localizacao?.regiao ?? "Formação não informada",
      skills: parseSkills(candidate.skills),
    })),
    metrics: data?.metricas ?? data?.metrics ?? null,
    aiInsight: data?.ai_insight ?? data?.aiInsight ?? "Insight ainda não disponível para esta shortlist.",
  };
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message ?? `Erro HTTP ${response.status}`);
  }
  return data;
}

function App() {
  const [screen, setScreen] = useState("login");
  const [isAuthed, setIsAuthed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [companyProfile, setCompanyProfile] = useState(defaultCompany);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [matchResult, setMatchResult] = useState({ candidates: [], metrics: null, aiInsight: "" });
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const selectedJob = useMemo(
    () => jobs.find((job) => String(job.id) === String(selectedJobId)) ?? jobs[0] ?? null,
    [jobs, selectedJobId]
  );

  function navigate(nextScreen) {
    const target = steps.find((step) => step.id === nextScreen);
    if (!target) return;
    if (!target.public && !isAuthed) return;
    setError("");
    setScreen(nextScreen);
    if (nextScreen === "jobs") {
      loadJobs();
    }
  }

  async function loadJobs() {
    setLoading("jobs");
    setError("");
    try {
      const data = await apiRequest("/jobs");
      const nextJobs = normalizeJobsResponse(data);
      setJobs(nextJobs);
      if (!selectedJobId && nextJobs[0]) {
        setSelectedJobId(nextJobs[0].id);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  }

  function authenticate(data, nextScreen = "publish") {
    const user = data?.user ?? data?.empresa ?? data?.company;
    if (user) {
      const name = user.companyName ?? user.company_name ?? user.razao_social ?? user.nome_empresa ?? user.name ?? user.nome ?? defaultCompany.nome;
      setCompanyProfile({
        id: user.id ?? user.company_id ?? user.empresa_id ?? null,
        nome: name,
        iniciais: initialsFromName(name),
        metaDiversidade: user.diversity_goal ?? user.meta_diversidade ?? defaultCompany.metaDiversidade,
      });
    }
    setIsAuthed(true);
    setScreen(nextScreen);
  }

  async function handleLogin(credentials) {
    setLoading("auth");
    setError("");
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      authenticate(data, "jobs");
      await loadJobs();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  }

  async function handleSignup(payload) {
    setLoading("auth");
    setError("");
    try {
      const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      authenticate(data, "publish");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  }

  async function handleCreateJob(payload) {
    setLoading("create-job");
    setError("");
    try {
      const data = await apiRequest("/jobs", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const createdJob = normalizeJob(data?.vaga ?? data?.job ?? data);
      setJobs((currentJobs) => [createdJob, ...currentJobs.filter((job) => String(job.id) !== String(createdJob.id))]);
      setSelectedJobId(createdJob.id);
      setScreen("jobs");
      await loadJobs();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  }

  async function handleSelectJob(jobId) {
    const job = jobs.find((item) => String(item.id) === String(jobId));
    if (!job) return;
    setSelectedJobId(jobId);
    setScreen("results");
    setLoading("matches");
    setError("");
    setMatchResult({ candidates: [], metrics: null, aiInsight: "" });
    try {
      const data = job.id
        ? await apiRequest(`/jobs/${job.id}/matches`, { method: "POST" })
        : await apiRequest("/match", {
            method: "POST",
            body: JSON.stringify({
              empresa_id: companyProfile.id ?? companyProfile.nome,
              vaga: {
                titulo: job.titulo,
                skills: job.skills,
                nivel: job.nivel,
                regiao: job.regiao,
                modalidade: job.modalidade,
              },
              filtros: {
                anti_vies: true,
                diversidade_minima: Math.round((companyProfile.metaDiversidade ?? defaultCompany.metaDiversidade) * 100),
              },
            }),
          });
      setMatchResult(normalizeMatchResponse(data));
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  }

  return (
    <main className="page-shell">
      {screen === "login" && (
        <AuthLayout activeStep="login" isAuthed={isAuthed} onStepClick={navigate}>
          <LoginScreen
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onLogin={handleLogin}
            onSignup={() => navigate("signup")}
            loading={loading === "auth"}
            error={error}
          />
        </AuthLayout>
      )}

      {screen === "signup" && (
        <AuthLayout activeStep="signup" mode="signup" isAuthed={isAuthed} onStepClick={navigate}>
          <SignupScreen
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            onCreate={handleSignup}
            onLogin={() => navigate("login")}
            loading={loading === "auth"}
            error={error}
          />
        </AuthLayout>
      )}

      {screen === "publish" && (
        <DashboardLayout activeStep="publish" isAuthed={isAuthed} onStepClick={navigate} companyProfile={companyProfile}>
          <PublishJobScreen
            onPublish={handleCreateJob}
            loading={loading === "create-job"}
            error={error}
            companyProfile={companyProfile}
          />
        </DashboardLayout>
      )}

      {screen === "jobs" && (
        <DashboardLayout activeStep="jobs" isAuthed={isAuthed} onStepClick={navigate} companyProfile={companyProfile}>
          <JobsScreen
            jobs={jobs}
            onSelectJob={handleSelectJob}
            loading={loading === "jobs"}
            error={error}
            onRetry={loadJobs}
          />
        </DashboardLayout>
      )}

      {screen === "results" && (
        <DashboardLayout activeStep="results" isAuthed={isAuthed} onStepClick={navigate} companyProfile={companyProfile} compact>
          <ResultsScreen
            job={selectedJob}
            candidates={matchResult.candidates}
            metrics={matchResult.metrics}
            aiInsight={matchResult.aiInsight}
            loading={loading === "matches"}
            error={error}
            onBack={() => navigate("jobs")}
          />
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

function LoginScreen({ showPassword, setShowPassword, onLogin, onSignup, loading, error }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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
          onLogin(form);
        }}
      >
        <Field
          label="E-mail corporativo"
          placeholder="nome@empresa.com.br"
          type="email"
          value={form.email}
          onChange={(value) => setForm((current) => ({ ...current, email: value }))}
          required
        />
        <PasswordField
          label="Senha"
          placeholder="••••••••"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          value={form.password}
          onChange={(value) => setForm((current) => ({ ...current, password: value }))}
          required
        />
        <a className="forgot-link" href="#recuperar-senha">Esqueci minha senha</a>
        {error && <p className="form-message error">{error}</p>}
        <button className="primary-button" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>

      <p className="switch-copy">
        Não tem conta? <button type="button" onClick={onSignup}>Cadastre sua empresa</button>
      </p>
    </div>
  );
}

function SignupScreen({ showPassword, setShowPassword, onCreate, onLogin, loading, error }) {
  const [form, setForm] = useState({
    companyName: "",
    sector: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

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
          if (form.password !== form.confirmPassword) return;
          onCreate({
          company_name: form.companyName,
          name: form.companyName,
          segment: form.sector,
          sector: form.sector,
          email: form.email,
          password: form.password,
          });
        }}
      >
        <Field label="Nome da empresa" placeholder="Ex: Tech Solutions Ltda." value={form.companyName} onChange={(value) => updateField("companyName", value)} required />
        <Field label="Setor / segmento" placeholder="Ex: Tecnologia" value={form.sector} onChange={(value) => updateField("sector", value)} required />
        <Field label="E-mail corporativo" placeholder="rh@empresa.com.br" type="email" value={form.email} onChange={(value) => updateField("email", value)} required />
        <PasswordField
          label="Senha"
          placeholder="Mínimo 8 caracteres"
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          value={form.password}
          onChange={(value) => updateField("password", value)}
          required
        />
        <Field label="Confirmar senha" placeholder="••••••••" type="password" value={form.confirmPassword} onChange={(value) => updateField("confirmPassword", value)} required />

        <label className="terms-row">
          <input type="checkbox" checked={form.acceptedTerms} onChange={(event) => updateField("acceptedTerms", event.target.checked)} required />
          <span>Concordo com os <a href="#termos">Termos de Uso</a> e a <a href="#privacidade">Política de Privacidade</a></span>
        </label>

        {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
          <p className="form-message error">As senhas precisam ser iguais.</p>
        )}
        {error && <p className="form-message error">{error}</p>}
        <button className="primary-button" type="submit" disabled={loading || form.password !== form.confirmPassword}>
          {loading ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="switch-copy">
        Já tem conta? <button type="button" onClick={onLogin}>Fazer login</button>
      </p>
    </div>
  );
}

function DashboardLayout({ children, activeStep, isAuthed, onStepClick, companyProfile, compact = false }) {
  const currentCompany = companyProfile ?? defaultCompany;

  return (
    <section className={`dashboard-stage ${compact ? "compact" : ""}`}>
      <AccessibilityButton />
      <header className="app-header">
        <AppLogo variant="dark" size="small" />
        <div className="company-chip">
          <strong>{currentCompany.nome}</strong>
          <span>{currentCompany.iniciais}</span>
        </div>
      </header>
      <div className="dashboard-body">{children}</div>
      <StepNav activeStep={activeStep} isAuthed={isAuthed} onStepClick={onStepClick} />
    </section>
  );
}

function PublishJobScreen({ onPublish, loading, error, companyProfile }) {
  const [workMode, setWorkMode] = useState("Híbrido");
  const [level, setLevel] = useState("Pleno");
  const [form, setForm] = useState({
    titulo: "",
    departamento: "",
    skills: "",
    regiao: company.regiao,
    descricao: "",
  });

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="publish-page content-narrow">
      <PageTitle title="Nova vaga" subtitle="Preencha os detalhes e encontre novos talentos para a sua equipe" />

      <form
        className="job-form-card"
        onSubmit={(event) => {
          event.preventDefault();
          onPublish({
            company_id: companyProfile.id,
            empresa_id: companyProfile.id,
            titulo: form.titulo,
            departamento: form.departamento,
            area: form.departamento,
            skills: parseSkills(form.skills),
            nivel: normalizeLevel(level),
            regiao: form.regiao,
            modalidade: normalizeWorkMode(workMode),
            diversidade_minima: Math.round((companyProfile.metaDiversidade ?? defaultCompany.metaDiversidade) * 100),
            descricao: form.descricao,
            status: "Ativa",
          });
        }}
      >
        <Field label="Título da vaga" placeholder="Ex: Analista de Dados Sênior" value={form.titulo} onChange={(value) => updateField("titulo", value)} required />
        <Field label="Área / departamento" placeholder="Ex: Tecnologia, Marketing, RH..." value={form.departamento} onChange={(value) => updateField("departamento", value)} required />
        <Field label="Skills principais" placeholder="Ex: Python, SQL, Spark" value={form.skills} onChange={(value) => updateField("skills", value)} required />
        <Field label="Região" placeholder="Ex: CBD_BEIRAMAR" value={form.regiao} onChange={(value) => updateField("regiao", value)} required />

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
          <textarea
            placeholder="Descreva responsabilidades, requisitos e diferenciais..."
            value={form.descricao}
            onChange={(event) => updateField("descricao", event.target.value)}
            required
          />
        </label>

        {error && <p className="form-message error">{error}</p>}
        <button className="primary-button publish-button" type="submit" disabled={loading}>
          {loading ? "Publicando..." : "Publicar vaga"}
        </button>
      </form>
    </div>
  );
}

function JobsScreen({ jobs: jobList, onSelectJob, loading, error, onRetry }) {
  return (
    <div className="jobs-page content-narrow">
      <PageTitle title="Vagas publicadas" subtitle="Clique em uma vaga para ver os perfis recomendados" />
      {loading && <p className="state-message">Carregando vagas publicadas...</p>}
      {error && (
        <div className="state-message error">
          <span>{error}</span>
          <button type="button" onClick={onRetry}>Tentar novamente</button>
        </div>
      )}
      {!loading && !error && jobList.length === 0 && (
        <p className="state-message">Nenhuma vaga publicada ainda.</p>
      )}
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

function ResultsScreen({ job, candidates: candidateList, metrics, aiInsight, loading, error, onBack }) {
  const totalCandidates = candidateList.length;
  const highScoreCandidates = candidateList.filter((candidate) => candidate.score > 80).length;
  const diversityPercentage = metrics?.diversidade_resultado?.percentual_diversidade;

  if (!job) {
    return (
      <div className="results-page content-narrow">
        <button className="back-button" type="button" onClick={onBack}>
          <ArrowLeft size={18} />
          Voltar
        </button>
        <p className="state-message error">Selecione uma vaga antes de gerar o matching.</p>
      </div>
    );
  }

  return (
    <div className="results-page content-narrow">
      <button className="back-button" type="button" onClick={onBack}>
        <ArrowLeft size={18} />
        Voltar
      </button>
      <span className="process-label">PROCESSO #2024-{job.id} · {job.titulo.toUpperCase()}</span>

      <div className="results-heading">
        <h1>Perfis recomendados</h1>
        <span className="found-pill">{totalCandidates} candidatos encontrados</span>
      </div>

      <div className="filter-row">
        <div className="segmented">
          <button className="active" type="button">Todos ({totalCandidates})</button>
          <button type="button">Score &gt; 80% ({highScoreCandidates})</button>
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
        {loading && <p>Gerando shortlist e métricas de diversidade...</p>}
        {error && <p className="form-message error">{error}</p>}
        {!loading && !error && (
          <>
            <p>{aiInsight}</p>
            {typeof diversityPercentage === "number" && (
              <p><b>Diversidade da shortlist:</b> {diversityPercentage}%</p>
            )}
          </>
        )}
        <footer>Fonte: motor de matching do backend · Critérios: skills, senioridade, região, modalidade e contexto territorial</footer>
      </article>

      <div className="candidate-divider"><span>LISTA DE CANDIDATOS</span></div>

      <div className="candidate-list">
        {!loading && !error && candidateList.length === 0 && (
          <p className="state-message">Nenhum candidato retornado para esta vaga.</p>
        )}
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

function Field({ label, placeholder, type = "text", value, onChange, required = false }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="field-block" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
      />
    </label>
  );
}

function PasswordField({ label, placeholder, showPassword, setShowPassword, value, onChange, required = false }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <label className="field-block" htmlFor={id}>
      <span>{label}</span>
      <div className="password-field">
        <input
          id={id}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          required={required}
        />
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
