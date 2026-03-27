'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'

type Mood = 'idle' | 'wave' | 'code' | 'sleep' | 'excited' | 'peek' | 'coffee' | 'think'

// ─── Orb Face SVG — premium floating AI companion ──────────────────
function OrbFace({ mood, blink }: { mood: Mood; blink: boolean }) {
  const renderEyes = () => {
    if (blink && mood !== 'sleep') {
      return (
        <>
          <line x1="16" y1="25" x2="22" y2="25" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="28" y1="25" x2="34" y2="25" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )
    }
    switch (mood) {
      case 'sleep':
        return (
          <>
            <line x1="16" y1="25" x2="22" y2="25" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="28" y1="25" x2="34" y2="25" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )
      case 'excited':
        return (
          <>
            <motion.circle cx="19" cy="25" r="3" fill="none" stroke="#FF4500" strokeWidth="1.2"
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
            <circle cx="19" cy="25" r="1.5" fill="#FF4500" />
            <motion.circle cx="31" cy="25" r="3" fill="none" stroke="#FF4500" strokeWidth="1.2"
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }} />
            <circle cx="31" cy="25" r="1.5" fill="#FF4500" />
          </>
        )
      case 'code':
        return (
          <>
            <rect x="15" y="22" width="8" height="5" rx="1" fill="none" stroke="#FF4500" strokeWidth="1" />
            <line x1="17" y1="24.5" x2="21" y2="24.5" stroke="#FF4500" strokeWidth="0.8" />
            <rect x="27" y="22" width="8" height="5" rx="1" fill="none" stroke="#FF4500" strokeWidth="1" />
            <line x1="29" y1="24.5" x2="33" y2="24.5" stroke="#FF4500" strokeWidth="0.8" />
          </>
        )
      case 'wave':
      case 'coffee':
        return (
          <>
            <path d="M16 24 Q19 28 22 24" fill="none" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 24 Q31 28 34 24" fill="none" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )
      case 'peek':
        return (
          <>
            <circle cx="19" cy="25" r="2.5" fill="#FF4500" />
            <circle cx="19.5" cy="24.5" r="0.8" fill="#0F0E0C" />
            <line x1="28" y1="25" x2="34" y2="25" stroke="#FF4500" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )
      case 'think':
        return (
          <>
            <circle cx="19" cy="24" r="2.5" fill="#FF4500" />
            <circle cx="20" cy="23.5" r="0.8" fill="#0F0E0C" />
            <circle cx="31" cy="24" r="2.5" fill="#FF4500" />
            <circle cx="32" cy="23.5" r="0.8" fill="#0F0E0C" />
          </>
        )
      default:
        return (
          <>
            <circle cx="19" cy="25" r="2.5" fill="#FF4500" />
            <circle cx="31" cy="25" r="2.5" fill="#FF4500" />
          </>
        )
    }
  }

  return (
    <svg viewBox="0 0 50 50" width="48" height="48" className="overflow-visible">
      <defs>
        <radialGradient id="orb-grad" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="rgba(255,69,0,0.12)" />
          <stop offset="100%" stopColor="rgba(15,14,12,0)" />
        </radialGradient>
        <radialGradient id="orb-inner" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a1918" />
          <stop offset="100%" stopColor="#0F0E0C" />
        </radialGradient>
      </defs>
      <circle cx="25" cy="25" r="23" fill="none" stroke="rgba(255,69,0,0.15)" strokeWidth="0.5" />
      <circle cx="25" cy="25" r="20" fill="url(#orb-inner)" />
      <circle cx="25" cy="25" r="20" fill="url(#orb-grad)" />
      <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,69,0,0.25)" strokeWidth="0.8" />
      <path d="M14 17 Q25 10 36 17" fill="none" stroke="rgba(245,240,232,0.06)" strokeWidth="0.5" />
      {renderEyes()}
      <motion.circle cx="25" cy="33" r="1" fill="#FF4500"
        animate={{ opacity: mood === 'sleep' ? [0.2, 0.5, 0.2] : [0.4, 1, 0.4], scale: mood === 'excited' ? [1, 1.5, 1] : 1 }}
        transition={{ duration: mood === 'sleep' ? 3 : 1.5, repeat: Infinity }}
      />
      {mood === 'sleep' && (
        <motion.g animate={{ opacity: [0, 0.8, 0], y: [0, -6, -12] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <text x="36" y="16" fontSize="7" fill="rgba(255,69,0,0.5)" fontFamily="monospace" fontWeight="bold">z</text>
          <text x="39" y="11" fontSize="5.5" fill="rgba(255,69,0,0.35)" fontFamily="monospace">z</text>
        </motion.g>
      )}
      {mood === 'think' && (
        <motion.g animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <circle cx="40" cy="12" r="1.5" fill="rgba(255,69,0,0.2)" />
          <circle cx="43" cy="7" r="2.5" fill="rgba(255,69,0,0.15)" />
        </motion.g>
      )}
      {mood === 'coffee' && (
        <g transform="translate(36, 28)">
          <rect x="0" y="0" width="7" height="8" rx="1.5" fill="rgba(255,69,0,0.3)" stroke="rgba(255,69,0,0.5)" strokeWidth="0.5" />
          <path d="M7 2.5 Q9 2.5 9 5 Q9 7.5 7 7.5" fill="none" stroke="rgba(255,69,0,0.4)" strokeWidth="0.5" />
          <motion.path d="M2.5 -1 Q3.5 -3 2.5 -5" fill="none" stroke="rgba(255,69,0,0.3)" strokeWidth="0.5"
            animate={{ opacity: [0.2, 0.6, 0.2], y: [0, -1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </g>
      )}
    </svg>
  )
}

// ─── Speech Bubble ──────────────────────────────────────────────────
function SpeechBubble({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="absolute bottom-full mb-2 right-0 whitespace-nowrap"
      style={{
        backgroundColor: 'rgba(15,14,12,0.92)',
        color: '#F5F0E8',
        fontFamily: 'var(--font-mono)',
        fontSize: '9px',
        padding: '6px 10px',
        borderRadius: '8px 8px 2px 8px',
        border: '1px solid rgba(255,69,0,0.15)',
        letterSpacing: '0.5px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        maxWidth: '160px',
        whiteSpace: 'normal',
        lineHeight: 1.4,
        backdropFilter: 'blur(12px)',
      }}
    >
      {text}
    </motion.div>
  )
}

// ─── Command Terminal Panel ─────────────────────────────────────────
const COMMANDS: Record<string, { label: string; desc: string }> = {
  snake:  { label: 'SNAKE',  desc: 'Classic snake game' },
  pong:   { label: 'PONG',   desc: 'Retro pong match' },
  memory: { label: 'MEMORY', desc: 'Match the tech pairs' },
  matrix: { label: 'MATRIX', desc: 'Enter the matrix' },
  party:  { label: 'PARTY',  desc: 'Confetti mode' },
  coffee: { label: 'COFFEE', desc: 'Brew a cup' },
  hello:  { label: 'HELLO',  desc: 'Say hi' },
  hire:   { label: 'HIRE',   desc: 'Contact card' },
  '42':   { label: '42',     desc: 'Answer to everything' },
}

function CommandTerminal({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<{ cmd: string; response: string }[]>([])
  const [showHint, setShowHint] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    const timer = setTimeout(() => setShowHint(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [history])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    if (trimmed === 'help') {
      setHistory(prev => [...prev, {
        cmd,
        response: Object.entries(COMMANDS).map(([k, v]) => `${v.label.padEnd(8)} ${v.desc}`).join('\n')
      }])
      setInput('')
      return
    }

    if (trimmed === 'clear') {
      setHistory([])
      setInput('')
      return
    }

    if (trimmed === 'exit' || trimmed === 'close') {
      onClose()
      return
    }

    if (COMMANDS[trimmed]) {
      // Dispatch command event for EasterEggs to handle directly
      window.dispatchEvent(new CustomEvent('terminal-command', { detail: { command: trimmed } }))

      setHistory(prev => [...prev, {
        cmd,
        response: `> Executing ${COMMANDS[trimmed].label}...`
      }])
    } else {
      setHistory(prev => [...prev, {
        cmd,
        response: `Unknown command: "${trimmed}". Type "help" for commands.`
      }])
    }

    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="absolute bottom-full mb-3 right-0"
      style={{
        width: '260px',
        backgroundColor: 'rgba(15,14,12,0.96)',
        border: '1px solid rgba(255,69,0,0.15)',
        borderRadius: '12px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,69,0,0.05)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid rgba(255,69,0,0.08)' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#FF4500', opacity: 0.8 }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,69,0,0.3)' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,69,0,0.15)' }} />
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'rgba(255,69,0,0.5)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Terminal
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center justify-center w-4 h-4 rounded-sm transition-colors"
          style={{ color: 'rgba(245,240,232,0.3)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#FF4500'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(245,240,232,0.3)'}
        >
          <svg width="8" height="8" viewBox="0 0 8 8">
            <line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Output area */}
      <div ref={scrollRef} className="px-3 py-2 overflow-y-auto" style={{ maxHeight: '160px', minHeight: '50px' }}>
        {history.length === 0 && showHint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', color: 'rgba(245,240,232,0.25)', lineHeight: 1.6 }}
          >
            Type &quot;help&quot; for available commands
          </motion.div>
        )}

        {history.map((entry, i) => (
          <div key={i} style={{ marginBottom: '6px' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8.5px', color: '#FF4500', lineHeight: 1.5 }}>
              <span style={{ opacity: 0.4, marginRight: '4px' }}>{'>'}</span>
              {entry.cmd}
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              color: 'rgba(245,240,232,0.4)',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              paddingLeft: '10px',
            }}>
              {entry.response}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center px-3 py-2 gap-1.5" style={{ borderTop: '1px solid rgba(255,69,0,0.08)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#FF4500', opacity: 0.6 }}>$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') executeCommand(input)
            if (e.key === 'Escape') onClose()
            e.stopPropagation()
          }}
          maxLength={20}
          className="flex-1 bg-transparent outline-none"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            color: '#F5F0E8',
            caretColor: '#FF4500',
            letterSpacing: '0.5px',
          }}
          placeholder="type a command..."
          autoComplete="off"
          spellCheck={false}
        />
        <motion.div
          className="w-1 h-3 rounded-sm"
          style={{ backgroundColor: '#FF4500' }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
}

// ─── Messages per section ───────────────────────────────────────────
const sectionMessages: Record<string, string[]> = {
  hero:    ['Welcome, explorer.', 'Scroll to begin.', 'Initiating...', 'Systems online.'],
  about:   ['Analyzing dev profile...', 'Credentials verified.', 'Reading bio...'],
  work:    ['Scanning projects...', 'Impressive builds.', 'Compiling results...'],
  skills:  ['Tech stack loaded.', 'Processing skills...', 'Diverse capabilities.'],
  contact: ['Ready to connect.', 'Awaiting transmission.', 'Open channel.'],
}

const idleMessages = [
  'Click me for terminal.',
  'Monitoring...',
  'Standing by.',
  'Try the terminal.',
  '↑↑↓↓←→←→BA',
  'I have secrets.',
  'Idle mode.',
  'Processing...',
]

// ─── Floating Orb Companion ─────────────────────────────────────────
export default function Mascot() {
  const [mood, setMood] = useState<Mood>('idle')
  const [blink, setBlink] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [currentSection, setCurrentSection] = useState('hero')
  const [terminalOpen, setTerminalOpen] = useState(false)

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const messageTimer = useRef<NodeJS.Timeout | null>(null)
  const idleTimer = useRef<NodeJS.Timeout | null>(null)
  const lastSection = useRef('hero')
  const y = useMotionValue(0)
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  const showMessage = useCallback((text: string, duration = 3000) => {
    if (messageTimer.current) clearTimeout(messageTimer.current)
    setMessage(text)
    messageTimer.current = setTimeout(() => setMessage(null), duration)
  }, [])

  // Blinking
  useEffect(() => {
    if (isMobile) return
    const blinkLoop = () => {
      const next = 2500 + Math.random() * 4000
      setTimeout(() => {
        setBlink(true)
        setTimeout(() => setBlink(false), 120)
        blinkLoop()
      }, next)
    }
    blinkLoop()
  }, [])

  // Idle mood cycling
  useEffect(() => {
    const scheduleIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        if (!isHovered && !terminalOpen) {
          const rand = Math.random()
          if (rand < 0.25) {
            setMood('sleep')
            showMessage('Low power mode.', 4000)
          } else if (rand < 0.45) {
            setMood('think')
            showMessage(idleMessages[Math.floor(Math.random() * idleMessages.length)], 3500)
          } else if (rand < 0.6) {
            setMood('coffee')
            showMessage('Refueling...', 3000)
          } else {
            setMood('idle')
          }
        }
        scheduleIdle()
      }, 10000 + Math.random() * 15000)
    }
    scheduleIdle()
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current) }
  }, [isHovered, terminalOpen, showMessage])

  // Section detection
  useEffect(() => {
    const sections = ['hero', 'about', 'work', 'skills', 'contact']
    const detectSection = () => {
      const viewportMid = window.innerHeight / 2
      for (const id of sections) {
        const el = id === 'hero' ? document.querySelector('section') : document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
            if (lastSection.current !== id) {
              lastSection.current = id
              setCurrentSection(id)
              const msgs = sectionMessages[id]
              if (msgs) {
                const moodMap: Record<string, Mood> = { hero: 'wave', about: 'peek', work: 'excited', skills: 'code', contact: 'wave' }
                setMood(moodMap[id] || 'idle')
                showMessage(msgs[Math.floor(Math.random() * msgs.length)])
                setTimeout(() => setMood('idle'), 4000)
              }
            }
            break
          }
        }
      }
    }
    window.addEventListener('scroll', detectSection, { passive: true })
    return () => window.removeEventListener('scroll', detectSection)
  }, [showMessage])

  // Easter egg event listener
  useEffect(() => {
    const handleEasterEgg = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (!detail) return
      switch (detail.type) {
        case 'game':
          setMood('excited'); showMessage('Game initialized.', 3000)
          setTimeout(() => setMood('idle'), 4000); break
        case 'party':
          setMood('excited'); showMessage('Celebration mode!', 3000)
          setTimeout(() => setMood('idle'), 4000); break
        case 'coffee':
          setMood('coffee'); showMessage('Caffeine detected.', 3500)
          setTimeout(() => setMood('idle'), 5000); break
        case 'matrix':
          setMood('code'); showMessage('Decoding reality...', 3000)
          setTimeout(() => setMood('idle'), 4000); break
        case 'konami':
          setMood('excited'); showMessage('Cheat code accepted.', 4000)
          setTimeout(() => setMood('idle'), 5000); break
        default:
          setMood('peek'); showMessage('Signal detected.', 2500)
          setTimeout(() => setMood('idle'), 3000)
      }
    }
    window.addEventListener('mascot-react', handleEasterEgg)
    return () => window.removeEventListener('mascot-react', handleEasterEgg)
  }, [showMessage])

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!terminalOpen) {
      setMood('wave')
      showMessage('Click to open terminal.', 2500)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!terminalOpen) setTimeout(() => setMood('idle'), 500)
  }

  const handleOrbClick = () => {
    if (terminalOpen) {
      setTerminalOpen(false)
      setMood('idle')
    } else {
      setTerminalOpen(true)
      setMood('code')
      setMessage(null)
    }
  }

  // Bounce on section change
  useEffect(() => {
    y.set(-6)
    const timeout = setTimeout(() => y.set(0), 300)
    return () => clearTimeout(timeout)
  }, [currentSection, y])

  if (isMobile) return null

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[990]"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 3, type: 'spring', stiffness: 200, damping: 15 }}
      style={{ y: springY }}
    >
      {/* Command terminal */}
      <AnimatePresence>
        {terminalOpen && (
          <CommandTerminal onClose={() => { setTerminalOpen(false); setMood('idle') }} />
        )}
      </AnimatePresence>

      {/* Speech bubble (hidden when terminal is open) */}
      <AnimatePresence>
        {message && !terminalOpen && <SpeechBubble text={message} />}
      </AnimatePresence>

      {/* Orb container */}
      <motion.div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleOrbClick}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{ inset: '-8px', background: 'radial-gradient(circle, rgba(255,69,0,0.08) 0%, transparent 70%)' }}
          animate={{
            opacity: terminalOpen ? 0.7 : mood === 'excited' ? [0.6, 1, 0.6] : mood === 'sleep' ? 0.15 : 0.4,
            scale: mood === 'excited' ? [1, 1.15, 1] : 1,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Orbiting particle ring */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: terminalOpen ? 6 : 12, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute w-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(255,69,0,0.4)', top: '-2px', left: '50%', transform: 'translateX(-50%)' }} />
          <div className="absolute w-0.5 h-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,69,0,0.25)', bottom: '2px', right: '-1px' }} />
        </motion.div>

        {/* Floating animation */}
        <motion.div
          animate={{ y: mood === 'sleep' ? [0, 3, 0] : [0, -3, 0] }}
          transition={{ duration: mood === 'sleep' ? 4 : 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <OrbFace mood={mood} blink={blink} />
        </motion.div>

        {/* Section label */}
        <motion.div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: terminalOpen ? 0.6 : 0.3 }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '6px',
            color: 'var(--accent)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}>
            {terminalOpen ? 'CMD' : currentSection === 'hero' ? 'SYS' : currentSection.slice(0, 3).toUpperCase()}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
