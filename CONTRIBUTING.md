# Contributing to RewindVerse

Thank you for your interest in contributing to RewindVerse! We welcome contributions to our algorithm library, visualization components, replay engine, Python SDK, documentation, and research tools.

---

## 1. Code of Conduct

We are committed to providing a welcoming, inclusive, and professional environment for all contributors. Treat everyone with respect and focus on constructive collaboration.

---

## 2. Monorepo Architecture

RewindVerse uses a `pnpm` workspace monorepo:

- `apps/web`: Next.js 15 App Router web application and Rewind Studio.
- `packages/rvts`: RewindVerse Training Trace Specification schemas and validators.
- `packages/rewindml`: Deterministic in-browser ML simulation and optimization routines.
- `packages/replay-engine`: Timeline scrubber indexing and state interpolation.
- `packages/diagnostics`: Heuristic anomaly detection and explainability engines.
- `sdk/python`: Python recording package (`rewindverse-trace`) and CLI tools.
- `docs/`: Technical specifications, architectural decision records, and manuals.

---

## 3. Development Workflow

### Prerequisites
- Node.js >= 20.x
- pnpm >= 10.x
- Python >= 3.10

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/parth022002/RewindVerse.git
cd RewindVerse

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Running Tests
Before submitting a pull request, ensure all quality gates pass:
```bash
# Typecheck across all workspace packages
pnpm typecheck

# TypeScript unit tests (Vitest)
pnpm test

# Python SDK tests
pnpm test:python

# Production build verification
pnpm --filter @rewindverse/web build
```

---

## 4. Coding Standards

- **TypeScript:** Strict mode enabled. No arbitrary `any` types. Validate external inputs with Zod.
- **Components:** Typed props, accessible ARIA roles, responsive styling via Tailwind CSS semantic variables.
- **Algorithm Implementations:** Must be accompanied by mathematical reference documentation and unit tests verifying numerical convergence.
- **Security:** Zero runtime `eval()`. Use AST sandboxing in Algorithm Forge. Never commit secrets or API keys.

