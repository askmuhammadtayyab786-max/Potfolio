# Threat Summary — Full STRIDE Register

**Project:** `<YOUR PROJECT NAME>`  
**Last Threat Model Run:** `<DATE>`  
**Tool:** [OWASP Threat Dragon](https://owasp.org/www-project-threat-dragon/) (recommended)  
**Issue Tracker:** `<PROJ>` on `<Jira / GitHub Issues / Linear / etc.>`  

---

## How to Use This Table

1. Run a threat modelling session (OWASP Threat Dragon, whiteboard, or structured brainstorm).
2. Add each threat you find as a row below.
3. Create a ticket for each threat and paste the ticket key in the **Ticket** column.
4. Update **Status** as work progresses: `Open → In Progress → Done`.
5. Mark the row ✅ when the ticket reaches Done and the control is verified.
6. Re-run the threat model after any major architecture change.

---

## Threat Register

> **Add one row per threat.** Copy the template row and fill in the fields.  
> Severity: Critical / High / Medium / Low  
> STRIDE: S (Spoofing) · T (Tampering) · R (Repudiation) · I (Info Disclosure) · D (DoS) · E (Elevation of Privilege)

### Frontend

| # | Title | STRIDE | Severity | Ticket | Status | Notes |
|---|-------|--------|----------|--------|--------|-------|
| F-1 | Cross-site scripting (XSS) | T | High | `<PROJ-?>` | Open | |
| F-2 | Auth token stored in localStorage | I | High | `<PROJ-?>` | Open | |
| F-3 | Clickjacking | T | Medium | `<PROJ-?>` | Open | |
| F-4 | Secrets / API keys in frontend bundle | I | High | `<PROJ-?>` | Open | |
| F-5 | Client-side-only access control | E | High | `<PROJ-?>` | Open | |
| F-6 | Third-party script supply-chain attack | T | High | `<PROJ-?>` | Open | |
| F-7 | Open redirect | S | Medium | `<PROJ-?>` | Open | |

### Backend / API

| # | Title | STRIDE | Severity | Ticket | Status | Notes |
|---|-------|--------|----------|--------|--------|-------|
| B-1 | Auth token forgery / weak secret | S | Critical | `<PROJ-?>` | Open | |
| B-2 | Brute-force / credential stuffing | S | High | `<PROJ-?>` | Open | |
| B-3 | IDOR — insecure direct object reference | I | Critical | `<PROJ-?>` | Open | |
| B-4 | Broken access control / role escalation | E | Critical | `<PROJ-?>` | Open | |
| B-5 | SQL / NoSQL / command injection | T | Critical | `<PROJ-?>` | Open | |
| B-6 | Mass assignment | E | High | `<PROJ-?>` | Open | |
| B-7 | Malicious file upload | E | High | `<PROJ-?>` | Open | |
| B-8 | API rate limiting / DoS | D | Medium | `<PROJ-?>` | Open | |
| B-9 | Verbose error messages | I | Medium | `<PROJ-?>` | Open | |
| B-10 | No audit trail for sensitive actions | R | High | `<PROJ-?>` | Open | |
| B-11 | Vulnerable dependencies | T | High | `<PROJ-?>` | Open | |
| B-12 | Server-side request forgery (SSRF) | I/E | High | `<PROJ-?>` | Open | |

### AI / LLM

| # | Title | STRIDE | Severity | Ticket | Status | Notes |
|---|-------|--------|----------|--------|--------|-------|
| AI-1 | Direct prompt injection | E | Critical | `<PROJ-?>` | Open | |
| AI-2 | Indirect prompt injection | T | High | `<PROJ-?>` | Open | |
| AI-3 | Excessive agency / autonomous destructive actions | E | Critical | `<PROJ-?>` | Open | |
| AI-4 | Sensitive data sent to external LLM provider | I | Critical | `<PROJ-?>` | Open | |
| AI-5 | Sensitive data leaked in LLM responses | I | High | `<PROJ-?>` | Open | |
| AI-6 | Hallucinated or harmful output | T | High | `<PROJ-?>` | Open | |
| AI-7 | No audit trail for agent actions | R | High | `<PROJ-?>` | Open | |
| AI-8 | API cost abuse / agent flooding | D | Medium | `<PROJ-?>` | Open | |
| AI-9 | Fake / compromised LLM endpoint | S | Medium | `<PROJ-?>` | Open | |
| AI-10 | LLM provider outage | D | Low | `<PROJ-?>` | Open | |
| AI-11 | Training data poisoning | T | High | `<PROJ-?>` | Open | If fine-tuning |

### Database

| # | Title | STRIDE | Severity | Ticket | Status | Notes |
|---|-------|--------|----------|--------|--------|-------|
| D-1 | Database breach / exposed port | I | Critical | `<PROJ-?>` | Open | |
| D-2 | Hardcoded / leaked credentials | I | Critical | `<PROJ-?>` | Open | |
| D-3 | Superuser / over-privileged app account | T/E | High | `<PROJ-?>` | Open | |
| D-4 | Unencrypted backups | I | High | `<PROJ-?>` | Open | |
| D-5 | No database-level audit | R | Medium | `<PROJ-?>` | Open | |
| D-6 | Unencrypted DB connections | I | High | `<PROJ-?>` | Open | |
| D-7 | Resource exhaustion | D | Medium | `<PROJ-?>` | Open | |
| D-8 | Unencrypted sensitive columns | I | High | `<PROJ-?>` | Open | |

### File / Object Storage

| # | Title | STRIDE | Severity | Ticket | Status | Notes |
|---|-------|--------|----------|--------|--------|-------|
| FS-1 | Public / guessable file URLs | I | Critical | `<PROJ-?>` | Open | |
| FS-2 | Malicious file upload (RCE / stored XSS) | E/T | Critical | `<PROJ-?>` | Open | |
| FS-3 | File content tampering | T | High | `<PROJ-?>` | Open | |
| FS-4 | No access control on file downloads | I | High | `<PROJ-?>` | Open | |
| FS-5 | Storage exhaustion | D | Medium | `<PROJ-?>` | Open | |
| FS-6 | No audit of file access | R | Medium | `<PROJ-?>` | Open | |
| FS-7 | Malware in uploaded files | T | High | `<PROJ-?>` | Open | |

### Infrastructure / Network

| # | Title | STRIDE | Severity | Ticket | Status | Notes |
|---|-------|--------|----------|--------|--------|-------|
| I-1 | DDoS / volumetric flood | D | High | `<PROJ-?>` | Open | |
| I-2 | Weak or outdated TLS | I | High | `<PROJ-?>` | Open | |
| I-3 | SSL / TLS private key compromise | S | Critical | `<PROJ-?>` | Open | |
| I-4 | Missing security headers | T/I | High | `<PROJ-?>` | Open | |
| I-5 | Server / version disclosure | I | Low | `<PROJ-?>` | Open | |
| I-6 | Directory listing enabled | I | Low | `<PROJ-?>` | Open | |
| I-7 | Dotfiles / config files exposed | I | Critical | `<PROJ-?>` | Open | |
| I-8 | Backend port directly accessible | S/E | High | `<PROJ-?>` | Open | |
| I-9 | Reverse proxy running as root | E | High | `<PROJ-?>` | Open | |
| I-10 | Header / request smuggling | T | Medium | `<PROJ-?>` | Open | |

### User Access & Accounts

| # | Title | STRIDE | Severity | Ticket | Status | Notes |
|---|-------|--------|----------|--------|--------|-------|
| U-1 | Account takeover via weak password | S | High | `<PROJ-?>` | Open | |
| U-2 | Admin account takeover | S | Critical | `<PROJ-?>` | Open | |
| U-3 | Shared / generic accounts | R/S | High | `<PROJ-?>` | Open | |
| U-4 | No MFA / weak second factor | S | High | `<PROJ-?>` | Open | |
| U-5 | No session expiry / session fixation | S/I | Medium | `<PROJ-?>` | Open | |
| U-6 | Permissive role assignment | E | High | `<PROJ-?>` | Open | |
| U-7 | No audit of account / permission changes | R | High | `<PROJ-?>` | Open | |
| U-8 | Account enumeration | I | Medium | `<PROJ-?>` | Open | |

### Audit Logs

| # | Title | STRIDE | Severity | Ticket | Status | Notes |
|---|-------|--------|----------|--------|--------|-------|
| AL-1 | Logs deleted or tampered with | T | High | `<PROJ-?>` | Open | |
| AL-2 | Incomplete logging | R | High | `<PROJ-?>` | Open | |
| AL-3 | PII / secrets in logs | I | High | `<PROJ-?>` | Open | |
| AL-4 | Log storage full | D | Low | `<PROJ-?>` | Open | |
| AL-5 | Insufficient log retention | R | Medium | `<PROJ-?>` | Open | |

---

## Severity Totals

Update after each threat model run:

| Severity | Count |
|----------|-------|
| Critical | `_` |
| High | `_` |
| Medium | `_` |
| Low | `_` |
| **Total** | **`_`** |

---

## Custom / Project-Specific Threats

Add any threats unique to your system architecture here:

| # | Title | STRIDE | Severity | Ticket | Status | Notes |
|---|-------|--------|----------|--------|--------|-------|
| C-1 | _(your threat)_ | | | | Open | |
