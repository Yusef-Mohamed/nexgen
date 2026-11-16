# Error monitoring

Branch: `feat/sentry-monitoring`; organization `yousef-qk`; project `nexgen-website`.

Set the public variables from `.env.monitoring.example` **before building**. Use environment `production` for the real site and `preview` for staging; set `NEXT_PUBLIC_SENTRY_RELEASE=nexgen-website@<commit>`. Reporting is opt-in. This branch has not been deployed.

Set `SENTRY_AUTH_TOKEN` only in the build host's secret environment to upload source maps. Never use a `NEXT_PUBLIC_` prefix or commit the value. Source-map upload is disabled when that token is absent; a successful local build does not prove readable production source maps. The org/project are configured in `next.config.ts`, retaining next-intl and the existing Webpack build. Uploaded maps are removed from generated client artifacts.

Browser, server and edge initialization are separate. Next.js `onRequestError`, the global React boundary and React Query's final query/mutation failure callbacks report errors. Expected API 4xx and ordinary offline/cancellation failures are ignored. Backend failures with a valid `X-Error-Id` are owned by Backend rather than duplicated. Gateway failures without that header remain reportable. Manually caught failures outside these boundaries must call `reportUnexpected` with a fixed operation label; do not pass response bodies, query keys, tokens or personal data.

The outbound policy keeps stack locations and allowlisted technical metadata, drops raw exception messages and request/user/context payloads, and limits repeated handled events. No tracing, profiling, replay, screenshot capture or console forwarding is enabled. Breadcrumbs are disabled for the initial privacy/performance baseline. Error counts are sampled by the repeat limiter, so they are not an exact total of affected users.

Validation: `npm run lint`, `npm run build`, `node --test tests/monitoring.test.mjs`. The current dependency graph requires `npm install --legacy-peer-deps` because the existing emoji package declares React <=18 while this application uses React 19.

Optional explicit server-ingestion test: `node --env-file=.env.monitoring.example scripts/sentry-smoke.cjs`. It sends one synthetic event under `monitoring-test`. This is not a substitute for a deployed browser-render error, a Server Component error and source-map verification. Before production rollout, verify those paths, confirm expected validation sends nothing, test with Sentry unreachable, and compare bundle size/LCP/INP against the baseline.

The free quota is shared with Backend and Mobile. Use production-only email alerts with cooldowns, review usage after rollout, and keep pay-as-you-go disabled. Native/mobile setup is maintained in the Mobile repository.

Verified on 2026-10-29: production build, TypeScript, lint (0 errors; existing warnings), and all four monitoring policy tests passed. The server smoke event is visible as `NEXGEN-WEBSITE-1`. The email alert covers new issues, regressions and high-priority transitions with `environment equals production` and a one-hour cooldown per issue.

The approved `nexgen-monitoring-builds` organization token (`org:ci`) is stored in ignored `.env.sentry-monitoring.local`. Use `npm run build:monitoring` for local builds with that token; set the public configuration first. On the deployment host, store the token as secret `SENTRY_AUTH_TOKEN` and use the normal build command. The older `.env.sentry-build-plugin` belongs to another organization and must not be reused. A token exposed during setup was revoked and replaced before any upload.

Source-map uploads for the verification build are visible in the Sentry project. The generated client assets were checked for credential leakage and contained no build token or remaining `.map` files. Runtime and build releases use the same `NEXT_PUBLIC_SENTRY_RELEASE`. A deployed browser error with resolved source locations remains a rollout check; an upload alone does not prove that path.
