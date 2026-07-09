import { Candidate } from "../entities/Candidate.js";

export type JobInput = {
  titulo: string;
  skills: string[];
  nivel: string;
  regiao: string;
  modalidade: string;
};

export type MatchFilters = {
  anti_vies: boolean;
  diversidade_minima: number;
};

export type ScoredCandidate = {
  candidate: Candidate;
  score_match: number;
};

const LEVEL_ORDER = ["estagio", "junior", "pleno", "senior"];

function normalize(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function scoreSkills(jobSkills: string[], candidateSkills: string[]): number {
  if (jobSkills.length === 0) {
    return 0;
  }

  const normalizedCandidateSkills = new Set(candidateSkills.map(normalize));
  const matchedSkills = jobSkills.filter((skill) =>
    normalizedCandidateSkills.has(normalize(skill)),
  );

  return matchedSkills.length / jobSkills.length;
}

function scoreLevel(jobLevel: string, candidateLevel: string): number {
  const jobIndex = LEVEL_ORDER.indexOf(normalize(jobLevel));
  const candidateIndex = LEVEL_ORDER.indexOf(normalize(candidateLevel));

  if (jobIndex === -1 || candidateIndex === -1) {
    return 0;
  }

  const distance = Math.abs(jobIndex - candidateIndex);

  if (distance === 0) {
    return 1;
  }

  if (distance === 1) {
    return 0.65;
  }

  return 0.25;
}

function scoreRegion(jobRegion: string, candidateRegion: string, jobWorkModel: string): number {
  const normalizedWorkModel = normalize(jobWorkModel);

  if (normalizedWorkModel === "remoto") {
    return 1;
  }

  const normalizedJobRegion = normalize(jobRegion);
  const normalizedCandidateRegion = normalize(candidateRegion);

  if (normalizedJobRegion === normalizedCandidateRegion) {
    return 1;
  }

  if (
    normalizedJobRegion.includes(normalizedCandidateRegion) ||
    normalizedCandidateRegion.includes(normalizedJobRegion)
  ) {
    return 0.8;
  }

  return normalizedWorkModel === "hibrido" ? 0.55 : 0.25;
}

function scoreWorkModel(jobWorkModel: string, candidateWorkModel: string): number {
  const job = normalize(jobWorkModel);
  const candidate = normalize(candidateWorkModel);

  if (job === candidate) {
    return 1;
  }

  if (job === "hibrido" && (candidate === "remoto" || candidate === "presencial")) {
    return 0.7;
  }

  if (job === "remoto" && candidate === "hibrido") {
    return 0.8;
  }

  if (job === "presencial" && candidate === "hibrido") {
    return 0.8;
  }

  return 0.35;
}

function scoreTerritory(candidate: Candidate): number {
  const connectivity = normalize(candidate.connectivity);

  if (connectivity.includes("5g")) {
    return 1;
  }

  if (connectivity.includes("4g")) {
    return 0.85;
  }

  if (connectivity.includes("3g")) {
    return 0.65;
  }

  return 0.5;
}

export function scoreCandidate(candidate: Candidate, job: JobInput): number {
  const score =
    scoreSkills(job.skills, candidate.skills) * 50 +
    scoreLevel(job.nivel, candidate.level) * 15 +
    scoreRegion(job.regiao, candidate.region, job.modalidade) * 15 +
    scoreWorkModel(job.modalidade, candidate.work_model) * 10 +
    scoreTerritory(candidate) * 10;

  return Math.round(score);
}

export function buildShortlist(
  candidates: Candidate[],
  job: JobInput,
  filters: MatchFilters,
): ScoredCandidate[] {
  const minimumTechnicalScore = filters.anti_vies ? 45 : 0;
  const scoredCandidates = candidates
    .map((candidate) => ({
      candidate,
      score_match: scoreCandidate(candidate, job),
    }))
    .filter((item) => item.score_match >= minimumTechnicalScore)
    .sort((a, b) => b.score_match - a.score_match);

  return scoredCandidates.slice(0, 10);
}

export function calculateDiversityPercentage(shortlist: ScoredCandidate[]): number {
  if (shortlist.length === 0) {
    return 0;
  }

  const underrepresentedCount = shortlist.filter(
    ({ candidate }) => candidate.is_underrepresented || Boolean(candidate.diversity_badge),
  ).length;

  return Math.round((underrepresentedCount / shortlist.length) * 100);
}

export function buildLocalInsight(
  shortlist: ScoredCandidate[],
  diversityPercentage: number,
  minimumDiversity: number,
): string {
  const hasLowConnectivity = shortlist.some(({ candidate }) =>
    normalize(candidate.connectivity).includes("3g"),
  );
  const meetsDiversityGoal = diversityPercentage >= minimumDiversity;

  const diversityMessage = meetsDiversityGoal
    ? `A shortlist atende a meta minima de diversidade (${diversityPercentage}% de representatividade).`
    : `A shortlist ainda nao atende a meta minima de diversidade (${diversityPercentage}% frente a ${minimumDiversity}%). Considere ampliar a modalidade ou a regiao da vaga.`;
  const connectivityMessage = hasLowConnectivity
    ? "Ha talentos qualificados em regioes com conectividade limitada; para vagas remotas ou hibridas, considere apoio com internet ou equipamento."
    : "A amostra nao indica barreiras criticas de conectividade para os candidatos ranqueados.";

  return `${diversityMessage} A ordenacao prioriza aderencia tecnica, nivel, regiao e modalidade sem usar diversidade como bonus individual. ${connectivityMessage}`;
}
