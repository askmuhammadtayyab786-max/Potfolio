# Backend / API Security

**Applies to:** Any backend API — Node.js/Express, Django, FastAPI, Rails, Spring Boot, Laravel, etc.  
**Layer:** Application / Business Logic  

---

## Key Principle

> The API is the **last line of defence** between the internet and your data.  
> Every input must be validated. Every route must check identity and permission.  
> Never trust the client.

---

## Threats & Mitigations

### B-1 · Authentication Token Forgery / Weak Secret
| Field | Detail |
|-------|--------|
| **STRIDE** | Spoofing |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A weak or leaked JWT / session secret lets an attacker forge a token and authenticate as any user. |
| **Mitigation** | Store signing secrets in a **secrets manager** (Vault, AWS Secrets Manager, etc.) — never in source code or `.env` committed to Git. Verify signature and `alg` on every request. Use short expiry (15 min access token; 7-day refresh). Rotate secrets immediately on suspected compromise. |

---

### B-2 · Brute-Force / Credential Stuffing
| Field | Detail |
|-------|--------|
| **STRIDE** | Spoofing |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | An attacker tries thousands of passwords or credential pairs against login endpoints. |
| **Mitigation** | Rate limit login endpoints. Enforce account lockout after N failed attempts. Hash passwords with **bcrypt/argon2**. Offer or require MFA for privileged accounts. |

---

### B-3 · IDOR — Insecure Direct Object Reference
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Changing a resource ID in the URL (`/api/orders/456`) returns another user's data. |
| **Mitigation** | On every request, verify the requested resource belongs to the authenticated user (or their permitted scope). Never trust IDs in URLs or request bodies without an ownership check against the database. |

---

### B-4 · Broken Access Control / Role Escalation
| Field | Detail |
|-------|--------|
| **STRIDE** | Elevation of Privilege |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A low-privilege user calls admin-only or other-role API routes directly. |
| **Mitigation** | RBAC or ABAC middleware on every route. Read role from verified token or database — never from the request body. Test each role against all routes in CI (authorization matrix tests). |

---

### B-5 · SQL / NoSQL / Command Injection
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Malicious user input is executed as a database query or shell command, leaking or destroying data. |
| **Mitigation** | Use **parameterized queries / prepared statements** exclusively — never concatenate user input into queries. Use an ORM with safe query building. Validate and sanitize all inputs server-side. |

---

### B-6 · Mass Assignment
| Field | Detail |
|-------|--------|
| **STRIDE** | Elevation of Privilege |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A user sends extra fields in a request (e.g. `"role": "admin"`) that are blindly bound to a model, overwriting protected attributes. |
| **Mitigation** | Use an explicit allowlist of fields accepted per endpoint. Strip or ignore any unexpected fields in request bodies. Never pass raw request bodies directly to database models. |

---

### B-7 · Malicious File Upload
| Field | Detail |
|-------|--------|
| **STRIDE** | Elevation of Privilege |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | An uploaded file is actually a script or malware that executes on the server or is served to other users. |
| **Mitigation** | Validate file type by **magic bytes**, not just extension. Enforce size limits. Scan with antivirus (ClamAV). Store files outside the web root. Serve via signed URLs only. Rename files on upload — never use the original filename. |

---

### B-8 · API Rate Limiting / DoS
| Field | Detail |
|-------|--------|
| **STRIDE** | Denial of Service |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Too many requests overload the API, making it unavailable to legitimate users. |
| **Mitigation** | Per-user and per-IP rate limiting. Request size limits. Enforce timeouts on all I/O operations. Use a load balancer with connection throttling. |

---

### B-9 · Verbose Error Messages
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Stack traces reveal file paths, framework versions, database schema, or library details that help attackers plan attacks. |
| **Mitigation** | Return generic error messages in production API responses. Write detailed errors only to server-side logs. Disable stack traces in production mode. |

---

### B-10 · No Audit Trail for Sensitive Actions
| Field | Detail |
|-------|--------|
| **STRIDE** | Repudiation |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A user denies performing an action and there is no record to prove otherwise. |
| **Mitigation** | Log every sensitive read, write, and delete with user ID, timestamp, IP, and resource ID. Ship logs to an append-only audit store or SIEM. |

---

### B-11 · Vulnerable Dependencies
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A known CVE in a library gives an attacker a foothold in the application. |
| **Mitigation** | Run `npm audit` / `pip audit` / `bundle audit` and Snyk in CI. Pin dependency versions. Block deployments on Critical CVEs. Review and update dependencies regularly. |

---

### B-12 · Server-Side Request Forgery (SSRF)
| Field | Detail |
|-------|--------|
| **STRIDE** | Info Disclosure / Elevation of Privilege |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | The API fetches a URL supplied by the user, allowing an attacker to probe internal services, cloud metadata endpoints, or other backend systems. |
| **Mitigation** | Validate and allowlist all URLs the server is permitted to fetch. Block requests to private IP ranges (10.x, 172.16.x, 192.168.x, 169.254.x). Disable redirects or validate the final destination. |

---

## Checklist

- [ ] Auth secret stored in secrets manager — not in source code or committed `.env`
- [ ] Login endpoint rate-limited; account lockout after N failures
- [ ] Every resource fetch includes an ownership / permission check
- [ ] RBAC/ABAC middleware on every protected route (authorization matrix tested in CI)
- [ ] All DB queries use parameterized statements — zero string concatenation
- [ ] Request body allowlists defined — no raw pass-through to DB models
- [ ] File upload: magic-byte check, size limit, antivirus scan, stored outside web root
- [ ] API responses in production contain no stack traces or internal details
- [ ] All sensitive actions written to append-only audit log
- [ ] Dependency scanner running in CI with Critical CVE block
- [ ] SSRF: URL fetches validated against allowlist; private IP ranges blocked

---

## Tools

| Purpose | Tool |
|---------|------|
| Input validation | [express-validator](https://express-validator.github.io/) / [Joi](https://joi.dev/) / [Pydantic](https://docs.pydantic.dev/) |
| Rate limiting | [express-rate-limit](https://github.com/express-rate-limit/express-rate-limit) / framework equivalent |
| Password hashing | [bcrypt](https://github.com/kelektiv/node.bcrypt.js) / [argon2](https://github.com/ranisalt/node-argon2) |
| Secret management | [HashiCorp Vault](https://www.vaultproject.io/) / AWS Secrets Manager / GCP Secret Manager |
| File scanning | [ClamAV](https://www.clamav.net/) |
| Dependency scanning | [Snyk](https://snyk.io/) / `npm audit` / `pip audit` |
| DAST | [OWASP ZAP](https://www.zaproxy.org/) |
