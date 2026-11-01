# Audit Log Security

**Applies to:** All web applications — any system where user actions must be traceable  
**Layer:** Data Zone / Observability  

---

## Key Principle

> Audit logs are the **source of truth** for what happened in your system.  
> They must be tamper-proof, complete, and free of sensitive data.  
> If logs can be deleted or modified, they are not audit logs — they are just notes.

---

## Threats & Mitigations

### AL-1 · Logs Deleted or Tampered With
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | An attacker (or a malicious insider) deletes or modifies log entries to erase evidence of their actions. |
| **Mitigation** | Append-only log store — no UPDATE or DELETE on log tables / files. Ship logs in real-time to a **separate, immutable destination** (SIEM, S3 with Object Lock, a separate logging service). Store a hash of each log batch for integrity verification. |

---

### AL-2 · Incomplete Logging
| Field | Detail |
|-------|--------|
| **STRIDE** | Repudiation |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Logging is incomplete — some sensitive actions are never recorded, so they cannot be proven or investigated. |
| **Mitigation** | Log **all** events listed in the "What to Log" section below. Alert if logging stops (health check: no log entries received in 5 minutes = alert). Review logging coverage in security audits. |

---

### AL-3 · PII / Secrets in Logs
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Passwords, tokens, credit card numbers, personal data, or other secrets are written into logs and become accessible to anyone with log access. |
| **Mitigation** | Apply a **PII / secret filter** before every log write. Mask or hash sensitive fields (passwords, tokens, national IDs, payment card numbers). Use structured logging and a field-level redaction middleware rather than logging raw request bodies. |

---

### AL-4 · Log Storage Full / Disk Exhaustion
| Field | Detail |
|-------|--------|
| **STRIDE** | Denial of Service |
| **Severity** | Low |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Log volume fills the disk or storage quota, causing logging to silently stop. |
| **Mitigation** | Log rotation policy (e.g. daily rotate, compress, keep 30 days online). Archive to cold storage (e.g. S3 Glacier) for long-term retention. Disk usage alert at 80% capacity. |

---

### AL-5 · Insufficient Log Retention
| Field | Detail |
|-------|--------|
| **STRIDE** | Repudiation |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Logs are deleted too soon — an incident that is discovered weeks later cannot be investigated because the evidence is gone. |
| **Mitigation** | Retain logs for at least **90 days online** and **1 year archived** (adjust to your regulatory requirements: GDPR, HIPAA, PCI-DSS, SOC 2, etc.). Enforce retention policies in your SIEM / log storage config. |

---

## What to Log

Adapt this list to your system. Every log entry must include at minimum: **timestamp (UTC), event type, actor user ID, resource type + ID, source IP.**

| Event Category | What to Record |
|----------------|---------------|
| **Authentication** | Login attempt (success/fail), logout, MFA trigger, MFA fail, password reset |
| **Authorization** | Access denied (user + resource + reason), role check failure |
| **Data Access** | Read of any sensitive or personally identifiable resource (user ID, resource ID) |
| **Data Modification** | Create / update / delete of any record (before + after values for critical fields) |
| **File Operations** | Upload, download, delete of any stored file (user ID, file ID, size) |
| **Account Management** | Account created / deleted / suspended, email / password changed |
| **Role & Permission Changes** | Role granted / revoked (who did it, to whom, old role, new role) |
| **Admin Actions** | All actions performed by admin or high-privilege accounts |
| **AI / LLM** | Prompt (hashed or truncated), tool calls invoked, response (hashed), user ID |
| **Payments** | Payment initiated, succeeded, failed, refunded (amount, currency — no raw card data) |
| **System Events** | Service start / stop, config change, deployment, certificate renewal |
| **Security Events** | Rate limit hit, IP block, suspicious pattern detected, WAF rule fired |

---

## Log Entry Format (recommended)

```json
{
  "timestamp": "2026-10-31T14:22:05.123Z",
  "event": "user.login.success",
  "actor": {
    "user_id": "usr_abc123",
    "role": "admin",
    "ip": "203.0.113.42",
    "user_agent": "Mozilla/5.0 ..."
  },
  "resource": {
    "type": "session",
    "id": "ses_xyz789"
  },
  "metadata": {
    "mfa_used": true,
    "new_device": true
  }
}
```

---

## Checklist

- [ ] Log store is append-only — no UPDATE/DELETE on log tables or files
- [ ] Logs shipped in real-time to a separate, immutable destination (SIEM / S3 Object Lock)
- [ ] PII / secret filter applied before every log write
- [ ] Health check alert fires if no logs received for 5 minutes
- [ ] All events in the "What to Log" table are confirmed to be captured
- [ ] Log rotation configured (30-day online, 1-year archive)
- [ ] Disk usage alert at 80% capacity
- [ ] Retention period meets regulatory requirements for your jurisdiction / industry

---

## Tools

| Purpose | Tool |
|---------|------|
| Structured logging | [Winston](https://github.com/winstonjs/winston) / [Pino](https://github.com/pinojs/pino) / [structlog](https://www.structlog.org/) |
| PII redaction | [Presidio](https://github.com/microsoft/presidio) / custom field-level middleware |
| SIEM / log aggregation | [Wazuh](https://wazuh.com/) / Elastic Stack / Splunk / Datadog / Grafana Loki |
| Immutable log storage | AWS S3 + Object Lock / GCS + Retention Policy |
| Log health monitoring | Alertmanager / PagerDuty / OpsGenie |
