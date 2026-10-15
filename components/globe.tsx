'use client'

import { useEffect, useRef } from 'react'
import { AtomOrbits } from '@/components/atom-orbits'

// Decorative dotted globe that spins 360° on a canvas, floats up and down, and is wrapped by atom orbits.
export function Globe({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const size = 420
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    // Fibonacci sphere points
    const count = 900
    const points = Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const theta = Math.PI * (3 - Math.sqrt(5)) * i
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r }
    })

    const accent = getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#d6ff4b'
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const radius = size * 0.34
    const tilt = 0.4
    let angle = 0
    let frame = 0

    const draw = () => {
      ctx.clearRect(0, 0, size, size)
      const cosA = Math.cos(angle), sinA = Math.sin(angle)
      const cosT = Math.cos(tilt), sinT = Math.sin(tilt)
      for (const p of points) {
        const x1 = p.x * cosA + p.z * sinA
        const z1 = -p.x * sinA + p.z * cosA
        const y2 = p.y * cosT - z1 * sinT
        const z2 = p.y * sinT + z1 * cosT
        const depth = (z2 + 1) / 2
        ctx.globalAlpha = 0.12 + depth * 0.88
        ctx.fillStyle = accent
        ctx.beginPath()
        ctx.arc(size / 2 + x1 * radius, size / 2 + y2 * radius, 0.8 + depth * 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      angle += 0.006
      if (!reduced) frame = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className={`globe ${className}`} aria-hidden="true">
      <div className="globe-glow" />
      <canvas ref={canvasRef} className="globe-canvas" />
      <AtomOrbits className="globe-atoms" />
    </div>
  )
}
