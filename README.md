# Shiatsu Spa Kuwait — Website & Admin Dashboard

Production website + admin dashboard for Shiatsu Spa Kuwait.
Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Firebase.

> **Status:** Sprint 1 (Project Foundation) complete. No pages, UI, or
> components have been built yet — see the architecture doc for the
> full roadmap.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values — see below
npm run dev
```

Open http://localhost:3000.

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

1. **Firebase client config** — Firebase Console → Project Settings →
   General → "Your apps" → Web app.
2. **Firebase Admin SDK** — Firebase Console → Project Settings →
   Service Accounts → "Generate new private key". Copy `project_id`,
   `client_email`, and `private_key` from the downloaded JSON.
3. **REVALIDATE_SECRET** — generate your own: `openssl rand -hex 32`.
4. Analytics/Pixel IDs are optional and can be left blank for now.

`.env.local` is git-ignored — never commit real credentials.

## Firebase project setup

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # select/create the Firebase project, alias it "default"
firebase deploy --only firestore:rules,storage:rules
```

Two Firebase projects are recommended per the approved architecture:
one for staging, one for production — switch between them with
`firebase use <alias>`.

## Available scripts

| Command                | Purpose                          |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the local dev server       |
| `npm run build`        | Production build                 |
| `npm run start`        | Run the production build locally |
| `npm run lint`         | ESLint                           |
| `npm run typecheck`    | TypeScript, no emit              |
| `npm run format`       | Prettier — write                 |
| `npm run format:check` | Prettier — check only            |

Every commit runs `lint-staged` (ESLint + Prettier on staged files)
automatically via Husky's pre-commit hook.

## Project structure

See `ARCHITECTURE.md` (or the architecture document already shared
with the client) for the full folder structure, Firestore schema, and
route map. In short:

- `app/` — routes only (thin, composes features)
- `features/` — one folder per domain (services, categories, branches,
  gallery, faq, testimonials, settings, auth) — types, Firestore
  access, hooks, and components for that domain live together
- `components/` — cross-feature generic building blocks only
  (`ui/`, `layout/`, `shared/`, `admin/`)
- `lib/` — Firebase client/admin, utils, constants
- `i18n/` — next-intl config + message files (en/ar)

## Notes / known gaps to resolve before go-live

- `GE SS Two` (the Arabic brand typeface) isn't publicly distributable
  — `app/globals.css` currently points `--font-arabic` at a fallback
  and will need the client's licensed font file swapped in.
- `app/favicon.ico` is still the Next.js default — replace with the
  brand's actual favicon once exported from the identity assets.
- `--brand-cream` in the theme is a derived off-white, not one of the
  four official brand swatches — confirm with the client or replace.
