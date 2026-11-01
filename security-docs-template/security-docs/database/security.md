# Database Security

**Applies to:** PostgreSQL, MySQL, MongoDB, Redis, any other data store  
**Layer:** Data Zone  

---

## Key Principle

> The database must **never be directly reachable** from the internet or from the browser.  
> Only the application server (and, if used, a read-only analytics or AI service) should be able to connect.

---

## Threats & Mitigations

### D-1 · Database Breach / Exposed Port
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | The database is reachable from the internet (misconfigured firewall, cloud security group left open), allowing direct exfiltration of all data. |
| **Mitigation** | Database port (5432 / 3306 / 27017 / etc.) blocked at firewall for all external traffic. Accessible only from the app server's private IP via `pg_hba.conf` / bind address / security group rule. Encryption at rest enabled. |

---

### D-2 · Hardcoded / Leaked Credentials
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Database password appears in source code, `.env` committed to Git, or a CI log, giving any reader full DB access. |
| **Mitigation** | Credentials stored in a **secrets manager** only. Injected into the application at runtime via environment variables. Run **Gitleaks** in CI to detect accidental commits. Rotate credentials on any suspected exposure. |

---

### D-3 · Superuser / Overly Privileged Application Account
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering / Elevation of Privilege |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | The application connects as a database superuser (`root`, `postgres`, `sa`). A successful SQL injection gives the attacker full control — DROP TABLE, dump all data, etc. |
| **Mitigation** | Create **least-privilege** service accounts per role: `app_user` (SELECT/INSERT/UPDATE/DELETE on app tables only), `readonly_user` (SELECT only for analytics/AI), `migration_user` (DDL during deploys only). No service account can DROP or ALTER in production. |

---

### D-4 · Unencrypted Backups
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A stolen or leaked backup file exposes all data in plaintext. |
| **Mitigation** | Encrypt all backups at rest (AES-256 or equivalent). Store backups in a separate private bucket/volume with its own access controls. Test restore regularly (at least monthly). |

---

### D-5 · No Database-Level Audit
| Field | Detail |
|-------|--------|
| **STRIDE** | Repudiation |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Someone makes changes directly to the database (bypassing the application audit log) and there is no record of it. |
| **Mitigation** | Enable DB-level audit logging for DDL and sensitive DML operations (e.g. `pgaudit` for PostgreSQL, `general_log` / audit plugin for MySQL). No shared DB accounts — every service role is distinct. |

---

### D-6 · Unencrypted Database Connections
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | DB traffic (including credentials and sensitive data) travels in plaintext on the internal network. |
| **Mitigation** | Enforce TLS / SSL on all database connections (`sslmode=require` for PostgreSQL; `require_secure_transport=ON` for MySQL). Enforce in the DB server config, not just client config. |

---

### D-7 · Resource Exhaustion
| Field | Detail |
|-------|--------|
| **STRIDE** | Denial of Service |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Heavy or slow queries (e.g. from a missing index, or a DoS-driven query flood) lock up the database and bring down the application. |
| **Mitigation** | Connection pooling (PgBouncer, HikariCP, etc.). `statement_timeout` set at the DB level. Slow-query monitoring and alerting. Index all foreign keys and frequently filtered columns. |

---

### D-8 · Unencrypted Sensitive Columns
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | If the database is accessed directly (backup leak, misconfigured access), sensitive fields (PII, tokens, payment data) are readable in plaintext. |
| **Mitigation** | Encrypt sensitive columns at the application layer (e.g. AES-256) before writing to the DB. Store encryption keys separately in a secrets manager, never alongside the data. Consider database-level column encryption where supported. |

---

## Checklist

- [ ] Database port blocked from internet and DMZ; accessible only from app server IP
- [ ] Credentials stored in secrets manager — not in source code or committed `.env`
- [ ] Gitleaks running in CI
- [ ] Application connects as a least-privilege service account — no superuser in production
- [ ] All backups encrypted at rest and tested for restore monthly
- [ ] DB-level audit logging enabled for DDL and sensitive DML
- [ ] TLS / SSL enforced on all connections (`sslmode=require` or equivalent)
- [ ] Connection pooling in place with `statement_timeout` configured
- [ ] Sensitive columns encrypted at application layer; keys in secrets manager

---

## Tools

| Purpose | Tool |
|---------|------|
| Secret management | [HashiCorp Vault](https://www.vaultproject.io/) / AWS Secrets Manager |
| DB audit (PostgreSQL) | [pgaudit](https://www.pgaudit.org/) |
| DB audit (MySQL) | MySQL Enterprise Audit / MariaDB Audit Plugin |
| Connection pooling | [PgBouncer](https://www.pgbouncer.org/) / [HikariCP](https://github.com/brettwooldridge/HikariCP) |
| Secret scanning | [Gitleaks](https://github.com/gitleaks/gitleaks) |
| Monitoring | Prometheus + db_exporter / CloudWatch |
