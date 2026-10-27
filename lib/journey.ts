import { projects, profile, education, experience, type Project } from "./data";

/* ───────── Frames (the layers a request passes through) ───────── */

export type FrameId =
  | "client"
  | "edge"
  | "service"
  | "agent"
  | "vector"
  | "analysis"
  | "incident"
  | "response";

export type FrameMeta = {
  id: FrameId;
  layer: string;
  route: string;
  /** fake span duration in ms, used by the trace waterfall */
  dur: number;
};

export const frames: FrameMeta[] = [
  { id: "client", layer: "Client", route: "GET /harish-pal", dur: 12 },
  { id: "edge", layer: "Edge", route: "GET /about", dur: 26 },
  { id: "service", layer: "Service layer", route: "GET /skills", dur: 56 },
  { id: "agent", layer: "Agent", route: "POST /recover", dur: 27 },
  { id: "vector", layer: "Vector store", route: "POST /search", dur: 66 },
  { id: "analysis", layer: "Static analysis", route: "POST /analyze", dur: 53 },
  { id: "incident", layer: "Incident log", route: "GET /incidents", dur: 28 },
  { id: "response", layer: "Response", route: "200 OK", dur: 12 },
];

export const totalMs = frames.reduce((sum, f) => sum + f.dur, 0);

export function startOf(index: number) {
  return frames.slice(0, index).reduce((sum, f) => sum + f.dur, 0);
}

export function endOf(index: number) {
  return startOf(index) + frames[index].dur;
}

/* ───────── Lightweight project search (runs in the browser) ───────── */

const keywords: Record<string, string> = {
  rai: "payments recovery revenue agent agentic llm razorpay fintech approval idempotent evaluation baseline dashboard audit qdrant retrieval policy",
  pinsight:
    "payments incident root cause analysis failures logs runbooks observability pgvector postgres semantic search dashboard tracing",
  codeautopsy:
    "code codebase github repository architecture graph ast parsing dependency call graph static analysis tree-sitter react flow reverse engineering",
  marketiq:
    "market finance financial news real-time stream ingestion semantic search qdrant intelligence signal",
  "qgen-ai":
    "sql text-to-sql natural language database query llm groq safety read-only validation chat",
  eduswap:
    "marketplace students education resources credits auth clerk supabase realtime fullstack web app",
  "stock-lstm":
    "machine learning deep learning lstm neural network time series forecasting stock prediction tensorflow keras notebook",
};

const synonyms: Record<string, string[]> = {
  rag: ["retrieval", "semantic", "embeddings", "qdrant", "faiss", "search"],
  vector: ["semantic", "embeddings", "qdrant", "faiss", "pgvector", "search"],
  embeddings: ["semantic", "vector", "search"],
  search: ["semantic", "retrieval", "query"],
  ai: ["llm", "agent", "agentic", "machine"],
  ml: ["machine", "learning", "lstm", "neural"],
  agent: ["agentic", "llm", "policy"],
  payment: ["payments", "razorpay", "fintech"],
  fintech: ["payments", "finance", "financial"],
  graph: ["dependency", "networkx", "react", "architecture"],
  backend: ["fastapi", "api", "postgres", "services"],
  api: ["fastapi", "rest", "backend"],
  database: ["sql", "postgres", "pgvector", "supabase"],
  db: ["sql", "postgres", "database"],
  sql: ["database", "query", "text-to-sql"],
  frontend: ["next.js", "react", "dashboard", "tailwind"],
  web: ["next.js", "react", "fullstack"],
  hackathon: ["payments", "agentic"],
  finance: ["financial", "market", "payments"],
};

function tokenize(q: string) {
  return q
    .toLowerCase()
    .split(/[^a-z0-9.+\-]+/)
    .filter((t) => t.length > 1);
}

export type SearchHit = { project: Project; score: number };

/**
 * Toy retrieval: lexical match with a few synonyms, squashed into a 0..1
 * "similarity". Good enough to make the portfolio feel searchable; the real
 * embedding work lives in the projects it points at.
 */
