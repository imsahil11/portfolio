'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useMotionValueEvent } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const navLinks = [
  { name: 'About', href: '#about', number: '01' },
  { name: 'Work', href: '#work', number: '02' },
  { name: 'Skills', href: '#skills', number: '03' },
  { name: 'Resume', href: '#resume', number: '04' },
  { name: 'Contact', href: '#contact', number: '05' },
]

function MagneticButton({ children, className, onClick, style, onMouseEnter, onMouseLeave }: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  style?: React.CSSProperties
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isTouchDevice || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set((e.clientX - centerX) * 0.25)
    y.set((e.clientY - centerY) * 0.25)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    onMouseLeave?.()
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      style={{ ...style, x: isTouchDevice ? 0 : springX, y: isTouchDevice ? 0 : springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={onMouseEnter}
      whileTap={isTouchDevice ? { scale: 0.92 } : undefined}
    >
      {children}
    </motion.button>
  )
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)
  const [showTrex, setShowTrex] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const lastClickTime = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 60)

      const sections = ['about', 'work', 'skills', 'resume', 'contact']
      let found = ''
      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            found = section
            break
          }
        }
      }
      setActiveSection(found)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogoClick = () => {
    const now = Date.now()
    if (now - lastClickTime.current < 500) {
      setLogoClicks(prev => {
        const newCount = prev + 1
        if (newCount >= 5) {
          setShowTrex(true)
          setTimeout(() => setShowTrex(false), 3000)
          return 0
        }
        return newCount
      })
    } else {
      setLogoClicks(1)
    }
    lastClickTime.current = now
    scrollToTop()
  }

  const scrollToSection = (href: string) => {
    setMobileOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-[1000]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Full-width backdrop bar — only when scrolled */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: scrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            backgroundColor: 'rgba(245, 240, 232, 0.85)',
            backdropFilter: 'blur(24px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.2)',
            borderBottom: '1px solid rgba(212, 206, 196, 0.6)',
          }}
        />

        <div className="relative z-10 flex items-center justify-between h-[72px] px-6 lg:px-[120px]">

          {/* Logo Mark */}
          <MagneticButton
            onClick={handleLogoClick}
            className="relative group"
            style={{
              background: 'none',
              border: 'none',
            }}
          >
            <div className="relative flex items-center">
              {/* Logo monogram with accent border */}
              <motion.div
                className="relative overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '28px',
                    color: 'var(--text)',
                    letterSpacing: '2px',
                    lineHeight: 1,
                  }}
                >
                  SY
                </span>
                {/* Accent dot */}
                <motion.span
                  className="absolute -top-0.5 -right-1.5 w-[6px] h-[6px] rounded-full"
                  style={{ backgroundColor: 'var(--accent)' }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

              {/* Easter egg counter */}
              <AnimatePresence>
                {logoClicks > 0 && logoClicks < 5 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-2 -right-4 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: 'var(--bg)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      fontWeight: 600,
                    }}
                  >
                    {logoClicks}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </MagneticButton>

          {/* Desktop Nav Links — floating pill container */}
          <div className="hidden md:flex items-center">
            <div
              className="flex items-center gap-0.5 px-1.5 py-1.5 rounded-full relative"
              style={{
                backgroundColor: scrolled ? 'transparent' : 'rgba(15, 14, 12, 0.04)',
                border: scrolled ? 'none' : '1px solid rgba(212, 206, 196, 0.5)',
                transition: 'all 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
              }}
            >
              {navLinks.map((link, i) => {
                const isActive = activeSection === link.href.slice(1)
                const isHovered = hoveredLink === i

                return (
                  <MagneticButton
                    key={link.name}
                    onClick={() => scrollToSection(link.href)}
                    onMouseEnter={() => setHoveredLink(i)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className="relative px-4 py-2 rounded-full"
                    style={{
                      background: 'none',
                      border: 'none',
                    }}
                  >
                    {/* Active/hover pill background */}
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isActive ? 1 : isHovered ? 0.6 : 0,
                        scale: isActive || isHovered ? 1 : 0.9,
                      }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      style={{
                        backgroundColor: isActive ? 'var(--text)' : 'rgba(15, 14, 12, 0.06)',
                      }}
                    />

                    <span
                      className="relative z-10 flex items-center gap-1.5"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        fontWeight: isActive ? 500 : 400,
                        color: isActive ? 'var(--bg)' : 'var(--text)',
                        transition: 'color 0.25s ease',
                      }}
                    >
                      <motion.span
                        className="inline-block"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '9px',
                          opacity: isActive ? 0.7 : isHovered ? 0.8 : 0,
                          color: isActive ? 'var(--bg)' : 'var(--accent)',
                          transition: 'opacity 0.25s ease, color 0.25s ease',
                        }}
                      >
                        {link.number}
                      </motion.span>
                      {link.name}
                    </span>
                  </MagneticButton>
                )
              })}
            </div>

            {/* Separator */}
            <motion.div
              className="mx-4 h-5 w-px"
              style={{ backgroundColor: 'var(--border)' }}
              animate={{ opacity: scrolled ? 0.6 : 1 }}
            />

            {/* CTA Button — premium pill style */}
            <motion.a
              href="mailto:im.sahil0111@gmail.com"
              className="relative overflow-hidden rounded-full group flex items-center gap-2 px-5 py-2.5"
              style={{
                backgroundColor: 'var(--text)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--bg)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                textDecoration: 'none',
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-magnetic
            >
              {/* Hover sweep */}
              <motion.span
                className="absolute inset-0 rounded-full origin-left"
                style={{
                  background: 'linear-gradient(90deg, var(--accent) 0%, #FF6B35 100%)',
                }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
              />
              <span className="relative z-10">Let's Talk</span>
              <motion.span
                className="relative z-10"
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </motion.span>
            </motion.a>
          </div>

          {/* Mobile Hamburger — premium version */}
          <MagneticButton
            className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-full"
            onClick={() => setMobileOpen(true)}
            style={{
              background: 'none',
              border: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-col gap-[5px] items-end">
              <motion.span
                className="block h-[1.5px] rounded-full"
                style={{ backgroundColor: 'var(--text)', width: '18px' }}
              />
              <motion.span
                className="block h-[1.5px] rounded-full"
                style={{ backgroundColor: 'var(--text)', width: '12px' }}
              />
            </div>
          </MagneticButton>
        </div>
      </motion.nav>

      {/* Mobile Menu — premium full-screen takeover */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 36px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 36px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 36px) 36px)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[2000] flex flex-col"
            style={{ backgroundColor: 'var(--bg-dark)' }}
          >
            {/* Subtle grid texture */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(245, 240, 232, 0.06) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(245, 240, 232, 0.06) 1px, transparent 1px)
                `,
                backgroundSize: '64px 64px',
              }}
            />

            {/* Mobile header */}
            <div className="relative z-10 flex items-center justify-between px-6 h-[72px]">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '28px',
                  color: 'var(--bg)',
                  letterSpacing: '2px',
                }}
              >
                SY
              </motion.span>

              <motion.button
                onClick={() => setMobileOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-full"
                style={{
                  background: 'none',
                  border: '1px solid rgba(245, 240, 232, 0.15)',
                }}
                whileHover={{ scale: 1.05, borderColor: 'rgba(245, 240, 232, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={18} style={{ color: 'var(--bg)' }} />
              </motion.button>
            </div>

            {/* Nav links — staggered reveal */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-8 lg:px-16">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, x: -60, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: 0.15 + i * 0.08,
                    duration: 0.6,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  onClick={() => scrollToSection(link.href)}
                  className="group text-left py-3 relative"
                  style={{ background: 'none', border: 'none' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: 'var(--accent)',
                        opacity: 0.5,
                        minWidth: '24px',
                      }}
                    >
                      {link.number}
                    </span>
                    <span
                      className="relative inline-block"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(52px, 14vw, 88px)',
                        color: 'var(--bg)',
                        lineHeight: 1,
                        letterSpacing: '2px',
                      }}
                    >
                      {link.name.toUpperCase()}
                      {/* Hover accent underline */}
                      <motion.span
                        className="absolute -bottom-1 left-0 h-[3px] rounded-full"
                        style={{ backgroundColor: 'var(--accent)' }}
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.35 }}
                      />
                    </span>
                  </div>

                  {/* Divider between items */}
                  {i < navLinks.length - 1 && (
                    <motion.div
                      className="mt-3 h-px"
                      style={{ backgroundColor: 'rgba(245, 240, 232, 0.06)' }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Bottom bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="relative z-10 px-8 pb-8 pt-6"
              style={{ borderTop: '1px solid rgba(245, 240, 232, 0.08)' }}
            >
              <div className="flex justify-between items-center">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'rgba(245, 240, 232, 0.35)',
                    letterSpacing: '2px',
                  }}
                >
                  SAHIL YADAV — {new Date().getFullYear()}
                </span>
                <div className="flex gap-3">
                  {[
                    { label: 'GH', href: 'https://github.com/imsahil11' },
                    { label: 'LI', href: 'https://linkedin.com/in/imsahil11' },
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200"
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: 'rgba(245, 240, 232, 0.5)',
                        border: '1px solid rgba(245, 240, 232, 0.12)',
                      }}
                    >
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* T-Rex Easter Egg */}
      <AnimatePresence>
        {showTrex && (
          <motion.div
            className="fixed bottom-4 z-[10000] trex-animation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <svg viewBox="0 0 40 20" width="60" height="30" fill="var(--accent)">
              <rect x="8" y="0" width="4" height="4" />
              <rect x="12" y="0" width="12" height="4" />
              <rect x="20" y="4" width="4" height="2" />
              <rect x="4" y="4" width="20" height="4" />
              <rect x="0" y="8" width="20" height="4" />
              <rect x="4" y="12" width="12" height="4" />
              <rect x="4" y="16" width="4" height="4" />
              <rect x="12" y="16" width="4" height="4" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
