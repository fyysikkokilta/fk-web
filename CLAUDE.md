# CLAUDE.md

This file provides guidance for Claude Code when working in the fk-web repository (Guild of Physics website).

## Commands

```bash
pnpm dev              # Start dev server
pnpm build            # Production build
pnpm lint             # ESLint (flat config)
pnpm type:check       # TypeScript check (tsc --noEmit)
pnpm typegen          # Generate Next.js types
pnpm generate:types   # Generate Payload types → payload-types.ts
pnpm generate:importmap  # Generate Payload import map
pnpm generate:migration  # Create new migration (--skip-empty)
pnpm migrate          # Run pending migrations
```

After changing Payload collections/globals/blocks, run `pnpm generate:types` and `pnpm generate:importmap` — CI checks that these are in sync.

## Tech Stack

- **Next.js 16** (App Router, canary) with `output: 'standalone'` and React Compiler enabled
- **Payload CMS 3** — headless CMS with admin panel at `/admin`
- **React 19** with server components
- **PostgreSQL** via `@payloadcms/db-postgres`
- **Tailwind CSS v4** — CSS-first config (no `tailwind.config.*`), configured in `globals.css`
- **next-intl** for i18n routing and translations
- **Zod v4** for validation
- **pnpm 10** (enforced via `preinstall` script), Node >= 24, ESM (`"type": "module"`)

## Project Structure

```
src/
  app/
    (frontend)/           # Public-facing site
      [locale]/           # Locale-based routing (fi, en)
        [...slug]/page.tsx  # Catch-all for CMS pages
      api/draft/          # Enter draft mode
      api/exit-draft/     # Exit draft mode
    (payload)/            # Payload admin — excluded from ESLint
  blocks/                 # Each block: config.ts + Component.tsx
  collections/            # Payload collection configs
  globals/                # Payload global configs
  components/
  i18n/                   # Routing, navigation, request config
  hooks/                  # Payload hooks (revalidation etc.)
  access/                 # Access control helpers
  utils/
  env.ts                  # Environment validation (t3-oss/env-nextjs)
  payload.config.ts
messages/                 # Translation JSON files (fi.json, en.json)
```

## Key Conventions

### Formatting & Linting

- Prettier: single quotes, no semicolons, no trailing commas, 100 char width, LF line endings
- ESLint with `eslint-plugin-simple-import-sort` — import/export order is enforced as errors
- Pre-commit hook runs lint-staged (ESLint + tsc)

### Restricted Imports (ESLint errors)

**Never import directly from `next/link` or navigation functions from `next/navigation`.**

Use `@/i18n/routing` instead, which re-exports `Link`, `redirect`, `permanentRedirect`, `useRouter`, and `usePathname` from `next-intl/navigation` with locale-aware routing:

```typescript
// WRONG
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// CORRECT
import { Link, useRouter } from '@/i18n/navigation'
```

The routing module (`src/i18n/routing.ts`) and navigation module (`src/i18n/navigation.ts`) wrap `next-intl`.

### No Raw Strings in JSX

`react/jsx-no-literals` is set to error. All user-visible text must use `next-intl` translations (`useTranslations` / `getTranslations`). Translation files are in `messages/fi.json` and `messages/en.json`.

### Path Alias

`@/*` maps to `./src/*`. Use this for all imports.

### Auto-generated Files

These files are generated and must stay in sync — **do not hand-edit**:
- `src/payload-types.ts` (from `pnpm generate:types`)
- Payload import map (from `pnpm generate:importmap`)
- Migration files in `src/migrations/` (from `pnpm generate:migration`)

## Blocks Pattern

Blocks are Payload CMS content blocks used inside the Lexical rich text editor. Each block lives in `src/blocks/<BlockName>/`:

- `config.ts` — exports a `Block` config (e.g., `export const CalendarBlock: Block = { slug: 'calendar', ... }`)
- `Component.tsx` — React component that renders the block on the frontend

Blocks are registered in the Lexical editor config and rendered via JSX converters in `src/components/RichText/index.tsx`.

Existing blocks: Board, Calendar, Card, Collapsible, Committee, CustomHTML, EmbedVideo, Form, FuksiYear, Icon (inline), Newsletter, OfficialYear, PageNavigation, PDFViewer, TwoColumns.

## i18n

- Locales: `fi` (default), `en`
- Frontend routes are under `[locale]/` — locale is resolved via `next/root-params` (experimental `rootParams` feature)
- Payload CMS also uses `fi`/`en` localization with fallback enabled
- Page paths are localized and unique per locale

## Environment Variables

Validated via `@t3-oss/env-nextjs` in `src/env.ts`. Always import as `import { env } from '@/env'` — never use `process.env` directly. Validation is skipped in CI (`IS_CI=true`).

## Revalidation

The `revalidateCollection` hook in `src/hooks/revalidateCollection.ts` wraps `revalidatePath` calls inside `after()` from `next/server`. This avoids the "revalidation during render" error. Non-page collections revalidate using the filesystem route path `/(frontend)/[locale]` with type `'layout'`.

## Draft Mode

Draft mode uses an API-based flow:
- `/api/draft?slug=...` enters draft mode
- `/api/exit-draft` exits draft mode
- Use `isDraftMode()` from `src/utils/draftMode.ts` in page components
- `DraftModeBanner` shows UI when in draft mode; `RefreshRouteOnSave` handles live preview refresh
- Pages have autosave (200ms interval) and scheduled publishing

## Theme

Custom colors are defined as `fk-*` tokens in `globals.css` `@theme` (e.g., `fk-yellow`, `fk-orange`, `fk-blue`, etc.). Fonts: **Lora** (headings, weight 700) and **Source Sans 3** (body, weights 400/700).
