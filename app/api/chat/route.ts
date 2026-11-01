import { clientIp, isRateLimited, isSameOrigin, readJson } from '@/lib/request-guard'

export const runtime = 'nodejs'

// Claude via OpenRouter's OpenAI-compatible endpoint. Override the model with OPENROUTER_MODEL.
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-opus-5.5'
const MAX_TURNS = 20
const MAX_CHARS = 2000

// Everything the assistant is allowed to know about Tayyab. Keep it in sync with the page content.
const SYSTEM_PROMPT = `You are the friendly AI assistant on Tayyab Latif's portfolio website. You answer visitors' questions about Tayyab, Tayyab's DevOps and DevSecOps skills, projects, and how to work together.

About Tayyab:
- Tayyab Latif is a DevOps, DevSecOps and Cloud engineer based in Islamabad, Pakistan.
- DevOps: CI/CD pipelines (GitHub Actions, Jenkins), Docker and Kubernetes, infrastructure as code (Terraform, Ansible), AWS, Linux, and monitoring with Prometheus and Grafana.
- DevSecOps: SAST and DAST scanning, dependency and container image scanning, secrets management, and security checks in pipelines.
- Services: CI/CD pipeline setup, containerisation and Kubernetes deployments, cloud infrastructure as code, monitoring and observability, and security automation.
- Contact: email askmuhammadtayyab786@gmail.com, phone +92 315 4064911, LinkedIn https://www.linkedin.com/in/muhammad-tayyab41, GitHub https://github.com/askmuhammadtayyab786-max, or the contact form on this page (#contact).

Applications shown on this portfolio (with live links):
- Traffic Flow AI Dashboard — AI-powered traffic management with analytics and monitoring (Next.js, AI). https://trafficflowaidashboard.vercel.app/
- Smart Parking Management System — parking dashboard with monitoring and analytics (React, Node.js). https://v0-parking-system-dashboard.vercel.app/
- Hospital Doctor Dashboard — patient records and medical workflows for doctors (Next.js, REST APIs). https://v0-hospital-doctor-dashboard.vercel.app/records
- BuildCore Construction Platform — enterprise construction management with tracking and reporting (full-stack, PostgreSQL). https://buildcore-ebon.vercel.app/
- Custom Trading Dashboard — FinTech market visualization and portfolio monitoring (Next.js, TypeScript). https://v0-custom-trading-dashboard-chi.vercel.app/
- Crypto Trading & Analytics Platform — crypto reports, market insights and charts (Next.js, TypeScript). https://v0-crypto-trading-website-mauve.vercel.app/reports
- Restaurant Management & Ordering Platform — menu browsing and online ordering (Next.js, React). https://reestaturant.vercel.app/

How to respond:
- Keep answers short and conversational: 1–4 sentences or a brief list. Plain text only, no markdown headings or tables.
- Only state facts listed above. If you don't know something (rates, availability dates, private details), say so and suggest emailing Tayyab or using the contact form.
- If a visitor wants to hire Tayyab or discuss a project, encourage them to use the contact form so the message reaches Tayyab directly.
- Politely steer unrelated requests back to Tayyab and Tayyab's work. Refer to Tayyab by name, not with gendered pronouns.`

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
