# Audit Results — Tayyab Latif Portfolio

**Date:** 2026-11-01 · **Stack:** Next.js 16.4.3 (App Router), 2 API routes (`/api/contact`, `/api/chat`), no database, no auth, no uploads.

## Applicable threats

| ID | Threat | Status | Evidence |
|----|--------|--------|----------|
| F-1 | XSS | ✅ | No `dangerouslySetInnerHTML`; chat input `<img onerror>` rendered as plain text (0 injected nodes); CSP set; contact email HTML-escaped |
| F-2 | Token in localStorage | ✅ | No auth; localStorage, sessionStorage and cookies all empty |
| F-3 | Clickjacking | ✅ | `X-Frame-Options: DENY` + `frame-ancestors 'none'`; iframe blocked in browser |
| F-4 | Secrets in bundle | ✅ | No `NEXT_PUBLIC_*` secrets; `.next/static` scanned, no key names; `.env.local` git-ignored |
| F-6 | Supply chain | ⚠️ | Next critical CVEs fixed (16.3.3 → 16.4.3). Remaining 2 moderate advisories are inside the `shadcn` CLI (build-time CSS import only, not shipped) |
| F-7 | Open redirect | ✅ | No redirect parameters |
| B-5 | Injection | ✅ | No DB/shell; JSON bodies parsed and field-limited |
| B-6 | Mass assignment | ✅ | Only `name`, `email`, `message`, `company`, `page` are read |
| B-8 | Rate limiting / DoS | ✅ | Contact 3 per 10 min, chat 12 per min per IP (429 verified); body size caps (400 verified) |
| B-9 | Verbose errors | ✅ | Generic messages; details only in server logs |
| B-12 | SSRF | ✅ | Only fixed OpenRouter URL is fetched |
| AI-1 | Prompt injection | ✅ (low impact) | Chat has no tools, no private data, no write actions; system prompt holds only public info |
| AI-8 | Cost abuse | ⚠️ | Per-IP limit + 2000-char / 20-turn caps. Set a hard spend limit in the OpenRouter dashboard |
| I-4 | Security headers | ✅ | CSP, XFO, nosniff, HSTS, Referrer-Policy, Permissions-Policy, COOP verified with curl |
| I-5 | Version disclosure | ✅ | `X-Powered-By` removed |
| I-7 | Dotfiles exposed | ✅ | `/.env`, `/.env.local`, `/.git/config`, `/package.json`, `/app/page.tsx` all 404 |
| CSRF / abuse | Cross-site POST | ✅ | Cross-origin `Origin` rejected with 403 |
| Mail abuse | Header injection / relay | ✅ | Control chars and `<>"` stripped from name; rate-limited auto-reply |

Not applicable: database, file storage, user-access, audit-logs (no such components).

## Known limits
- Rate-limit counters are per server instance (serverless instances don't share memory). Add Vercel Firewall rate limiting for a hard guarantee.
- CSP keeps `'unsafe-inline'` for scripts because Next.js needs it without per-request nonces.
- Contact valid-send path (real Gmail delivery) was deliberately not exercised to avoid sending real email.
