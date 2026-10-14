# Cursor chat development

The timeline uses the shared pure `src/lib/chat-timeline-core.ts` (kept identical to Mobile), a five-conversation memory cache, a 200-message contiguous visible section plus a separate latest 40, and ten-minute inactive expiry. Requests default to 20 messages. Old and latest sections remain separate across missing history. `react-window` renders measured, memoized rows with a stable message/offset anchor. Notification jumps hold the target through initial row measurement until the reader scrolls. Latest clears the target and uses one direct latest request, or an already validated latest cache.

REST writes are authoritative. Chat-change events coalesce for 100 ms and reconcile retained versions rather than all pages. Reconnection and safety/account changes invalidate or clear cached access. Cumulative read receipts advance only at the verified live bottom. Notification acknowledgment does not block target navigation.

The Latest badge appears after roughly 20 messages are below the visible viewport, or immediately when viewing a section with unloaded newer history. Small scrolls near the latest message keep it hidden. The display threshold does not change auto-follow or the exact live-bottom check for read receipts.

The 2026-10-14 Android investigation also found a shared cache issue: reopening the same notification after scrolling far enough to evict its target could reuse the remaining section. Cache reuse now requires the target to still be retained; otherwise it makes one around-target request. The dedicated regression covers eviction and reopening. Website validation: 10 chat tests, lint (0 errors, 80 existing warnings), and build passed.

Development: https://development.nexgen-academy.com. Full deployment, fixture commands, measurements, and remaining device checks are in the sibling Backend repository's `docs/DEVELOPMENT_CHAT.md`. Development-only browser timing requires `NEXT_PUBLIC_CHAT_TIMING=true`; inspect `document.documentElement.dataset.chatDiagnostics` for sanitized timing/request records. Passwords and tokens are never included.

Validate with `npm run lint`, `npm run build`, and the repository's relevant `*.test.mjs` tests. Existing Website locale/contact changes were separately preserved in `df233fe` before chat implementation.
