'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// ─── Scramble Text Effect ───────────────────────────────────────────
function ScrambleText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState(text)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const hasTriggered = useRef(false)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&'
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const scramble = useCallback(() => {
    let iteration = 0
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ') return ' '
          if (i < iteration) return text[i]
          return chars[Math.floor(Math.random() * chars.length)]
        }).join('')
      )
      iteration += 1 / 2
      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplay(text)
      }
    }, 30)
  }, [text])

  useEffect(() => {
    if (isInView && !hasTriggered.current) {
      hasTriggered.current = true
      scramble()
    }
  }, [isInView, scramble])

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  return (
    <span
      ref={ref}
      className={className}
      style={style}
      onMouseEnter={() => { setIsHovered(true); scramble() }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {display}
    </span> 
  )
}

// ─── Live Clock Widget ──────────────────────────────────────────────
function LiveClock() {
  const [time, setTime] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!loaded) return null

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: '#22c55e' }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(245,240,232,0.4)', letterSpacing: '1px' }}>
        {time}
      </span>
    </div>
  )
}

// ─── Interactive Status Board ───────────────────────────────────────
function StatusBoard() {
  const [clickCount, setClickCount] = useState(0)
  const [activeStatus, setActiveStatus] = useState(0)

  const statuses = [
    { label: 'STATUS', value: 'AVAILABLE FOR WORK' },
    { label: 'FOCUS', value: 'BUILDING COOL STUFF' },
    { label: 'MOOD', value: 'CAFFEINATED' },
    { label: 'STACK', value: 'REACT + NEXT.JS' },
    { label: 'LEVEL', value: 'OVER 9000' },
  ]

  useEffect(() => {
    const cycle = setInterval(() => {
      setActiveStatus(prev => (prev + 1) % statuses.length)
    }, 3000)
    return () => clearInterval(cycle)
  }, [statuses.length])

  const handleClick = () => {
    setClickCount(prev => prev + 1)
    setActiveStatus(prev => (prev + 1) % statuses.length)
  }

  return (
    <motion.div
      className="cursor-pointer select-none"
      onClick={handleClick}
      whileTap={{ scale: 0.97 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStatus}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent)', letterSpacing: '2px', opacity: 0.6 }}>
            {statuses[activeStatus].label}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(245,240,232,0.5)', letterSpacing: '1px' }}>
            {statuses[activeStatus].value}
          </span>
        </motion.div>
      </AnimatePresence>
      {clickCount >= 5 && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          style={{ fontFamily: 'var(--font-mono)', fontSize: '7px', color: 'var(--accent)', display: 'block', marginTop: '4px' }}
        >
          {clickCount} clicks — you&apos;re persistent.
        </motion.span>
      )}
    </motion.div>
  )
}

// ─── Signal Line (animated connection) ──────────────────────────────
function SignalLine() {
  return (
    <div className="relative w-full h-[1px] overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(245,240,232,0.06)' }} />
      <motion.div
        className="absolute top-0 left-0 h-full w-24"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,69,0,0.3), transparent)' }}
        animate={{ x: ['-100px', 'calc(100vw + 100px)'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
      />
    </div>
  )
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const isInView = useInView(footerRef, { once: true })
  const currentYear = new Date().getFullYear()

  return (
    <footer
      ref={footerRef}
      className="relative px-5 md:px-6 lg:px-[120px] py-12 md:py-16 overflow-hidden"
      style={{ backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Background ghost text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 0.02 } : { opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(200px, 30vw, 500px)',
            color: 'var(--bg)',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          SAHIL
        </motion.span>
      </div>

      {/* Top section — interactive headline */}
      <motion.div
        className="relative z-10 mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center">
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'rgba(245,240,232,0.4)',
            letterSpacing: '3px',
            marginBottom: '16px',
          }}>
            SIGNAL RECEIVED
          </p>
          <a href="mailto:im.sahil0111@gmail.com" className="group inline-block relative">
            <ScrambleText
              text="DROP A SIGNAL"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 8vw, 100px)',
                color: 'var(--bg)',
                lineHeight: 1,
                cursor: 'pointer',
                display: 'inline-block',
              }}
            />
            <motion.span
              className="absolute -bottom-2 left-0 right-0 h-[3px] origin-left"
              style={{ backgroundColor: 'var(--accent)' }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />
          </a>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'rgba(245,240,232,0.25)',
              marginTop: '12px',
              letterSpacing: '1px',
            }}
          >
            im.sahil0111@gmail.com
          </motion.p>
        </div>
      </motion.div>

      {/* Signal line divider */}
      <motion.div
        className="relative z-10 mb-12"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SignalLine />
      </motion.div>

      {/* Middle section — status + clock */}
      <motion.div
        className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 mb-12"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.5 }}
      >
        <StatusBoard />
        <LiveClock />
      </motion.div>

      {/* Second divider */}
      <motion.div
        className="relative z-10 h-[1px] mb-12"
        style={{ backgroundColor: 'rgba(245,240,232,0.06)' }}
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />

      {/* Bottom section */}
      <motion.div
        className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.7 }}
      >
        {/* Left — Logo & Copyright */}
        <div className="flex flex-col items-center lg:items-start gap-2">
          <ScrambleText
            text="SY"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              color: 'var(--bg)',
              cursor: 'pointer',
            }}
          />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'rgba(245,240,232,0.4)',
            letterSpacing: '1px',
          }}>
            © {currentYear} SAHIL YADAV
          </span>
        </div>

        {/* Center — Navigation */}
        <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
          {['Work', 'About', 'Skills', 'Contact'].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="group relative"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'rgba(245,240,232,0.6)',
                  transition: 'color 0.3s ease',
                }}
                className="group-hover:text-[var(--bg)]"
              >
                {item}
              </span>
              <span
                className="absolute -bottom-1 left-0 w-0 h-[1px] group-hover:w-full transition-all duration-300"
                style={{ backgroundColor: 'var(--accent)' }}
              />
            </motion.a>
          ))}
        </div>

        {/* Right — Social Links */}
        <div className="flex gap-4">
          {[
            { label: 'GH', href: 'https://github.com/imsahil11' },
            { label: 'LI', href: 'https://linkedin.com/in/imsahil11' },
          ].map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 flex items-center justify-center relative overflow-hidden group"
              style={{ border: '1px solid rgba(245,240,232,0.2)' }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.9 + i * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
            >
              <span
                className="absolute inset-0 origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"
                style={{ backgroundColor: 'var(--accent)' }}
              />
              <span
                className="relative z-10 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(245,240,232,0.6)' }}
              >
                <span className="group-hover:text-[var(--bg-dark)]">{social.label}</span>
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>

      {/* Bottom credits */}
      <motion.div
        className="relative z-10 mt-12 text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1 }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: 'rgba(245,240,232,0.25)',
        }}>
          CRAFTED PIXEL BY PIXEL — {currentYear}
        </span>
      </motion.div>

      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 left-8 w-12 h-12 z-40 flex items-center justify-center"
        style={{ backgroundColor: 'var(--accent)', border: 'none' }}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        data-magnetic
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          color: 'var(--bg)',
          transform: 'rotate(-90deg)',
        }}>
          →
        </span>
      </motion.button>
    </footer>
  )
}
