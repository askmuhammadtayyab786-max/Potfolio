# Frontend Security

**Applies to:** Any SPA or server-rendered web UI (React, Vue, Angular, Next.js, Svelte, etc.)  
**Layer:** Presentation / Client  

---

## Key Principle

> The frontend is **untrusted client code**.  
> Every security decision must be enforced on the backend API.  
> Hiding a button or a route in the UI is UX, not security.

---

## Threats & Mitigations

### F-1 · Cross-Site Scripting (XSS)
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering / Info Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A malicious script injected into the page runs in a user's browser, stealing their session token or performing actions on their behalf. |
| **Mitigation** | Never use `dangerouslySetInnerHTML` (React) or `v-html` (Vue) with user-supplied data. Sanitize all dynamic HTML with **DOMPurify**. Enforce a strict **Content-Security-Policy (CSP)** header. |

---

### F-2 · Auth Token Stored in localStorage / sessionStorage
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Any XSS vulnerability can read a JWT or session token stored in `localStorage`, leading to full account takeover. |
| **Mitigation** | Store all auth tokens in **HttpOnly, Secure, SameSite=Strict cookies** only. Never store secrets in `localStorage` or `sessionStorage`. |

---

### F-3 · Clickjacking
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | The app is loaded in a hidden `<iframe>` on an attacker-controlled page. Users are tricked into clicking UI elements that perform unintended actions. |
| **Mitigation** | Set `X-Frame-Options: DENY` on all responses, or `Content-Security-Policy: frame-ancestors 'none'`. |

---

### F-4 · Secrets / API Keys in Frontend Bundle
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | API keys, internal endpoint URLs, or environment secrets are visible to anyone who inspects the compiled JS bundle. |
| **Mitigation** | No secrets in frontend source code or public environment variables (e.g. `VITE_*`, `NEXT_PUBLIC_*`, `REACT_APP_*`). All secrets stay on the backend. Run **Gitleaks** in CI to prevent accidental commits. |

---

### F-5 · Client-Side-Only Access Control
| Field | Detail |
|-------|--------|
| **STRIDE** | Elevation of Privilege |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Hiding admin-only UI elements does not stop a user from calling those API routes directly with `curl` or browser DevTools. |
| **Mitigation** | Enforce all permissions on the **backend API** (RBAC/ABAC middleware on every route). Frontend UI hiding is for UX only. |

---

### F-6 · Third-Party Script Supply-Chain Attack
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A compromised CDN or npm package injects malicious code into your frontend that runs for all users. |
| **Mitigation** | Use **Subresource Integrity (SRI)** on CDN scripts. Pin dependency versions. Run **Snyk** or `npm audit` in CI. Prefer self-hosting critical scripts. |

---

### F-7 · Open Redirect
| Field | Detail |
|-------|--------|
| **STRIDE** | Spoofing |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A login or redirect flow that follows a user-supplied URL can be abused to redirect users to a phishing site after login. |
| **Mitigation** | Validate redirect targets against an allowlist of your own domains. Never redirect to an arbitrary URL from a `?next=` or `?redirect=` parameter. |

---

## Checklist

- [ ] No `dangerouslySetInnerHTML` / `v-html` with unsanitized input — DOMPurify in place
- [ ] Auth tokens stored in HttpOnly cookies only — not in `localStorage`
- [ ] `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'` confirmed
- [ ] No API keys or secrets in frontend env variables or source code
- [ ] Gitleaks / secret scanning running in CI
- [ ] Backend RBAC enforced on every protected route (see [backend/security.md](../backend/security.md))
- [ ] SRI hashes added to all CDN script tags
- [ ] Redirect targets validated against an allowlist

---

## Tools

| Purpose | Tool |
|---------|------|
| XSS sanitization | [DOMPurify](https://github.com/cure53/DOMPurify) |
| Secret scanning | [Gitleaks](https://github.com/gitleaks/gitleaks) |
| Dependency scanning | [Snyk](https://snyk.io/) / `npm audit` |
| DAST / XSS fuzzing | [OWASP ZAP](https://www.zaproxy.org/) |
| Linting security rules | [ESLint security plugin](https://github.com/eslint-community/eslint-plugin-security) |
| CSP generator | [CSP Evaluator](https://csp-evaluator.withgoogle.com/) |
