'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, Sparkles, MessageCircle, X } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const initialMessages: Message[] = [
  {
    role: 'assistant',
    content: "Hey! I'm Sahil's AI. Ask me about his projects, tech stack, or anything else. I'll answer exactly as he would.",
  },
]

const quickQuestions = [
  "What's WinGuardPro?",
  "Strongest skill?",
  "Open to internships?",
  "Tech stack?",
]

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: 'var(--accent)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: 'var(--accent)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: 'var(--accent)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
      />
    </div>
  )
}

function MessageBubble({ message, index }: { message: Message; index: number }) {
  const isUser = message.role === 'user'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <Sparkles size={14} color="var(--bg)" />
        </div>
      )}
      <motion.div
        whileHover={{ scale: 1.01 }}
        style={{
          maxWidth: '80%',
          padding: '14px 18px',
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          lineHeight: 1.6,
          backgroundColor: isUser ? 'var(--accent)' : 'rgba(255, 255, 255, 0.08)',
          color: isUser ? 'var(--bg)' : 'rgba(245, 240, 232, 0.95)',
          borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        {message.content}
      </motion.div>
    </motion.div>
  )
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input.trim()
    if (!messageToSend || isLoading) return

    const userMessage: Message = { role: 'user', content: messageToSend }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const conversationHistory = newMessages.slice(1).map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversationHistory }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send message')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        assistantMessage += chunk

        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantMessage }
          return updated
        })
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: error instanceof Error ? error.message : "Sorry, something went wrong. Try again?",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <section
        id="chat"
        ref={sectionRef}
        className="relative px-6 lg:px-[120px] py-[120px] overflow-hidden"
        style={{ backgroundColor: 'var(--bg)' }}
      >
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.03]"
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
          />
        </div>

        {/* Section Heading */}
        <motion.div
          className="max-w-[680px] mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        >
          <span
            className="block mb-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            04 — AI Assistant
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(60px, 8vw, 120px)',
              color: 'var(--text)',
              lineHeight: 0.95,
              margin: 0,
            }}
          >
            ASK ME
            <br />
            <span className="gradient-text">ANYTHING</span>.
          </h2>
          <p
            className="mt-8 max-w-[500px]"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '17px',
              color: 'var(--muted)',
              lineHeight: 1.8,
            }}
          >
            I built an AI version of myself. Ask it about my projects, my stack, what I'm building — or just say hi.
          </p>
        </motion.div>

        {/* Chat Card */}
        <motion.div
          className="max-w-[720px] mx-auto relative"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 0.2 }}
        >
          {/* Glow effect behind card */}
          <div
            className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl pointer-events-none"
            style={{ background: 'linear-gradient(135deg, var(--accent) 0%, transparent 50%)' }}
          />

          <div
            className="relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-dark)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            {/* Card Header */}
            <div
              className="flex justify-between items-center px-8 py-5"
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    <Sparkles size={18} color="var(--bg)" />
                  </div>
                  <motion.div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                    style={{ backgroundColor: '#4ADE80', borderColor: 'var(--bg-dark)' }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <span
                    className="block"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      fontWeight: 500,
                      color: 'var(--bg)',
                    }}
                  >
                    AI Sahil
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'rgba(245, 240, 232, 0.4)',
                    }}
                  >
                    Online • Responds instantly
                  </span>
                </div>
              </div>
              <span
                className="px-3 py-1.5 rounded-full"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'rgba(245, 240, 232, 0.5)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                Claude
              </span>
            </div>

            {/* Messages Area */}
            <div
              className="h-[380px] overflow-y-auto chat-scrollbar px-8 py-6"
              style={{ scrollBehavior: 'smooth' }}
            >
              <AnimatePresence>
                {messages.map((message, i) => (
                  <MessageBubble key={i} message={message} index={i} />
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex justify-start"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    <Sparkles size={14} color="var(--bg)" />
                  </div>
                  <div
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '20px 20px 20px 4px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <TypingIndicator />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && (
              <div className="px-8 pb-4">
                <span
                  className="block mb-3"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'rgba(245, 240, 232, 0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Try asking:
                </span>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, i) => (
                    <motion.button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="px-4 py-2 rounded-full transition-colors duration-200"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'rgba(245, 240, 232, 0.7)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                      whileHover={{
                        backgroundColor: 'rgba(255, 69, 0, 0.2)',
                        borderColor: 'rgba(255, 69, 0, 0.3)',
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {q}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Row */}
            <div
              className="flex items-center gap-4 px-8 py-5"
              style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Sahil..."
                className="flex-1 bg-transparent outline-none placeholder:text-[rgba(245,240,232,0.3)]"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  color: 'var(--bg)',
                  border: 'none',
                }}
              />
              <motion.button
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="flex items-center justify-center disabled:opacity-30"
                style={{
                  width: '44px',
                  height: '44px',
                  backgroundColor: 'var(--accent)',
                  borderRadius: '12px',
                  border: 'none',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight size={18} color="var(--bg)" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Floating Chat Button (Mobile/Minimized) */}
      <motion.button
        className="fixed right-6 bottom-6 lg:right-24 lg:bottom-8 w-14 h-14 rounded-full z-50 flex items-center justify-center shadow-lg"
        style={{
          backgroundColor: 'var(--accent)',
          border: 'none',
        }}
        onClick={() => {
          setIsExpanded(!isExpanded)
          if (!isExpanded) {
            setTimeout(() => inputRef.current?.focus(), 100)
          }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} color="var(--bg)" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle size={24} color="var(--bg)" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ border: '2px solid var(--accent)' }}
          animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    </>
  )
}
