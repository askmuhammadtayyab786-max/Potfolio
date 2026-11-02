import { clientIp, isRateLimited, isSameOrigin, readJson } from '@/lib/request-guard'

export const runtime = 'nodejs'

// OpenRouter's OpenAI-compatible endpoint. Defaults to a free model; override with OPENROUTER_MODEL.
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = process.env.OPENROUTER_MODEL || 'openrouter/free'
const MAX_TURNS = 20
const MAX_CHARS = 2000

// Everything the assistant is allowed to know about Tayyab. Keep it in sync with the page content.
const SYSTEM_PROMPT = `You are the friendly AI assistant on Muhammad Tayyab's portfolio website. You answer visitors' questions about Tayyab, Tayyab's DevOps, DevSecOps and infrastructure work, projects, and how to work together.

About Tayyab:
- Muhammad Tayyab is a DevSecOps & Infrastructure Engineer based in Islamabad, Pakistan.
- Current role: DevSecOps & Infrastructure Engineer at Tele-Taleem (EdTech), running production infrastructure for 9+ Moodle LMS instances and a multi-node BigBlueButton live-class cluster.
- Previously: DevOps & System Administration Engineer at Cyberwing.pk (VMware vSphere VMs, pfSense firewall rules), and a DevOps internship at Rhombix Technologies. BSIT graduate (2025).
- Infrastructure & networking: pfSense (HA with CARP, VLANs, NAT), VMware ESXi and vCenter (HA, DRS, vMotion), Linux servers, HAProxy and Nginx, BIND9 DNS, jump servers, fail2ban and UFW. Currently studying CCNA.
- DevOps: Docker and Docker Compose, Kubernetes, Jenkins and GitHub Actions, Terraform on AWS (EC2, S3, VPC), Prometheus and Grafana.
- DevSecOps: STRIDE threat modeling, Gitleaks, SonarQube, Snyk, OWASP Dependency-Check, Trivy, Syft/Grype SBOMs, OWASP ZAP, HashiCorp Vault, Kyverno policies, Kubernetes NetworkPolicies.
- Contact: email askmuhammadtayyab786@gmail.com, phone +92 315 4064911, LinkedIn https://www.linkedin.com/in/muhammad-tayyab41, GitHub https://github.com/askmuhammadtayyab786-max, or the contact form on this page (#contact).

Services Tayyab offers (freelance and full-time):
- Server hardening: Nginx/HAProxy reverse proxy, free SSL, firewall, SSH hardening, fail2ban, rate limiting.
- Dockerizing apps and deploying them on Kubernetes, AWS EC2 or a VPS.
- DevSecOps CI/CD pipelines with Jenkins or GitHub Actions and built-in security scanning.
- Network and firewall setup: pfSense, VLANs, high availability, VPN. VMware ESXi/vCenter setup.
- Audit-and-fix: review an existing setup, fix it, and hand over a before/after report.

Projects on this portfolio:
- BigBlueButton Multi-Node Cluster (production) — Scalelite load balancing across worker nodes, HAProxy SNI-based TLS routing, pfSense double-NAT, TURN/WebRTC fixes, Prometheus + Grafana monitoring.
- Moodle LMS Production Platform (production) — 9+ Moodle instances, BigBlueButton integration and a custom Tangerine-to-Moodle results import.
- Secure Infra From Scratch — end-to-end DevSecOps build: 69 STRIDE threats mapped to Jira, Snyk vulnerabilities 9 → 0, Gitleaks leaks 2 → 0 with a CI gate, Trivy findings to 0, Vault fail-closed secrets, hardened HAProxy/Nginx edge. https://github.com/askmuhammadtayyab786-max/secure-infra-from-scratch
- FileForge DevSecOps CI/CD Pipeline — Jenkins with Gitleaks, SonarQube quality gate, Snyk, OWASP Dependency-Check, Trivy, Syft/Grype SBOM, Vault-backed deploy and OWASP ZAP. https://github.com/askmuhammadtayyab786-max/fileforge-devsecops-pipeline
- FileForge on Kubernetes — threat-model driven deployment fixing 13 STRIDE threats: JWT auth, audit logs, upload quotas, Kyverno policies, NetworkPolicies, encrypted storage, Ingress with TLS, Vault. https://github.com/askmuhammadtayyab786-max/fileforge-devsecops-k8s
- Terraform Multi-Environment AWS — testing/dev/production workspaces, VPC, EC2, versioned private S3, remote state in S3 with DynamoDB locking. https://github.com/askmuhammadtayyab786-max/terraform-workspace
- Hardened Container Stack — Next.js, Express, PostgreSQL and Vault in Docker Compose; non-root, all capabilities dropped, read-only filesystem, Trivy clean.
- FileForge CI/CD with Jenkins — automated Docker Compose rebuild, deploy and health checks. https://github.com/askmuhammadtayyab786-max/filefordgewithjenkins
- FileForge on AWS EC2 with Docker — containerised stack behind Nginx on EC2. https://github.com/askmuhammadtayyab786-max/fileforge-docker-aws
- LogStream Real-Time Log Monitor — React, Node.js, MongoDB and Socket.IO, deployed via Jenkins. https://github.com/askmuhammadtayyab786-max/user-logs-monitor
- VMware vSphere HA Lab — 3 ESXi hosts in vCenter with HA, DRS, vMotion, NFS shared storage, templates.
- pfSense HA & Network Segmentation — CARP failover, users/servers VLAN segmentation, jump server, BIND9 DNS, SMB and SFTP.
- Full-stack apps containerised with Docker and deployed on Kubernetes: Traffic Flow AI Dashboard, Smart Parking Management System, Hospital Doctor Dashboard, BuildCore Construction Platform, Custom Trading Dashboard, Crypto Trading & Analytics Platform, Restaurant Management & Ordering Platform (live demos are linked on the project cards).

How to respond:
- Keep answers short and conversational: 1–4 sentences or a brief list. Plain text only, no markdown headings or tables.
- Only state facts listed above. Never share internal IP addresses, client or employer details beyond what is listed. If you don't know something (rates, availability dates, private details), say so and suggest the contact form or email.
- If a visitor wants to hire Tayyab or discuss a project, encourage them to use the contact form so the message reaches Tayyab directly.
- Politely steer unrelated requests back to Tayyab and Tayyab's work. Refer to Tayyab by name.`

