# Theme

Single source of truth for FAINEANT design tokens. Consumed by web (`apps/web/tailwind.config.ts`), mobile (`apps/mobile/src/theme`), and any non-Tailwind renderer (emails, PDFs, charts).

## Files

| File | Exports | Notes |
|---|---|---|
| `palette.ts` | `palette` | smoke / taupe / champagne / bone / oxblood scales |
| `type.ts` | `fontFamily`, `fontWeight`, `fontSize` | 4 families; custom display + editorial scale |
| `motion.ts` | `easing`, `duration` | `easing.smooth` is the house curve |
| `radius.ts` | `radius` | Sharp by design — default is `0.125rem` |
| `spacing.ts` | `spacing`, `spacingExtensions` | `spacing` is named (native); `spacingExtensions` is web-only additions |
| `breakpoints.ts` | `breakpoints` | Mirrors Tailwind defaults so non-web has a source |
| `semantic.ts` | `semantic` | Role-based aliases (`surface.canvas`, `text.muted`) — prefer over raw palette in components when role is meaningful |

## Adding a token

1. Add it to the appropriate file here.
2. `pnpm --filter @faineant/shared build`.
3. **Web:** the value flows through `apps/web/tailwind.config.ts`, which imports from `@faineant/shared`. No duplication.
4. **Mobile:** add it to `apps/mobile/src/theme/index.ts` if needed at the RN layer.
5. **CSS vars in `apps/web/src/styles/globals.css`** are the runtime source for shadcn-style utilities (`bg-background`, etc.) — update those by hand if you've changed a semantic role.

## Rules

- Components must not hardcode hex values. Use Tailwind classes (web) or `colors.*` from `@/theme` (mobile).
- Don't add a third theme mode. Dark is canonical; `.light` is opt-in.
- Don't add new utility classes to `globals.css`. Extend Tailwind's theme instead.
- Keep `semantic.ts` and the CSS vars in `globals.css` in sync.
