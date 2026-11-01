# File & Object Storage Security

**Applies to:** Any application that stores user-uploaded files — documents, images, videos, exports, attachments  
**Layer:** Data Zone  
**Common implementations:** AWS S3, Google Cloud Storage, Azure Blob, MinIO, local filesystem with Nginx  

---

## Key Principle

> User-uploaded files are one of the most common attack vectors in web applications.  
> Never trust a filename or file extension. Never serve files from a publicly guessable path.  
> Validate content, not just metadata.

---

## Threats & Mitigations

### FS-1 · Public / Guessable File URLs
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Files are reachable at predictable or publicly accessible URLs, allowing unauthorized users to access other users' files by guessing or enumerating paths. |
| **Mitigation** | Use **private storage** (no public read ACL on bucket / directory). Generate **short-lived signed URLs** (pre-signed S3 URLs, GCS signed URLs) via the API for every authorized download. Assign **random, non-guessable** names (UUID v4) to all stored files — never use the original filename or a sequential ID as the storage key. |

---

### FS-2 · Malicious File Upload (RCE / Stored XSS)
| Field | Detail |
|-------|--------|
| **STRIDE** | Elevation of Privilege / Tampering |
| **Severity** | Critical |
| **Ticket** | `<PROJ-?>` |
| **Threat** | An attacker uploads a script (`.php`, `.js`, `.html`, `.svg`, `.xml`) disguised as an allowed file type. If served back to users it executes in their browser (XSS) or on the server (RCE). |
| **Mitigation** | Validate **magic bytes** (file content header), not just the MIME type or extension claimed by the client. Maintain an allowlist of permitted file types. Serve files with a `Content-Disposition: attachment` header and a locked `Content-Type`. Store files outside any directory the web server executes from. |

---

### FS-3 · File Content Tampering
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A stored file (e.g. a contract, a report, an invoice) is modified after upload without detection — altering its content without a trace. |
| **Mitigation** | Compute and store a **SHA-256 checksum** of every file at upload time. Verify the checksum on every download / access. Use object storage versioning (S3 versioning, GCS versioning) to keep a history of changes. Write access to files must go through the API — no direct writes to the storage layer by end users. |

---

### FS-4 · No Access Control on File Downloads
| Field | Detail |
|-------|--------|
| **STRIDE** | Information Disclosure |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | Any authenticated (or unauthenticated) user can download any file by knowing or guessing its storage key. |
| **Mitigation** | Every download request must be authorized by the API: verify that the requesting user owns or has permission to access the specific file. Never expose storage bucket or directory paths directly. Generate signed URLs only after authorization is confirmed. |

---

### FS-5 · Storage Exhaustion / Disk Filling
| Field | Detail |
|-------|--------|
| **STRIDE** | Denial of Service |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | A user (or a malicious actor) uploads massive volumes of files, filling storage and blocking all other users. |
| **Mitigation** | Enforce per-file size limits at the API (reject before writing to storage). Set per-user or per-account storage quotas. Monitor storage usage and alert at 80% capacity. Apply lifecycle policies to auto-delete temporary or expired files. |

---

### FS-6 · No Audit of File Access
| Field | Detail |
|-------|--------|
| **STRIDE** | Repudiation |
| **Severity** | Medium |
| **Ticket** | `<PROJ-?>` |
| **Threat** | There is no record of who downloaded or viewed a sensitive file, making it impossible to investigate a data leak. |
| **Mitigation** | Log every upload, download, and delete to the audit log with user ID, file ID, timestamp, and IP. Enable server-access logging on your storage bucket (S3 access logs, GCS audit logs). |

---

### FS-7 · Malware in Uploaded Files
| Field | Detail |
|-------|--------|
| **STRIDE** | Tampering |
| **Severity** | High |
| **Ticket** | `<PROJ-?>` |
| **Threat** | An uploaded file contains malware that is later downloaded and executed by another user or an internal process. |
| **Mitigation** | Scan all uploaded files with an antivirus engine (ClamAV, AWS Macie, or a cloud AV service) before making them available for download. Quarantine files that fail scanning. |

---

## Checklist

- [ ] Storage bucket / directory has **no public read** access
- [ ] All file download URLs are **signed and short-lived** (≤ 15 min), generated after authorization check
- [ ] Files stored with **random UUID keys** — original filename never used as storage key
- [ ] File type validated by **magic bytes**, not extension or client-supplied MIME type
- [ ] `Content-Disposition: attachment` set on all file download responses
- [ ] Files stored **outside the web root** (cannot be executed by the web server)
- [ ] SHA-256 checksum stored at upload and verified at download
- [ ] Object versioning enabled
- [ ] Per-file size limit enforced at the API before writing to storage
- [ ] Per-user / per-account storage quota enforced
- [ ] Disk / bucket usage alert at 80% capacity
- [ ] Antivirus scan on every uploaded file
- [ ] Every upload / download / delete logged to audit log

---

## Tools

| Purpose | Tool |
|---------|------|
| Object storage | [AWS S3](https://aws.amazon.com/s3/) / [GCS](https://cloud.google.com/storage) / [Azure Blob](https://azure.microsoft.com/en-us/services/storage/blobs/) / [MinIO](https://min.io/) |
| Magic-byte validation | [file-type](https://github.com/sindresorhus/file-type) (Node.js) / [python-magic](https://github.com/ahupp/python-magic) |
| Antivirus scanning | [ClamAV](https://www.clamav.net/) / [AWS Macie](https://aws.amazon.com/macie/) |
| Malware scanning (cloud) | VirusTotal API / Cloudmersive |
| Checksum | Built-in crypto: `crypto.createHash('sha256')` (Node.js) / `hashlib` (Python) |
