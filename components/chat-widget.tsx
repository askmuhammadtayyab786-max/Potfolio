'use client'

import { useEffect, useRef, useState } from 'react'
import { Bot, MessageCircle, Send, X, Mail } from 'lucide-react'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const GREETING: ChatMessage = { role: 'assistant', content: "Hi! I'm Tayyab's AI assistant. Ask me about Tayyab's DevOps and DevSecOps skills, projects, or how to work together." }
const SUGGESTIONS = ['What does Tayyab do?', 'Can Tayyab set up my CI/CD pipeline?', 'Is Tayyab available for hire?']

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => () => abortRef.current?.abort(), [])

  async function send(text: string) {
    const content = text.trim()
    if (!content || streaming) return
    // The greeting is UI-only; the API conversation must start with the visitor.
    const history = [...messages, { role: 'user' as const, content }]
    setMessages([...history, { role: 'assistant', content: '' }])
    setInput('')
    setStreaming(true)

    const appendToReply = (chunk: string) =>
      setMessages((current) => {
        const next = [...current]
        const last = next[next.length - 1]
        next[next.length - 1] = { ...last, content: last.content + chunk }
        return next
      })

    const controller = new AbortController()
    abortRef.current = controller
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(1) }),
        signal: controller.signal,
      })
      if (!response.ok || !response.body) {
        const result = await response.json().catch(() => ({}))
        appendToReply(result.error || 'Sorry, I could not answer right now. Please try again.')
        return
      }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        appendToReply(decoder.decode(value, { stream: true }))
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') appendToReply('Network error — please check your connection and try again.')
    } finally {
      setStreaming(false)
      abortRef.current = null
    }
  }

  function goToContact() {
    setOpen(false)
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={open ? 'chat-widget is-open' : 'chat-widget'}>
      {open && (
        <section className="chat-panel" role="dialog" aria-label="Chat with Tayyab's AI assistant">
          <header className="chat-header">
            <span className="chat-avatar"><Bot size={18} /></span>
            <div><strong>Ask about Tayyab</strong><span><span className="status-dot" /> AI assistant · online</span></div>
            <button type="button" className="chat-icon-btn" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
          </header>

          <div className="chat-log" ref={logRef} aria-live="polite">
            {messages.map((message, index) => (
              <div key={index} className={`chat-bubble from-${message.role}`}>
                {message.content || <span className="chat-typing" aria-label="Assistant is typing"><i /><i /><i /></span>}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((suggestion) => <button type="button" key={suggestion} onClick={() => send(suggestion)}>{suggestion}</button>)}
              </div>
            )}
          </div>

          <form className="chat-form" onSubmit={(event) => { event.preventDefault(); send(input) }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); send(input) } }}
              placeholder="Type your question…"
              rows={1}
              maxLength={2000}
              aria-label="Your message"
            />
            <button type="submit" className="chat-send" disabled={streaming || !input.trim()} aria-label="Send message"><Send size={16} /></button>
          </form>
          <button type="button" className="chat-handoff" onClick={goToContact}><Mail size={13} /> Prefer a human? Send Tayyab a message</button>
        </section>
      )}
      <button type="button" className="chat-launcher" onClick={() => setOpen(!open)} aria-label={open ? 'Close chat' : 'Open AI chat'} aria-expanded={open}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
