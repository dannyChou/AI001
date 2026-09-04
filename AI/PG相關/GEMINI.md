# AI001 Project Mandates

This workspace is a comprehensive AI-driven development environment for an e-check bank frontend application. It includes specialized AI agents and skills to ensure high-quality development, analysis, and verification.

## Project Structure
- `echeck-bank-frontend/`: The main Angular 21 + PrimeNG application.
- `AI/`: Contains AI specialized resources.
  - `agents/`: Custom AI personas for different roles (SA, SD, Security, etc.).
  - `skills/`: Reusable development workflows and instructions.

## Core Mandates

### 1. AI-First Development
- **Activate Skills:** When working in specific areas, always check for and activate relevant skills in `AI/skills/`.
- **Agent Personas:** Refer to `AI/agents/` to understand the specialized roles available for collaboration.
- **Traceability:** Follow the SA principles in `AI/agents/sa.md` for requirements and use case documentation.

### 2. Technical Standards
- **Framework:** Angular 21 with PrimeNG.
- **Styling:** Use PrimeFlex and PrimeNG components. Avoid TailwindCSS unless explicitly requested.
- **Architecture:** Follow the pattern defined in `AI/skills/frontend-skill/SKILL.md`.
- **Naming:** Follow the directory-aligned routing and namespace-based API model patterns.

### 3. Security & Integrity
- **Protection:** Never commit secrets or API keys.
- **Verification:** Always run `npm test` or relevant verification scripts before finalizing changes.
- **Audit:** Use `AI/agents/security-auditor.md` for critical security reviews.

## Specialized Instructions
- For frontend tasks, see `echeck-bank-frontend/GEMINI.md`.
- For AI resource maintenance, see `AI/GEMINI.md`.
