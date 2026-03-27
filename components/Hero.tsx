'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function FloatingShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute rounded-full opacity-[0.03] w-[200px] h-[200px] md:w-[300px] md:h-[300px]"
        style={{
          border: '1px solid var(--text)',
          right: '10%',
          top: '20%',
        }}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 40, repeat: Infinity, ease: 'linear' },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute top-[15%] left-[8%] opacity-[0.08] hidden md:block"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M0 20 L0 0 L20 0" fill="none" stroke="var(--text)" strokeWidth="1" />
          <path d="M40 60 L60 60 L60 40" fill="none" stroke="var(--text)" strokeWidth="1" />
        </svg>
      </motion.div>
    </div>
  )
}

function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState(text)
  const [isScrambling, setIsScrambling] = useState(false)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScrambling(true)
      let iteration = 0
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' '
              if (i < iteration) return text[i]
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )
        iteration += 1 / 3
        if (iteration >= text.length) {
          clearInterval(interval)
          setDisplayText(text)
          setIsScrambling(false)
        }
      }, 30)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timer)
  }, [text, delay])

  return (
    <span className="text-scramble" style={{ opacity: isScrambling ? 0.8 : 1 }}>
      {displayText}
    </span>
  )
}

function useParallax(strength: number = 0.02) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springConfig = { stiffness: 100, damping: 30 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches

    if (isTouch) {
      // Disable device orientation parallax on mobile as it causes severe performance and battery drain
      return
    }

    const handleMouse = (e: MouseEvent) => {
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      x.set((e.clientX - centerX) * strength)
      y.set((e.clientY - centerY) * strength)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [x, y, strength])

  return { x: springX, y: springY }
}

export default function Hero({ isLoaded }: { isLoaded: boolean }) {
  const bgNumberRef = useRef<HTMLSpanElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const parallax = useParallax(0.02)
  const deepParallax = useParallax(0.04)

  useEffect(() => {
    if (!isLoaded) return

    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return // Disable scrub on mobile for performance

    const ctx = gsap.context(() => {
      if (bgNumberRef.current) {
        gsap.to(bgNumberRef.current, {
          y: 150,
          opacity: 0,
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.3,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [isLoaded])

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 1.2,
      },
    },
  }

  const lineVariants = {
    hidden: { y: '100%' },
    visible: {
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  }

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  }

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex flex-col justify-between overflow-hidden px-5 md:px-6 lg:px-[120px] py-8 grid-overlay"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <FloatingShapes />

      {/* Background Number with parallax */}
      <motion.span
        ref={bgNumberRef}
        style={{ x: deepParallax.x, y: deepParallax.y }}
        className="absolute right-[-20px] bottom-0 pointer-events-none select-none"
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(200px, 35vw, 520px)',
            color: 'var(--text)',
            opacity: 0.025,
            lineHeight: 0.8,
            display: 'block',
          }}
        >
          01
        </span>
      </motion.span>

      {/* Accent blob */}
      <motion.div
        className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] blob pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 69, 0, 0.08) 0%, transparent 70%)',
          right: '10%',
          top: '30%',
          x: parallax.x,
          y: parallax.y,
        }}
      />

      {/* Top Row */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="pt-20 flex justify-between items-center"
      >
        <p
          className="hidden sm:block"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
          }}
        >
          <ScrambleText text={`SAHIL YADAV — DEVELOPER — ${new Date().getFullYear()}`} delay={1500} />
        </p>
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 2 }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--muted)' }}>
            Available for work
          </span>
        </motion.div>
      </motion.div>

      {/* Middle Block */}
      <div className="relative flex-1 flex items-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? 'visible' : 'hidden'}
          className="w-full"
          style={{ x: parallax.x, y: parallax.y }}
        >
          {/* Headline Line 1 */}
          <div className="overflow-hidden">
            <motion.h1 variants={lineVariants}>
              <span
                className="block"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(56px, 12vw, 200px)',
                  color: 'var(--text)',
                  lineHeight: 0.9,
                }}
              >
                FULL STACK
              </span>
            </motion.h1>
          </div>

          {/* Headline Line 2 */}
          <div className="overflow-hidden flex items-baseline gap-2 md:gap-4">
            <motion.h1 variants={lineVariants} className="flex items-baseline flex-wrap">
              <span
                className="gradient-text inline-block"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(56px, 12vw, 200px)',
                  lineHeight: 0.9,
                }}
              >
                &amp;
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(56px, 12vw, 200px)',
                  color: 'var(--text)',
                  lineHeight: 0.9,
                  marginLeft: '0.1em',
                }}
              >
                ANDROID
              </span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 2, duration: 0.5 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(56px, 12vw, 200px)',
                  color: 'var(--accent)',
                  lineHeight: 0.9,
                }}
              >
                .
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants}
            className="mt-6 mb-4 lg:hidden"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--muted)',
              maxWidth: '360px',
              lineHeight: 1.6,
            }}
          >
            Building digital experiences that blend form with function.
          </motion.p>
        </motion.div>

        {/* Right Descriptor with card effect */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block"
          style={{ maxWidth: '260px' }}
        >
          <div
            className="p-6 relative overflow-hidden"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="shimmer absolute inset-0" />
            <span
              className="block mb-4"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--accent)',
                letterSpacing: '2px',
              }}
            >
              TECH STACK
            </span>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                lineHeight: 1.9,
                color: 'var(--text)',
              }}
            >
              MERN Stack · Kotlin · Java
            </p>
            <p
              className="mt-2"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                lineHeight: 1.6,
                color: 'var(--muted)',
              }}
            >
              BTech CSE — Class of 2023
            </p>
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <span
                className="flex items-center gap-2"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--muted)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
                Currently: Building.
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 z-10"
        style={{ borderTop: '1px solid var(--border)' }}
      >

        <div className="flex gap-6">
          {[
            { label: 'github', href: 'https://github.com/imsahil11', value: 'imsahil11' },
            { label: 'linkedin', href: 'https://linkedin.com/in/imsahil11', value: 'imsahil11' },
          ].map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              data-magnetic
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                }}
              >
                {link.label}/
              </span>
              <span
                className="animated-underline"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text)',
                }}
              >
                {link.value}
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>


    </section>
  )
}
