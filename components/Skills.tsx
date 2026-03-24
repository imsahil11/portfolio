'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

interface MarqueeProps {
  items: { name: string; icon?: string }[]
  speed: number
  direction: 'left' | 'right'
  accentIndex?: number
}

function Marquee({ items, speed, direction, accentIndex = -1 }: MarqueeProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const animationClass = direction === 'left' ? 'marquee-left' : 'marquee-right'

  return (
    <div
      className="marquee-wrapper overflow-hidden py-6 relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false)
        setHoveredIndex(null)
      }}
    >
      {/* Gradient masks */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[100px] z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, var(--bg-dark) 0%, transparent 100%)',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-[100px] z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(270deg, var(--bg-dark) 0%, transparent 100%)',
        }}
      />

      <div
        className={`flex whitespace-nowrap ${animationClass}`}
        style={{
          ['--marquee-duration' as string]: `${speed}s`,
          animationPlayState: isPaused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {[...items, ...items].map((item, i) => {
          const actualIndex = i % items.length
          const isAccent = actualIndex === accentIndex
          const isHovered = hoveredIndex === actualIndex
          const isDimmed = hoveredIndex !== null && !isHovered

          return (
            <span
              key={i}
              className="flex items-center group"
              onMouseEnter={() => setHoveredIndex(actualIndex)}
            >
              <motion.span
                className="relative px-2"
                animate={{
                  scale: isHovered ? 1.1 : 1,
                  opacity: isDimmed ? 0.3 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(40px, 5vw, 70px)',
                    color: isAccent || isHovered ? 'var(--accent)' : 'var(--bg)',
                    transition: 'color 0.3s ease',
                    textShadow: isHovered ? '0 0 30px rgba(255, 69, 0, 0.5)' : 'none',
                  }}
                >
                  {item.name}
                </span>
                
                {/* Underline on hover */}
                <motion.span
                  className="absolute bottom-0 left-2 right-2 h-[2px]"
                  style={{ backgroundColor: 'var(--accent)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.span>
              
              {/* Separator */}
              <span
                className="mx-4 lg:mx-8 flex items-center justify-center"
                style={{
                  color: 'var(--accent)',
                  fontSize: 'clamp(16px, 2vw, 24px)',
                  opacity: 0.6,
                }}
              >
                <motion.span
                  animate={{ rotate: isHovered ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  ◆
                </motion.span>
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

const row1Items = [
  { name: "REACT.JS" },
  { name: "NODE.JS" },
  { name: "MONGODB" },
  { name: "EXPRESS.JS" },
  { name: "NEXT.JS" },
  { name: "TYPESCRIPT" },
]

const row2Items = [
  { name: "KOTLIN" },
  { name: "ANDROID SDK" },
  { name: "JETPACK COMPOSE" },
  { name: "FLUTTER" },
  { name: "ANDROID" },
]

const row3Items = [
  { name: "JAVA" },
  { name: "C++" },
  { name: "PYTHON" },
  { name: "PHP" },
  { name: "GIT" },
  { name: "GITHUB" },
  { name: "VS CODE" },
]

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-[120px] overflow-hidden z-0"
      style={{ backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Animated background grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{ y: backgroundY }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern id="skills-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--bg)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#skills-grid)" />
        </svg>
      </motion.div>

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ zIndex: 1 }}
      >
        <svg width="100%" height="100%">
          <filter id="skills-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#skills-noise)" />
        </svg>
      </div>

      {/* Section Header */}
      <div className="px-6 lg:px-[120px] mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
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
            03 — Expertise
          </span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mt-4">
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(48px, 6vw, 80px)',
                color: 'var(--bg)',
                lineHeight: 1,
              }}
            >
              TECH STACK
            </h2>
            <p
              className="mt-4 lg:mt-0 max-w-[400px]"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'rgba(245, 240, 232, 0.5)',
                lineHeight: 1.6,
              }}
            >
              Technologies I work with daily. Hover to explore.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Category Labels */}
      <div className="px-6 lg:px-[120px] mb-4 relative z-10">
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'rgba(245, 240, 232, 0.3)',
            textTransform: 'uppercase',
            letterSpacing: '3px',
          }}
        >
          WEB DEVELOPMENT
        </motion.span>
      </div>

      {/* Marquee Rows */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Marquee items={row1Items} speed={40} direction="left" accentIndex={0} />
        </motion.div>

        {/* Category Label */}
        <div className="px-6 lg:px-[120px] my-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'rgba(245, 240, 232, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '3px',
            }}
          >
            MOBILE DEVELOPMENT
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Marquee items={row2Items} speed={30} direction="right" accentIndex={0} />
        </motion.div>

        {/* Category Label */}
        <div className="px-6 lg:px-[120px] my-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'rgba(245, 240, 232, 0.3)',
              textTransform: 'uppercase',
              letterSpacing: '3px',
            }}
          >
            LANGUAGES & TOOLS
          </motion.span>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Marquee items={row3Items} speed={50} direction="left" accentIndex={0} />
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-20 right-20 hidden lg:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 0.1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.8 }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--bg)" strokeWidth="1" strokeDasharray="8 8" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
        </svg>
      </motion.div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, var(--bg-dark) 100%)',
        }}
      />
    </section>
  )
}