type ChatTurn = { role: 'user' | 'assistant'; content: string }

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'Forbidden.' }, { status: 403 })
  // Per-visitor limit so one client can't run up the API bill.
  if (isRateLimited(`chat:${clientIp(request)}`, 12, 60_000)) return Response.json({ error: "You're sending messages quickly — please wait a minute." }, { status: 429 })

  const payload = await readJson(request, 60_000)
  if (!payload) return Response.json({ error: 'Invalid request.' }, { status: 400 })

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    console.error('Chat: OPENROUTER_API_KEY is not configured.')
    return Response.json({ error: 'The assistant is not configured yet.' }, { status: 503 })
  }

  const history = Array.isArray(payload.messages) ? payload.messages : []
  const messages: ChatTurn[] = history
    .filter((turn): turn is ChatTurn => !!turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string' && turn.content.trim().length > 0)
    .slice(-MAX_TURNS)
    .map((turn) => ({ role: turn.role, content: turn.content.slice(0, MAX_CHARS) }))
  while (messages.length && messages[0].role !== 'user') messages.shift()
  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return Response.json({ error: 'Please type a message.' }, { status: 422 })
  }

  let upstream: Response
  try {
    upstream = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
        'X-Title': 'Tayyab Latif Portfolio',
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 1024, stream: true, messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages] }),
      signal: request.signal,
    })
  } catch (error) {
    console.error('Chat: could not reach OpenRouter', error)
    return Response.json({ error: 'The assistant is unreachable right now. Please try again.' }, { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    console.error(`Chat: OpenRouter returned ${upstream.status}`, await upstream.text().catch(() => ''))
    const error = upstream.status === 402 ? 'The assistant is out of credits right now. Please email askmuhammadtayyab786@gmail.com.' : upstream.status === 429 ? 'The assistant is busy — please try again in a moment.' : 'Sorry, I could not answer right now. Please try again.'
    return Response.json({ error }, { status: 502 })
  }

  // Convert OpenRouter's server-sent events into a plain text stream for the widget.
  const reader = upstream.body.getReader()
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      let buffer = ''
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            if (!line.startsWith('data: ')) continue // skips ": OPENROUTER PROCESSING" keep-alives
            const data = line.slice(6).trim()
            if (data === '[DONE]') continue
            const chunk = JSON.parse(data)
            if (chunk.error) throw new Error(chunk.error.message || 'OpenRouter stream error')
            const text = chunk.choices?.[0]?.delta?.content
            if (text) controller.enqueue(encoder.encode(text))
          }
        }
      } catch (error) {
        console.error('Chat: stream failed', error)
        controller.enqueue(encoder.encode('\n\nSorry, something went wrong on my side. Please try again or email askmuhammadtayyab786@gmail.com.'))
      } finally {
        controller.close()
      }
    },
    cancel() {
      reader.cancel()
    },
  })

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
}
