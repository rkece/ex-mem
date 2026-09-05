# Ninaivagam AI — External Memory Intelligence

> *"Your memory, beyond search."*

**Ninaivagam AI** is a premium, AI-powered externalized memory intelligence platform designed for engineers, system architects, and technical leaders. It functions as a proactive second memory layer that continuously understands your active context, surfaces relevant past decisions without being asked, detects when retrieved memory is incomplete, and reconstructs missing context across disparate sources.

Inspired by the refined editorial minimalism of [follow.art](https://follow.art) and [oryzo.ai](https://oryzo.ai), Ninaivagam AI prioritizes truth, provenance, and epistemic honesty over synthetic confabulation.

---

## ✦ Core Principles

- **Context-First, Not Search-First**: Your active file, task, topic, and collaborator signals automatically pull relevant historical constraints to the surface before you search.
- **Strict Epistemic Separation**: Every deduction is separated into **ANSWER**, **MEMORY TRAIL**, **EVIDENCE**, and **CONFIDENCE**. Generated text is never presented as fact without verifiable primary source excerpts.
- **Honest Gap Detection**: When a critical decision lacks recorded rationale or benchmark evidence, Ninaivagam AI explicitly reports **`MEMORY GAP DETECTED`**, runs a multi-source recovery checklist, and reports honestly rather than inventing reasons.
- **Contradiction Preservation**: Conflicting historical decisions (e.g. conflicting framework standards across team handovers) are presented side-by-side with separate confidence scores—**never artificially auto-resolved**.
- **Context Reconstruction**: Synthesizes causal chains across fragmented documents into an animated visual lineage: `[ What ] → [ When ] → [ Why ] → [ Who ] → [ How It Connects ]`.

---

## ✦ The Intelligence Pipeline

```
CURRENT CONTEXT
       │
       ▼
UNDERSTAND INTENT
       │
       ▼
PROACTIVELY SURFACE RELEVANT MEMORY
       │
       ▼
CHECK COMPLETENESS
       │
       ├──[ Rationale Missing ]──► DETECT GAP ──► RECOVERY SEARCH ──► HONEST REPORT
       │
       └──[ Valid Lineage ]──────► RECONSTRUCT CONTEXT ──► SHOW ANSWER + EVIDENCE
```

---

## ✦ Architecture & Views

1. **01 Overview**: Asymmetric two-column dashboard pairing the **Current Working Context** panel with the **Proactively Recalled** memory card. Includes an interactive task switcher simulation.
2. **02 Memories Repository**: Filterable card grid organized by type (`decision`, `discussion`, `requirement`, `action`, `change`, `result`, `event`) with deep provenance drawers.
3. **03 Timeline Spine**: Chronological spine with type-coded markers (Gold for decisions, Sage for requirements/actions, Rust for unverified gaps).
4. **04 Context Engine**: Live environmental signal monitor and custom context vector tuner.
5. **05 Insights**: Structural pattern statements and the side-by-side **Conflicting Memories State**.
6. **06 Sources**: Canonical document repository with extraction breakdowns and raw body inspector.
7. **Ask Ninaivagam (`⌘K`)**: Direct inquiry interface delivering structured answers, connected timeline nodes, and verified quotes.
8. **Memory Capture**: Multi-mode input (paste notes, specs, or transcripts) with a live 6-stage neural extraction pipeline.

---

## ✦ Design System

- **Palette**: Near-black base (`#0D0D0F`), surface (`#17171A`), raised surface (`#1E1E22`), hairline borders (`#2A2A2E`).
- **Accents**: Gold (`#C6A667`) for decisions & primary actions; Sage (`#7E9788`) for verified evidence & trust; Rust (`#B06B4A`) reserved strictly for gaps and conflicts.
- **Typography**: Editorial serif (**Fraunces**) reserved for the wordmark, editorial titles, and quoted memories; crisp sans (**Inter**) for UI controls and metadata.
- **Geometry**: Thin near-square corners (`2–4px`), hairline dividers, zero generic soft SaaS drop-shadows. Frosted glass blur is reserved exclusively for the visual Context Reconstruction state.

---

## ✦ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) with zero-config in-memory fallback for offline/instant evaluation

---

## ✦ Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/rkece/ex-mem.git
cd ex-mem
npm install
```

### 2. Environment Setup (Optional)

Create a `.env.local` file to connect your MongoDB Atlas cluster:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=ninaivagam
```

> *Note: If `MONGODB_URI` is omitted, Ninaivagam AI automatically uses its high-performance reactive in-memory store pre-seeded with sample architecture memory records.*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build

```bash
npm run build
npm run start
```

---

## ✦ License

MIT © [Ninaivagam AI](https://github.com/rkece/ex-mem)
