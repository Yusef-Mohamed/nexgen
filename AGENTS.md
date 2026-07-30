# NexGen Website Agent Guide

This guide extends the workspace `AGENTS.md` for `Website/`.

## Platform

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, next-intl, React Query, and Socket.IO client.
- Main routes live under `src/app/[locale]/`; preserve English/Arabic routing and RTL behavior.
- The development server uses port 3330.

## Conventions

- Treat existing authenticated pages and backend contracts as the behavioral reference for Mobile.
- Reuse the website design system, global tokens, cards, fields, dialogs, and navigation patterns.
- Prefer server components by default; add `"use client"` only when browser state or interaction requires it.
- Keep locale-aware links and middleware behavior intact.
- Do not add static production fallback data to hide API failures.
- Website-to-app prompts must be dismissible, localized, accessible, and use allowlisted verified destinations. Never place a session token in an app link.

## Validation

From `Website/` run:

- `npm run lint`
- `npm run build`
- Relevant `node --test` files when changing existing `*.test.mjs` coverage

Do not expose or commit environment secrets. Preserve unrelated work on the long-lived `development` branch.
