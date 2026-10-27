export const profile = {
  name: "Harish Pal",
  role: "Backend & AI Systems Engineer",
  tagline:
    "I build the backend systems, retrieval pipelines, and data-intensive infrastructure that hold up under real traffic — not just in a demo.",
  location: "India",
  email: "harishpal0501@gmail.com",
  links: {
    github: "https://github.com/harish05-q",
    linkedin: "https://www.linkedin.com/in/YOUR-HANDLE", // TODO: replace with your LinkedIn profile URL
    leetcode: "https://leetcode.com/u/harish_60/",
    ssrn: "https://papers.ssrn.com/", // TODO: replace with the direct URL of your SSRN paper
  },
  resumeUrl: "/resume.pdf",
};

export const stats = [
  { value: "700+", label: "DSA problems solved on LeetCode" },
  { value: "1850+", label: "LeetCode contest rating" },
  { value: "Top 10", label: "of 120+ teams, HackO'Clock national hackathon" },
  { value: "1", label: "research paper published on SSRN" },
];

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  problem: string;
  approach: string[];
  stack: string[];
  links?: { label: string; href: string }[];
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "rai",
    name: "R.AI",
    tagline:
      "Autonomous revenue recovery agent: LLM diagnosis, deterministic policy, human approval.",
    problem:
      "Failed payments quietly leak revenue. An LLM is good at diagnosing why one failed, but the actual recovery action has to be governed by deterministic, auditable, idempotent policy, not by a model's mood.",
    approach: [
      "Built an agentic payment-recovery platform for 10K+ transactions: LLM-driven diagnosis and recommendations, deterministic policy enforcement, human approval, idempotent execution and provider-backed recovery workflows.",
      "Designed an AI-vs-baseline evaluation framework and an outcome-observation pipeline that separates recommended, executed, observed and recovered states, so recovery performance is quantified instead of assumed.",
      "Implemented semantic indexing and retrieval with Qdrant for low-latency search across large collections of financial documents.",
      "Shipped a full-stack Revenue Intelligence dashboard (analytics, recovery lifecycle tracking, audit trails, approval workflows, deterministic demo/evaluation modes) with 66/66 backend tests passing plus frontend lint, type-check and production build validation.",
    ],
    stack: [
      "Python",
      "FastAPI",
      "Next.js",
      "TypeScript",
      "Docker",
      "PostgreSQL",
      "Qdrant",
      "Razorpay APIs",
    ],
    links: [{ label: "Source", href: "https://github.com/harish05-q" }], // TODO: point at the R.AI repo
    featured: true,
  },
  {
    slug: "pinsight",
    name: "PInSight",
    tagline:
      "Payment incident analysis platform with automated root-cause reasoning.",
    problem:
      "When a payment transaction fails, the evidence is scattered across logs, operational events, and past incident records — reconstructing what actually happened is slow, manual work.",
    approach: [
      "Built scalable REST APIs and retrieval pipelines to index and query historical incidents, runbooks, and transaction records using PostgreSQL + pgvector.",
      "Implemented automated root-cause analysis workflows that classify payment failures, detect integration issues, and generate resolution recommendations.",
      "Developed interactive dashboards for transaction tracing, incident timelines, semantic search, and operational analytics.",
    ],
    stack: [
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Sentence-Transformers",
      "Next.js",
      "Docker",
    ],
    featured: true,
  },
  {
    slug: "codeautopsy",
    name: "CodeAutopsy",
    tagline:
      "Reverse-engineers a GitHub repository into architecture, graphs, and searchable code insight.",
    problem:
      "Ramping up on an unfamiliar codebase means hours of manual exploration before you understand what actually depends on what, or whether it's safe to change.",
    approach: [
      "Designed a multi-stage pipeline combining AST parsing, graph construction, semantic indexing, and architecture inference for large codebases.",
      "Combined deterministic static analysis with LLM-assisted reasoning to generate module summaries, flag architectural anti-patterns, and surface bug-prone components.",
      "Built an interactive React Flow dashboard visualizing repository structure, dependency graphs, and intermediate analysis artifacts.",
    ],
    stack: [
      "FastAPI",
      "Tree-sitter",
      "NetworkX",
      "FAISS",
      "Sentence-Transformers",
      "Next.js",
      "React Flow",
    ],
    links: [
      { label: "Live demo", href: "https://code-autopsy-nine.vercel.app" },
      { label: "Source", href: "https://github.com/harish05-q/CodeAutopsy" },
    ],
    featured: true,
  },
  {
    slug: "marketiq",
    name: "MarketIQ",
    tagline:
      "Real-time market intelligence platform built on semantic search over financial news.",
    problem:
      "Financial signal is buried in a constant stream of unstructured news from dozens of sources — turning that noise into something searchable, in real time, is the actual product.",
    approach: [
      "Designed a real-time ingestion pipeline aggregating financial news from multiple sources into structured, searchable data.",
      "Built backend services in FastAPI to process, index, and serve market intelligence via scalable REST APIs.",
      "Implemented low-latency semantic indexing and retrieval with Qdrant across large collections of financial documents.",
    ],
    stack: [
      "Python",
      "FastAPI",
      "Qdrant",
      "LangChain",
      "Next.js",
      "Tailwind CSS",
    ],
    featured: true,
  },
  {
    slug: "qgen-ai",
    name: "QGen-AI",
    tagline:
      "Natural-language-to-SQL: ask a question in English, get back a validated, safely-executed query.",
    problem:
      "Non-technical stakeholders (and even engineers on unfamiliar schemas) shouldn't need to hand-write SQL just to answer a question about the data.",
    approach: [
      "Built schema-aware prompt construction that feeds the exact table/column/relationship structure to Groq's llama-3.3-70b-versatile for accurate query generation.",
      "Implemented multi-layered safety: hard-enforced read-only DB connections, regex pre-gating against destructive statements (DROP/DELETE/UPDATE) and injection patterns, and auto-appended LIMIT clauses.",
      "Added auto-correction retries — if the model's query fails validation, the error is fed back and the model self-corrects before execution — plus conversational memory for follow-up questions.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "better-sqlite3",
      "Groq API",
    ],
    links: [
      { label: "Live demo", href: "https://qgen-ai.onrender.com" },
      { label: "Source", href: "https://github.com/harish05-q/QGen-AI" },
    ],
    featured: true,
  },
  {
    slug: "eduswap",
    name: "EduSwap",
    tagline:
      "Credit-based marketplace where students upload and download educational resources.",
    problem:
      "Study materials scattered across group chats and drives are hard to find and there's no incentive to share good ones.",
    approach: [
      "Built authentication (Google + phone) with Clerk and a Postgres backend on Supabase with row-level security.",
      "Designed a credit economy — earn credits by uploading approved resources, spend them to download others' — with real-time balance updates via Supabase Realtime.",
      "Built an admin dashboard for approving uploads and awarding credits.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Clerk",
      "Tailwind CSS",
      "shadcn/ui",
    ],
    links: [{ label: "Source", href: "https://github.com/harish05-q/EduSwap" }],
    featured: false,
  },
  {
    slug: "stock-lstm",
    name: "Stock Price Prediction (LSTM)",
    tagline:
      "LSTM neural network for forecasting stock closing prices, end to end in a notebook.",
    problem:
      "A hands-on exploration of applying recurrent neural networks to time-series financial data.",
    approach: [
      "Preprocessed and windowed historical price data for sequence modeling.",
      "Built and trained an LSTM network in TensorFlow/Keras with a train/validation split.",
      "Visualized predicted vs. actual prices to evaluate model behavior.",
    ],
    stack: ["Python", "TensorFlow/Keras", "Pandas", "yfinance"],
    links: [
      {
        label: "Source",
        href: "https://github.com/harish05-q/Stock-price-prediction-LSTM",
      },
    ],
    featured: false,
  },
];

