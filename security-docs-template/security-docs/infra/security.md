# Infrastructure Security

**Applies to:** Load balancers (HAProxy, AWS ALB, GCP LB, Nginx), reverse proxies (Nginx, Caddy, Traefik), CDNs, DNS  
**Layer:** DMZ / Network Edge  

---

## Key Principle

> The network edge is where public traffic first enters your system.  
> Every unnecessary port, protocol, header, and service must be turned off here.  
> Assume anything reaching the edge is hostile until proven otherwise.

---

## Threats & Mitigations

### I-1 · DDoS / Volumetric Flood
| Field | Detail |
|-------|--------|
| **STRIDE** | Denial of Service |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A flood of requests or connections takes the entire site offline. |
| **Mitigation** | Rate limiting and connection throttling at the load balancer (e.g. HAProxy `stick-tables`, `maxconn`). CDN with DDoS protection (Cloudflare, AWS Shield). Auto-scaling for burst traffic. Block obvious attack patterns at the edge. |

---

### I-2 · Weak or Outdated TLS
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Old TLS versions (TLS 1.0 / 1.1) or weak cipher suites allow traffic to be decrypted by an attacker on the network. |
| **Mitigation** | TLS 1.2 minimum, TLS 1.3 preferred. Disable SSLv3, TLS 1.0, TLS 1.1. Use only strong cipher suites. Enable **HSTS** with a long `max-age`. Test config regularly with [SSL Labs](https://www.ssllabs.com/ssltest/). |

---

### I-3 · SSL / TLS Private Key Compromise
| Field | Detail |
|-------|--------|
| **STRIDE** | Spoofing |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A stolen private key lets an attacker impersonate your site or decrypt past traffic (if forward secrecy is not in use). |
| **Mitigation** | Store private keys in a secrets manager or HSM. File permissions 600, root-only read. Use ECDHE cipher suites for forward secrecy. Revoke and rotate immediately on suspected compromise. |

---

### I-4 · Missing Security Headers
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering / Info Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Without security headers, browsers allow XSS, clickjacking, MIME sniffing, and referrer leakage. |
| **Mitigation** | Set the following headers on **all** responses: `Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Referrer-Policy: no-referrer`, `Permissions-Policy`. Test with [securityheaders.com](https://securityheaders.com/). |

---

### I-5 · Server / Version Disclosure
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | Low |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Error pages and `Server:` headers reveal the software version, which helps attackers find known CVEs. |
| **Mitigation** | `server_tokens off` (Nginx) / suppress version in HAProxy / custom error pages. Return a generic `Server: webserver` header or none at all. |

---

### I-6 · Directory Listing Enabled
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | Low |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Web server exposes a browsable directory listing, leaking internal file names and structure. |
| **Mitigation** | `autoindex off` in Nginx. Ensure no S3 bucket or object storage has public listing enabled. |

---

### I-7 · Hidden / Dotfiles Exposed
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | `.env`, `.git`, `config.yml`, `id_rsa`, and similar files are downloadable directly from the web root. |
| **Mitigation** | `location ~ /\. { deny all; }` in Nginx. Block dotfiles and config file extensions at the web server level. Ensure no source directories are inside the served public folder. |

---

### I-8 · Backend Port Directly Accessible
| Field | Detail |
|-------|--------|
| **STRIDE** | Spoofing / Elevation of Privilege |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Attackers bypass the reverse proxy by hitting the app server's internal port directly (e.g. port 3000 / 8000 / 8080), skipping rate limiting, WAF, and security headers. |
| **Mitigation** | Bind app server to `127.0.0.1` or a private internal IP only. Firewall rules block all external access to app server ports. Only the reverse proxy / load balancer IP is allowed. |

---

### I-8 · Reverse Proxy Running as Root
| Field | Detail |
|-------|--------|
| **STRIDE** | Elevation of Privilege |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | If the reverse proxy is compromised, running as root gives the attacker full server control. |
| **Mitigation** | Run Nginx/Caddy worker processes as a non-root user (e.g. `www-data`). Use Linux capabilities (`CAP_NET_BIND_SERVICE`) instead of root for port 80/443 binding. |

---

### I-9 · Header / Request Smuggling
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Inconsistencies in how the proxy and backend parse HTTP headers allow an attacker to inject requests or poison shared connections. |
| **Mitigation** | Keep proxy and backend HTTP parsing consistent. Reject ambiguous `Transfer-Encoding` / `Content-Length` combinations. Keep reverse proxy and app server versions current. Test with [https://portswigger.net/web-security/request-smuggling](https://portswigger.net/web-security/request-smuggling) tooling. |

---

## Checklist

- [ ] TLS 1.2+ only; SSLv3 / TLS 1.0 / TLS 1.1 disabled — confirmed with SSL Labs
- [ ] HSTS enabled with long `max-age`
- [ ] Private key stored in secrets manager; file permissions 600
- [ ] All security headers present on every response (verified with securityheaders.com)
- [ ] `server_tokens off` / version suppression in place
- [ ] `autoindex off`; no public bucket listing
- [ ] Dotfiles and config extensions blocked (`location ~ /\. { deny all; }`)
- [ ] App server bound to internal IP only; external ports firewalled
- [ ] Reverse proxy running as non-root user
- [ ] Rate limiting and connection throttling configured at load balancer
- [ ] DDoS protection layer in place (CDN or cloud provider shield)

---

## Tools

| Purpose | Tool |
|---------|------|
| TLS config testing | [SSL Labs](https://www.ssllabs.com/ssltest/) |
| Header testing | [securityheaders.com](https://securityheaders.com/) |
| WAF | [ModSecurity](https://modsecurity.org/) / Cloudflare WAF / AWS WAF |
| DDoS protection | [Cloudflare](https://www.cloudflare.com/) / AWS Shield / GCP Cloud Armor |
| Certificate management | [Let's Encrypt](https://letsencrypt.org/) + auto-renewal |
