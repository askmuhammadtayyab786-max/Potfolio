# Web Application Security Documentation

**Project:** `<YOUR PROJECT NAME>`  
**Owner:** `<OWNER>`  
**Reviewer:** `<REVIEWER>`  
**Last Updated:** `<DATE>`  
**Issue Tracker Project:** `<e.g. JIRA PROJECT KEY>`  

---

## About This Folder

This folder is a **universal, reusable security documentation template** for any web-based system.
It covers every common layer — frontend, backend, database, AI/LLM, infrastructure, user accounts,
audit logs, and file storage — using the **OWASP STRIDE** threat model.

Drop it into any project. Fill in the placeholders. Mark items ✅ as you fix them.

---

## System Architecture

Fill in your actual stack below:

| Zone | Components |
|------|-----------|
| Internet | End users (e.g. customers, staff, admins) |
| DMZ | Load balancer (e.g. HAProxy, AWS ALB), reverse proxy (e.g. Nginx, Caddy) |
| App | Frontend (e.g. React, Vue, Next.js), Backend API (e.g. Node.js, Django, FastAPI) |
| Data | Database (e.g. PostgreSQL, MySQL, MongoDB), File/Object Storage, Audit Logs |
| External | AI/LLM API (e.g. OpenAI, Anthropic, self-hosted), Third-party services |

---

## Documentation Index

| File | What it covers |
|------|---------------|
| [frontend/security.md](frontend/security.md) | SPA / web UI threats: XSS, token storage, clickjacking, access control |
| [backend/security.md](backend/security.md) | API threats: auth, IDOR, RBAC, injection, file upload, rate limiting |
| [database/security.md](database/security.md) | Database credentials, backups, audit, encryption, least-privilege |
| [ai-llm/security.md](ai-llm/security.md) | AI / LLM threats: prompt injection, excessive agency, data leakage |
| [infra/security.md](infra/security.md) | Load balancer, reverse proxy, TLS, DDoS, security headers |
| [user-access/security.md](user-access/security.md) | Account security, MFA, session management, role definitions |
| [audit-logs/security.md](audit-logs/security.md) | Log integrity, completeness, PII masking, retention |
| [file-storage/security.md](file-storage/security.md) | File / object storage access control, tamper protection |
| [threat-summary.md](threat-summary.md) | Full STRIDE threat register with status and ticket links |

---

## Threat Severity Totals

Update this table as you run your threat model:

| Severity | Count |
|----------|-------|
| Critical | `_` |
| High | `_` |
| Medium | `_` |
| Low | `_` |
| **Total** | **`_`** |

---

## STRIDE Quick Reference

| Letter | Category | Question to ask |
|--------|----------|----------------|
| **S** | Spoofing | Can someone pretend to be another user or service? |
| **T** | Tampering | Can someone modify data in transit or at rest? |
| **R** | Repudiation | Can someone deny performing an action? |
| **I** | Info Disclosure | Can someone read data they shouldn't? |
| **D** | Denial of Service | Can someone make the system unavailable? |
| **E** | Elevation of Privilege | Can someone gain more access than they should have? |

---

## How to Use This Template

1. **Copy** this folder into your project repository.
2. **Fill in** all `<PLACEHOLDER>` fields with your actual project details.
3. **Run a threat model** (OWASP Threat Dragon recommended) and record new threats in [threat-summary.md](threat-summary.md).
4. Each layer file lists: **Threat → Ticket → Mitigation → Checklist item**.
5. **Link** each checklist item to your issue tracker ticket (e.g. PROJ-42).
6. **Mark** checklist items ✅ when the corresponding ticket reaches Done.
7. **Re-run** the threat model after any major architecture change.
