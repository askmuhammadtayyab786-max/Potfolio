// Best-effort, per-instance abuse guards shared by the API routes. On serverless hosts each instance
// keeps its own counters, so pair this with the provider's firewall / spend limits.

const buckets = new Map<string, { count: number; reset: number }>()
const MAX_BUCKETS = 5000

export function clientIp(request: Request) {
  return request.headers.get('x-real-ip')?.trim() || request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local'
}

/** Returns true when `key` has used up `limit` hits inside the current `windowMs` window. */
export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  if (buckets.size > MAX_BUCKETS) {
    for (const [name, entry] of buckets) if (entry.reset < now) buckets.delete(name)
    if (buckets.size > MAX_BUCKETS) buckets.clear()
  }
  const entry = buckets.get(key)
  if (!entry || entry.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return false
  }
  entry.count += 1
  return entry.count > limit
}

/** Rejects cross-site browser requests (CSRF / third-party abuse). Non-browser clients send no Origin and are allowed. */
export function isSameOrigin(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin) return true
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

/** Reads a JSON body, refusing anything larger than `maxBytes`. Returns null when invalid or too large. */
export async function readJson(request: Request, maxBytes: number): Promise<Record<string, unknown> | null> {
  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > maxBytes) return null
  const text = await request.text().catch(() => '')
  if (!text || text.length > maxBytes) return null
  try {
    const parsed = JSON.parse(text)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}