export const skills = [
  {
    group: "Languages",
    items: ["C++", "Java", "Python", "JavaScript", "TypeScript"],
  },
  {
    group: "Core CS",
    items: [
      "Data Structures & Algorithms",
      "OOP",
      "Operating Systems",
      "DBMS",
      "Computer Networks",
      "System Design",
    ],
  },
  {
    group: "Backend",
    items: [
      "FastAPI",
      "Node.js",
      "Express.js",
      "REST API Design",
      "Authentication",
      "Concurrency",
    ],
  },
  {
    group: "Frontend",
    items: ["React.js", "Next.js", "Tailwind CSS"],
  },
  {
    group: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB"],
  },
  {
    group: "AI & Data",
    items: [
      "RAG",
      "LangChain",
      "Agentic Systems",
      "n8n",
      "Embeddings",
      "Semantic Retrieval",
      "FAISS",
      "Qdrant",
    ],
  },
  {
    group: "Infrastructure",
    items: ["Docker", "Linux", "Git/GitHub", "AWS"],
  },
];

export const experience = [
  {
    role: "Python Developer",
    org: "LetsGrowMore",
    period: "Jul 2024 — Aug 2024",
    points: [
      "Developed Python automation scripts using Pandas to process datasets and improve internal data workflows.",
      "Implemented data validation and logging mechanisms for reliable processing and easier debugging.",
      "Assisted in building backend utilities with Python/Django, supporting API development and data handling.",
    ],
  },
];

export const education = {
  degree: "B.Tech, Computer Science & Engineering (AI)",
  school: "Noida Institute of Engineering & Technology",
  period: "2023 — Present",
  detail: "CGPA 9.02",
};

export const achievements = [
  "700+ DSA problems solved on LeetCode, contest rating 1850+",
  "Top 10 finalist among 120+ teams at HackO'Clock national hackathon",
  'Published research on SSRN: "Predicting Growth-Induced Financial Collapse of SMEs Using Structural Cash-Flow Stress Modeling"',
];

export const bio = `I'm a Computer Science & AI student who ended up specializing in the unglamorous part of software that actually matters most: the backend. I like systems that trace, retrieve, and reason over real data — root-cause analysis over payment failures, dependency graphs over unfamiliar codebases, semantic search over financial signal. Most of what I build sits at the intersection of solid backend engineering and applied AI: FastAPI services, retrieval pipelines, and the infrastructure that keeps them honest under load.`;
