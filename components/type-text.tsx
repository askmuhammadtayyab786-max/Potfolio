'use client'

import { Fragment, memo, useEffect, useState, type ElementType } from 'react'
import { useInView } from '@/lib/use-in-view'

export type TypeSegment = { text: string; accent?: boolean }

type TypeTextProps = {
  as?: ElementType
  segments: TypeSegment[]
  className?: string
  speed?: number
  delay?: number
}

// Types its text in once it scrolls into view. The untyped remainder stays in the
// layout (visibility: hidden) so the element never changes size or reflows.
export const TypeText = memo(function TypeText({ as: Tag = 'span', segments, className, speed = 40, delay = 0 }: TypeTextProps) {
  const [ref, inView] = useInView<HTMLElement>(0.3)
  const total = segments.reduce((sum, segment) => sum + segment.text.length, 0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(total)
      return
    }
    let interval = 0
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((current) => {
          if (current + 1 >= total) window.clearInterval(interval)
          return Math.min(current + 1, total)
        })
      }, speed)
    }, delay)
    return () => {
      window.clearTimeout(start)
      window.clearInterval(interval)
    }
  }, [inView, total, speed, delay])

  const typing = count > 0 && count < total
  let offset = 0

  return (
    <Tag ref={ref} className={className}>
      <span className="tw-sr">{segments.map((segment) => segment.text).join('')}</span>
      <span className="tw-wrap" aria-hidden="true">
        {segments.map((segment, index) => {
          const shown = Math.max(0, Math.min(segment.text.length, count - offset))
          const caretHere = typing && count > offset && count <= offset + segment.text.length
          offset += segment.text.length
          const body = (
            <>
              {segment.text.slice(0, shown)}
              {caretHere && <span className="tw-caret" />}
              {shown < segment.text.length && <span className="tw-rest">{segment.text.slice(shown)}</span>}
            </>
          )
          return segment.accent ? <span key={index}>{body}</span> : <Fragment key={index}>{body}</Fragment>
        })}
      </span>
    </Tag>
  )
})
