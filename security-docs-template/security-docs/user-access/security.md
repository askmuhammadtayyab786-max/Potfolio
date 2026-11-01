# User Access & Account Security

**Applies to:** All web applications with user accounts — consumer apps, dashboards, admin panels, SaaS, internal tools  
**Layer:** Identity / Access Management  

---

## Key Principle

> The weakest link in most breaches is the user account.  
> Strong authentication, minimal permissions, and complete audit trails are non-negotiable.

---

## Define Your Roles

Fill in your actual roles below. Example structure:

| Role | Typical Access |
|------|---------------|
| Guest / Unauthenticated | Public content only |
| `User` / `Member` | Own data and resources only |
| `Editor` / `Manager` | Create and modify content in their scope |
| `Admin` | All users, roles, settings — highest privilege |
| `Service Account` | API-only access with scoped permissions |

> **Principle of Least Privilege:** every role gets only the permissions it strictly needs to do its job.

---

## Threats & Mitigations

### U-1 · Account Takeover via Weak / Reused Password
| Field | Detail |
|-------|--------|
| **STRIDE** | Spoofing |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A stolen or weak password (from this site or a credential breach elsewhere) lets someone log in as another user. |
| **Mitigation** | Enforce minimum password strength. Check new passwords against **HaveIBeenPwned** breached-password list. Offer or require MFA for all accounts. |

---

### U-2 · Admin / High-Privilege Account Takeover
| Field | Detail |
|-------|--------|
| **STRIDE** | Spoofing |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | An attacker who compromises an admin account can control all users, data, and settings. |
| **Mitigation** | **Mandatory MFA** for all admin / high-privilege accounts. Restrict admin panel to VPN or known internal IPs. Use separate, dedicated admin accounts — not the same account used for daily tasks. Alert on admin login from a new device or IP. |

---

### U-3 · Shared / Generic Accounts
| Field | Detail |
|-------|--------|
| **STRIDE** | Repudiation / Spoofing |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Multiple people share one account, so no action can be attributed to an individual and audit trails are useless. |
| **Mitigation** | Every person gets their own individual account. Enforce this in the onboarding flow. Service-to-service calls use dedicated service accounts, not human accounts. Auto-logout on shared devices. |

---

### U-4 · No MFA / Weak Second Factor
| Field | Detail |
|-------|--------|
| **STRIDE** | Spoofing |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Password-only authentication is insufficient — passwords are routinely leaked, phished, or guessed. |
| **Mitigation** | Offer TOTP (Authenticator app) or hardware key (FIDO2/WebAuthn) as second factors. Prefer TOTP or WebAuthn over SMS (SMS is vulnerable to SIM-swap). Mandate MFA for admin, financial, or other high-risk roles. |

---

### U-5 · No Session Expiry / Session Fixation
| Field | Detail |
|-------|--------|
| **STRIDE** | Spoofing / Info Disclosure |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A session that never expires (or a fixed session ID) allows an attacker who obtains the token to use it indefinitely. |
| **Mitigation** | Access token expiry: 15 minutes. Refresh token expiry: 7 days (revocable). Regenerate session ID on login. Invalidate all sessions on password change or logout. Provide a "log out all devices" option. |

---

### U-6 · Permissive Role Assignment
| Field | Detail |
|-------|--------|
| **STRIDE** | Elevation of Privilege |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Roles are assigned too broadly, or there is no process for removing access when a user's responsibilities change. |
| **Mitigation** | Review and audit role assignments quarterly. Remove access immediately on offboarding. Default new accounts to the lowest privilege role. Require approval for elevated role assignment. |

---

### U-7 · No Audit of Account / Permission Changes
| Field | Detail |
|-------|--------|
| **STRIDE** | Repudiation |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Role or permission changes are made with no record of who approved them or when. |
| **Mitigation** | Log every role change, permission grant/revoke, and account create/delete with the acting user ID and timestamp. Send alerts to admin on privilege escalation. |

---

### U-8 · Account Enumeration
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Different error messages on login ("user not found" vs "wrong password") or on password reset ("email not registered") allow an attacker to enumerate valid accounts. |
| **Mitigation** | Return the same generic message for all login failures ("Invalid username or password"). For password reset, always say "If this email is registered, a reset link has been sent." Add rate limiting to prevent enumeration via timing attacks. |

---

## Checklist

- [ ] Every user has an individual account — no shared logins
- [ ] Passwords checked against HaveIBeenPwned on account creation / password change
- [ ] MFA available for all users; mandatory for admin / high-privilege roles
- [ ] Admin panel restricted to VPN or internal IPs
- [ ] Access tokens expire after 15 min; refresh tokens are revocable
- [ ] Session ID regenerated on login; all sessions invalidated on password change
- [ ] "Log out all devices" option available to users
- [ ] Role assignments reviewed quarterly; access removed on offboarding
- [ ] All account and role changes logged with actor user ID + timestamp
- [ ] Login / password-reset responses use identical messages to prevent enumeration

---

## Tools

| Purpose | Tool |
|---------|------|
| MFA (TOTP) | [Speakeasy](https://github.com/speakeasyjs/speakeasy) / [Otpauth](https://github.com/hectorm/otpauth) |
| MFA (WebAuthn) | [SimpleWebAuthn](https://simplewebauthn.dev/) |
| Breached password check | [HaveIBeenPwned API](https://haveibeenpwned.com/API/v3) |
| Identity provider | Auth0 / Keycloak / Cognito / Supabase Auth |
| Session management | `express-session` with Redis store / JWT with refresh token rotation |
