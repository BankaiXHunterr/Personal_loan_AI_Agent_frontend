# Aspen Loan — frontend
Next.js (App Router) + TypeScript. Plain CSS via app/globals.css (CSS-variable
design system, classes namespaced under .aspen). Icons: lucide-react.

## Rules
- Match the design in AspenLoanApplication.jsx exactly; never redesign.
- No localStorage/sessionStorage. State via useState only.
- No secrets in frontend code. Backend URL via NEXT_PUBLIC_BACKEND_URL.
- Keep CSS class names identical to the reference.

## Commands
- Dev: `npm run dev`  | Build: `npm run build`  | Lint: `npm run lint`
- After changes: run `npm run build` and fix all type/lint errors.
