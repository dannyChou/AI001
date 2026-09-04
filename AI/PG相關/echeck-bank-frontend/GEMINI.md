# echeck-bank-frontend Project Mandates

This is the main Angular 21 + PrimeNG frontend for the e-check bank application. It follows a highly structured, AI-assisted development workflow.

## Specialized Guidance
**ALWAYS activate the frontend-skill when working in this directory:**
`activate_skill frontend-skill`

### 1. Architectural Alignment
- **Root Directory:** `D:/Github/AI001/echeck-bank-frontend/`
- **Core App Logic:** `src/app/`
- **API Models & Services:** `src/api-library/`
- **Reusable UI:** `src/app/components/share/`, `src/app/components/block/`, `src/app/components/layout/`
- **Feature Views:** `src/app/views/` (following the directory-aligned routing pattern)

### 2. Development Workflow
- **Reproduce First:** Before fixing any frontend bug, create a reproduction case using Vitest (`npm test`).
- **Base Container:** All feature components MUST extend the `BaseContainer` utility in `src/app/utils/base-container.ts` (or similar).
- **API Models:** Define all API request/response models using the TypeScript namespace pattern in `src/api-library/lib/model/`.
- **Forms:** Use reactive forms for all input-driven features.

### 3. Styling & UI
- **Components:** Strictly use PrimeNG components (`p-input`, `p-table`, etc.).
- **Layout:** Use PrimeFlex for responsive design and spacing.
- **Scoping:** Use SCSS for styling, keeping component-specific styles in their respective `.scss` files.

### 4. Verification
- **Testing:** Use Vitest for unit and integration testing.
- **Linting:** Ensure all changes pass Prettier and ESLint (if configured).
- **Build:** Always run `npm run build` to confirm no build-time errors before finalizing work.

## References
- `AI/skills/frontend-skill/SKILL.md`: Detailed architecture and patterns.
- `AI/skills/frontend-skill/references/primeng-components.md`: UI component usage.
- `AI/skills/frontend-skill/references/api-integration.md`: API service patterns.
