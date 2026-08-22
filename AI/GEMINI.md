# AI Resources Maintenance Mandates

This directory contains the custom AI agents, skills, and assets for the AI-assisted development workflow.

## Specialized Guidance
**When modifying or adding to this directory:**
- Follow the structure defined in `AI/skills/frontend-skill/SKILL.md`.
- Use the `skill-creator` skill for creating or updating new development skills.
- Use `AI/agents/sa.md` and `AI/agents/sd.md` as reference for creating new agent personas.

### 1. Agents Maintenance (`AI/agents/`)
- **Persona Consistency:** Maintain the same level of detail and persona-driven instructions across all agents.
- **Output Standards:** Ensure all agents specify their required output language (e.g., Traditional Chinese/Taiwan) and format (Markdown).
- **Traceability:** Maintain the requirement -> use case -> test case traceability principles in all analysis/design documents.

### 2. Skills Maintenance (`AI/skills/`)
- **Modularity:** Keep skills modular and focused on specific domains (e.g., `frontend-skill`).
- **Assets & References:** Organize reusable code templates in `assets/` and detailed guides in `references/`.
- **Validation:** Always verify the structure of a skill using the `verify-structure.py` script (if available).

### 3. Assets & Templates (`AI/skills/frontend-skill/assets/`)
- **Component Templates:** Keep templates up-to-date with the latest Angular and PrimeNG versions.
- **Base Container:** Ensure the `base-container.ts` template reflects the current core logic.

## References
- `AI/skills/frontend-skill/SKILL.md`: Root skill definition.
- `AI/agents/sa.md`: System Analyst persona definition.
- `AI/agents/sd.md`: System Designer persona definition.
- `AI/agents/security-auditor.md`: Security Auditor persona definition.
- `AI/agents/debugger.md`: Debugger and bug investigator persona definition.
- `AI/agents/verifier.md`: Verification and test case generator persona definition.
- `AI/agents/test-runner.md`: Test execution and runner persona definition.
