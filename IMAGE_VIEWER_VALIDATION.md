# Zoomable images

Chat attachments, post feed images, focused post images, comments and nested replies use an accessible image dialog. It supports touch pinch, drag, double-click/tap, mouse-wheel zoom, zoom/reset buttons, keyboard opening and Escape. Post galleries retain all images. Chat images use the existing authorized blob download; changing the attachment or session hides stale blobs and aborts the old request.

Validated locally against the isolated development API on 14 October 2026:

- Chat, post, comment and reply: zoom buttons, double-click, pan, wheel and Escape pass in Chromium.
- Keyboard image opening and touch pinch pass. Arabic/RTL screenshots inspected.
- Zoom geometry and comment media tests: 7 pass.
- Typecheck, targeted lint and production build pass. The full lint run has 80 existing warnings.

The Website implementation is kept on `development`; this request authorizes only the Mobile production release.