export function searchProjects(query: string): SearchHit[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  const expanded = new Set<string>(tokens);
  for (const t of tokens) for (const s of synonyms[t] ?? []) expanded.add(s);

  const hits = projects.map((project) => {
    const name = project.name.toLowerCase();
    const stack = project.stack.join(" ").toLowerCase();
    const body = [
      project.tagline,
      project.problem,
      ...project.approach,
      keywords[project.slug] ?? "",
    ]
      .join(" ")
      .toLowerCase();

    let raw = 0;
    for (const t of expanded) {
      const weight = tokens.includes(t) ? 1 : 0.55; // direct words count more than synonyms
      if (name.includes(t)) raw += 3 * weight;
      if (stack.includes(t)) raw += 2 * weight;
      if (body.includes(t)) raw += 1 * weight;
    }
    return { project, score: raw === 0 ? 0 : 0.2 + 0.78 * (1 - Math.exp(-raw / 5)) };
  });

  return hits.sort((a, b) => b.score - a.score);
}

/** Small seeded PRNG so generated point clouds are stable between renders. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Where each project sits in the 2D "embedding space" (0..1 on both axes). */
export const embeddingLayout: Record<
  string,
  { x: number; y: number; color: string; label: string }
> = {
  rai: { x: 0.22, y: 0.28, color: "#c1592b", label: "R.AI" },
  pinsight: { x: 0.36, y: 0.5, color: "#c1592b", label: "PInSight" },
  marketiq: { x: 0.52, y: 0.2, color: "#c99a3e", label: "MarketIQ" },
  codeautopsy: { x: 0.78, y: 0.36, color: "#8fb38a", label: "CodeAutopsy" },
  "qgen-ai": { x: 0.56, y: 0.66, color: "#e0b98f", label: "QGen-AI" },
  eduswap: { x: 0.9, y: 0.84, color: "#9fb6c9", label: "EduSwap" },
  "stock-lstm": { x: 0.14, y: 0.82, color: "#c99a3e", label: "Stock LSTM" },
};

/* ───────── Incident log (career + wins, told as a timeline) ───────── */

export type LogLevel = "INFO" | "WIN" | "OPEN";
export type LogGroup = "path" | "wins";

export type LogEntry = {
  id: string;
  level: LogLevel;
  group: LogGroup;
  tag: string;
  when?: string;
  title: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
};

const intern = experience[0];

export const incidentLog: LogEntry[] = [
  {
    id: "edu",
    level: "INFO",
    group: "path",
    tag: "EDU",
    when: "2023 — now",
    title: `${education.degree}`,
    detail: `${education.school} · ${education.detail}. Core CS depth in data structures, operating systems, DBMS, computer networks and system design.`,
  },
  {
    id: "intern",
    level: "INFO",
    group: "path",
    tag: "WORK",
    when: "Jul — Aug 2024",
    title: `${intern.role} intern, ${intern.org}`,
    detail: intern.points.join(" "),
  },
  {
    id: "hack",
    level: "WIN",
    group: "wins",
    tag: "HACK",
    title: "Top 10 of 120+ teams at the HackO'Clock national hackathon",
    detail:
      "Finalist at a national hackathon: a build-under-pressure test of scoping, shipping and demoing.",
  },
  {
    id: "paper",
    level: "WIN",
    group: "wins",
    tag: "PAPER",
    title: "Published research on SSRN",
    detail:
      "“Predicting Growth-Induced Financial Collapse of SMEs Using Structural Cash-Flow Stress Modeling.”",
    href: profile.links.ssrn,
    hrefLabel: "Read the paper",
  },
  {
    id: "lc",
    level: "WIN",
    group: "wins",
    tag: "ALGO",
    title: "800+ DSA problems solved · LeetCode contest rating 1850+",
    detail:
      "Competitive problem solving keeps the fundamentals sharp: complexity, edge cases and clean invariants.",
    href: profile.links.leetcode,
    hrefLabel: "LeetCode profile",
  },
  {
    id: "open",
    level: "OPEN",
    group: "path",
    tag: "STATUS",
    title: "Seeking backend & AI engineering roles and internships",
    detail:
      "Suspected root cause of this incident: a team that needs someone who ships backend and applied-AI systems. Proposed resolution: a conversation.",
  },
];
