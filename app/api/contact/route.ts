import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

const OWNER_EMAIL = process.env.CONTACT_TO_EMAIL || 'askmuhammadtayyab786@gmail.com'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
}

// Rough "Browser on OS" label from the user agent; good enough for an inquiry email.
function describeDevice(userAgent: string) {
  const browser = /Edg\//.test(userAgent) ? 'Edge' : /OPR\//.test(userAgent) ? 'Opera' : /Chrome\//.test(userAgent) ? 'Chrome' : /Firefox\//.test(userAgent) ? 'Firefox' : /Safari\//.test(userAgent) ? 'Safari' : ''
  const os = /Android/.test(userAgent) ? 'Android' : /iPhone|iPad/.test(userAgent) ? 'iOS' : /Windows/.test(userAgent) ? 'Windows' : /Mac OS X/.test(userAgent) ? 'macOS' : /Linux/.test(userAgent) ? 'Linux' : ''
  const kind = /Mobi|iPhone|Android/.test(userAgent) ? 'mobile' : 'desktop'
  return browser && os ? `${browser} on ${os} (${kind})` : 'Unknown device'
}

function emailShell(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#080d18;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#f5f7ff">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#11182a;border:1px solid #27304a;border-radius:16px;overflow:hidden">
      <tr><td style="height:4px;background:linear-gradient(90deg,#7466f6,#a596ff)"></td></tr>
      <tr><td style="padding:32px">
        <p style="margin:0 0 6px;color:#8b7cff;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Tayyab Latif · Portfolio</p>
        <h1 style="margin:0 0 20px;font-size:24px;letter-spacing:-.02em;color:#f5f7ff">${title}</h1>
        ${body}
      </td></tr>
      <tr><td style="padding:18px 32px;border-top:1px solid #27304a;color:#a8b0c5;font-size:12px">DevOps · DevSecOps · Cloud engineer</td></tr>
    </table>
  </td></tr></table></body></html>`
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof payload.company === 'string' && payload.company.trim()) {
    return Response.json({ ok: true })
  }

  const name = String(payload.name ?? '').trim().slice(0, 120)
  const email = String(payload.email ?? '').trim().slice(0, 200)
  const message = String(payload.message ?? '').trim().slice(0, 5000)

  if (name.length < 2) return Response.json({ error: 'Please enter your name.' }, { status: 422 })
  if (!EMAIL_PATTERN.test(email)) return Response.json({ error: 'Please enter a valid email address.' }, { status: 422 })
  if (message.length < 10) return Response.json({ error: 'Please write a slightly longer message (10+ characters).' }, { status: 422 })

  // Gmail (app password) by default; any SMTP provider when SMTP_HOST is set.
  const smtpHost = process.env.SMTP_HOST
  const user = smtpHost ? process.env.SMTP_USER : process.env.GMAIL_USER
  const pass = smtpHost ? process.env.SMTP_PASS : process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    console.error('Contact form: email credentials (GMAIL_USER / GMAIL_APP_PASSWORD or SMTP_*) are not configured.')
    return Response.json({ error: 'Email service is not configured yet.', fallback: true }, { status: 503 })
  }

  const smtpPort = Number(process.env.SMTP_PORT || 587)
  const transporter = smtpHost
    ? nodemailer.createTransport({ host: smtpHost, port: smtpPort, secure: smtpPort === 465, auth: { user, pass } })
    : nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
  const safeName = escapeHtml(name)
  const firstName = name.split(/\s+/)[0]
  const safeFirstName = escapeHtml(firstName)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  // Submission context so the inquiry email shows where and when it came from.
  const sentAt = new Date().toLocaleString('en-US', { timeZone: process.env.CONTACT_TIMEZONE || 'Asia/Karachi', dateStyle: 'full', timeStyle: 'short' })
  const page = String(payload.page ?? request.headers.get('referer') ?? '').slice(0, 300) || 'Unknown'
  const device = describeDevice(request.headers.get('user-agent') || '')
  const details: [string, string][] = [['Name', name], ['Email', email], ['Sent', sentAt], ['From page', page], ['Device', device], ['Message length', `${message.length} characters`]]
  const detailRows = details.map(([label, value]) => {
    const safeValue = escapeHtml(value)
    const shown = label === 'Email' ? `<a href="mailto:${safeValue}" style="color:#afa7ff">${safeValue}</a>` : label === 'From page' && /^https?:\/\//.test(value) ? `<a href="${safeValue}" style="color:#afa7ff">${safeValue}</a>` : safeValue
    return `<tr><td style="padding:8px 12px 8px 0;color:#a8b0c5;width:120px;vertical-align:top;border-bottom:1px solid #27304a">${label}</td><td style="padding:8px 0;color:#f5f7ff;font-weight:700;border-bottom:1px solid #27304a;word-break:break-word">${shown}</td></tr>`
  }).join('')

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to: OWNER_EMAIL,
      replyTo: `"${name.replace(/"/g, '')}" <${email}>`,
      subject: `New project inquiry from ${name}`,
      text: `${details.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\nMessage:\n${message}`,
      html: emailShell('New project inquiry', `
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-bottom:20px;font-size:14px">
          ${detailRows}
        </table>
        <p style="margin:0 0 8px;color:#a8b0c5;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase">Message</p>
        <div style="padding:18px;border-radius:12px;background:#080d18;border:1px solid #27304a;color:#d8dcea;font-size:15px;line-height:1.6">${safeMessage}</div>
        <p style="margin:22px 0 0"><a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: your project inquiry`)}" style="display:inline-block;padding:12px 22px;border-radius:9px;background:#7466f6;color:#ffffff;font-weight:700;font-size:14px;text-decoration:none">Reply to ${safeName}</a></p>`),
    })

    await transporter.sendMail({
      from: `"Tayyab Latif" <${user}>`,
      to: email,
      replyTo: OWNER_EMAIL,
      subject: 'Thanks for reaching out — I received your message',
      text: `Hi ${firstName},\n\nThanks for getting in touch! I've received your message and will reply within 24–48 hours.\n\nYour message:\n${message}\n\n— Tayyab Latif\nDevOps & DevSecOps Engineer`,
      html: emailShell(`Thanks for reaching out, ${safeFirstName}!`, `
        <p style="margin:0 0 16px;color:#d8dcea;font-size:15px;line-height:1.65">I've received your message and will get back to you within <strong style="color:#f5f7ff">24–48 hours</strong>. Here's a copy of what you sent:</p>
        <div style="padding:18px;border-radius:12px;background:#080d18;border:1px solid #27304a;color:#a8b0c5;font-size:14px;line-height:1.6">${safeMessage}</div>
        <p style="margin:22px 0 0;color:#d8dcea;font-size:15px">Talk soon,<br><strong style="color:#f5f7ff">Tayyab Latif</strong></p>`),
    })
  } catch (error) {
    console.error('Contact form: failed to send email', error)
    return Response.json({ error: 'Your message could not be sent right now.', fallback: true }, { status: 502 })
  }

  return Response.json({ ok: true })
}
