'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Infinity as InfinityIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const statementText = "I build things that actually work. Full stack on the web using the MERN stack. Native on Android using Kotlin. Obsessively precise in Java for DSA. And curious enough to learn whatever comes next."

const stats = [
  { value: 3, suffix: '+', label: 'Years Coding', icon: '{}' },
  { value: 7, suffix: '', label: 'Languages', icon: '</>' },
  { value: 4, suffix: '+', label: 'Projects Shipped', icon: '⚡' },
  { value: null, label: 'Lines Written', icon: <InfinityIcon size={14} />, isInfinity: true },
]

function Counter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!inView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = Date.now()
    const durationMs = duration * 1000
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [inView, value, duration])

  return (
    <span ref={ref}>
      {String(count).padStart(2, '0')}{suffix}
    </span>
  )
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-50px' })
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches)
  }, [])
  
  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="relative p-6 sm:p-8 text-center overflow-hidden"
        style={{
          border: '1px solid var(--border)',
          backgroundColor: isHovered ? 'var(--surface)' : 'transparent',
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* Accent top line — visible on scroll-in for touch, on hover for desktop */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ backgroundColor: 'var(--accent)' }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (isTouchDevice && isInView) || isHovered ? 1 : 0 }}
          transition={{ duration: 0.5, delay: isTouchDevice ? index * 0.15 : 0 }}
        />
        
        {/* Icon */}
        <span
          className="block mb-3 sm:mb-4 transition-transform duration-300"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '14px',
            color: 'var(--accent)',
            opacity: (isTouchDevice && isInView) || isHovered ? 1 : 0.5,
            transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          }}
        >
          {stat.icon}
        </span>

        {/* Value */}
        <div 
          className="flex items-center justify-center"
          style={{ height: 'clamp(50px, 8vw, 80px)' }}
        >
          {stat.isInfinity ? (
            <motion.div
              className="flex justify-center items-center"
              style={{
                color: 'var(--accent)',
              }}
              animate={{
                rotate: isHovered ? 360 : 0,
                scale: (isTouchDevice && isInView) ? [1, 1.1, 1] : 1,
              }}
              transition={
                isHovered 
                  ? { duration: 1.5, ease: 'easeInOut' }
                  : { duration: 2, repeat: isTouchDevice ? Infinity : 0, repeatDelay: 3 }
              }
            >
              <InfinityIcon size="clamp(40px, 5vw, 72px)" width="clamp(40px, 5vw, 72px)" height="clamp(40px, 5vw, 72px)" strokeWidth={1.5} />
            </motion.div>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 5vw, 72px)',
                color: 'var(--text)',
                lineHeight: 1,
                display: 'block',
              }}
            >
              <Counter value={stat.value!} suffix={stat.suffix} />
            </span>
          )}
        </div>
        
        {/* Label */}
        <span
          className="block mt-2 sm:mt-3"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
          }}
        >
          {stat.label}
        </span>

        {/* Corner decoration — always visible on mobile */}
        <div
          className="absolute bottom-2 right-2 transition-opacity duration-300"
          style={{
            width: '16px',
            height: '16px',
            borderRight: '1px solid var(--accent)',
            borderBottom: '1px solid var(--accent)',
            opacity: isTouchDevice ? 0.3 : 0,
          }}
        />
        <div
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            width: '16px',
            height: '16px',
            borderRight: '1px solid var(--accent)',
            borderBottom: '1px solid var(--accent)',
          }}
        />
      </div>
    </motion.div>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLParagraphElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      if (wordsRef.current) {
        const words = wordsRef.current.querySelectorAll('.word')
        
        const isMobile = window.matchMedia('(pointer: coarse)').matches
        
        gsap.fromTo(
          words,
          { opacity: isMobile ? 0 : 0.08, y: isMobile ? 20 : 10 },
          {
            opacity: 1,
            y: 0,
            stagger: isMobile ? 0 : 0.02,
            duration: isMobile ? 1 : undefined,
            ease: 'power2.out',
            scrollTrigger: isMobile ? {
              trigger: wordsRef.current,
              start: 'top 85%',
            } : {
              trigger: wordsRef.current,
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: 0.5,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const words = statementText.split(' ')

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center px-5 md:px-6 lg:px-[120px] py-16 md:py-[120px] overflow-hidden"
      style={{ backgroundColor: 'transparent' }}
    >
      {/* Decorative floating element */}
      <motion.div
        className="absolute right-[10%] top-[20%] w-[300px] h-[300px] rounded-full pointer-events-none hidden lg:block"
        style={{
          border: '1px solid var(--border)',
          opacity: 0.3,
          y,
        }}
      />

      <div ref={containerRef} className="relative max-w-[1100px] mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          className="mb-10 md:mb-16"
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            01 — About Me
          </span>
          <h2
            className="mt-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 80px)',
              color: 'var(--text)',
              lineHeight: 1,
            }}
          >
            WHO I AM
          </h2>
        </motion.div>

        {/* Statement Paragraph with Word Reveal */}
        <div className="relative">
          {/* Quote mark */}
          <span
            className="absolute -left-2 md:-left-4 lg:-left-12 -top-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(80px, 12vw, 120px)',
              color: 'var(--accent)',
              opacity: 0.1,
              lineHeight: 1,
            }}
          >
            "
          </span>
          
          <p
            ref={wordsRef}
            className="relative z-10"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(20px, 3vw, 40px)',
              lineHeight: 1.5,
              color: 'var(--text)',
            }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                className="word inline-block mr-[0.25em]"
                style={{
                  opacity: 0.08,
                  willChange: 'opacity, transform',
                }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Divider with animation */}
        <motion.div
          className="my-12 md:my-20 h-[1px] relative overflow-hidden"
          style={{ backgroundColor: 'var(--border)' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-[100px]"
            style={{
              background: `linear-gradient(90deg, var(--accent) 0%, transparent 100%)`,
            }}
            animate={{ x: ['-100%', '1000%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.div>

        {/* Stats Grid — uniform alignment */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          className="mt-12 md:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <div>
            <h3
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                color: 'var(--text)',
              }}
            >
              BACKGROUND
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--muted)',
                lineHeight: 1.8,
              }}
            >
              Computer Science Engineer with a passion for building products that make a difference.
              Currently focused on full-stack web development and native Android applications.
            </p>
          </div>
          
          <div>
            <h3
              className="mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                color: 'var(--text)',
              }}
            >
              APPROACH
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--muted)',
                lineHeight: 1.8,
              }}
            >
              I believe in writing clean, maintainable code and building user experiences
              that are both beautiful and functional. Every project is an opportunity to learn.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
