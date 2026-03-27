'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Download, Eye, Play, Pause } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const RESUME_DRIVE_URL = 'https://drive.google.com/file/d/12z5MuPRcGi7RMlifLPSax8FCKOtLgv0J/view?usp=sharing'

const trackList = [
  {
    side: 'A1',
    title: 'Full Stack Development',
    duration: '3:45',
    subtitle: 'End-to-end web applications with production-grade architecture',
    highlights: ['REST APIs & Auth Systems', 'Real-time Features', 'Database Design'],
    tech: ['React', 'Node.js', 'MongoDB', 'Next.js'],
  },
  {
    side: 'A2',
    title: 'Android Engineering',
    duration: '2:30',
    subtitle: 'Native Android apps built with modern Kotlin patterns',
    highlights: ['Jetpack Compose UI', 'MVVM Architecture', 'Material Design 3'],
    tech: ['Kotlin', 'Android SDK', 'Jetpack Compose'],
  },
  {
    side: 'B1',
    title: 'Problem Solving & DSA',
    duration: '4:12',
    subtitle: '500+ problems solved with optimized algorithmic thinking',
    highlights: ['Competitive Coding', 'System Design', 'Time Complexity Analysis'],
    tech: ['Java', 'C++', 'Python'],
  },
  {
    side: 'B2',
    title: 'Security & DevOps',
    duration: '2:58',
    subtitle: 'Cybersecurity awareness and deployment automation',
    highlights: ['Auth & Encryption', 'CI/CD Pipelines', 'Cloud Deployment'],
    tech: ['Git', 'Docker', 'Flask', 'OpenCV'],
  },
]

function EqualizerBars({ active }: { active: boolean }) {
  return (
    <div className="flex items-end gap-[2px]" style={{ height: '14px' }}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: '2px',
            backgroundColor: 'var(--accent)',
            borderRadius: '1px',
          }}
          animate={{
            height: active
              ? [`${4 + Math.random() * 8}px`, `${2 + Math.random() * 12}px`, `${4 + Math.random() * 8}px`]
              : '3px',
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.3,
            repeat: active ? Infinity : 0,
            repeatType: 'reverse',
            delay: i * 0.06,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

function VinylRecord({ isPlaying, isSlid }: { isPlaying: boolean; isSlid: boolean }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  return (
    <motion.div
      className="relative"
      style={{
        width: 'clamp(200px, 60vw, 400px)',
        aspectRatio: '1',
      }}
      animate={{
        x: isMobile ? '0px' : (isSlid ? 'clamp(-100px, -12vw, -160px)' : '0px'),
      }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="w-full h-full rounded-full relative overflow-hidden"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={
          isPlaying
            ? { duration: 6, repeat: Infinity, ease: 'linear' }
            : { type: 'spring', stiffness: 40, damping: 30 }
        }
        style={{
          background: `radial-gradient(circle at 50% 50%, 
            #1a1918 0%, 
            #121110 15%, 
            #1a1918 16%, 
            #0f0e0d 30%, 
            #171615 31%, 
            #121110 60%, 
            #1a1918 61%, 
            #0f0e0d 100%
          )`,
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Groove rings */}
        {Array.from({ length: 22 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              inset: `${5 + i * 1.8}%`,
              border: `0.5px solid rgba(245, 240, 232, ${i % 4 === 0 ? 0.055 : 0.02})`,
            }}
          />
        ))}

        {/* Vinyl sheen — realistic light catch */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'conic-gradient(from 200deg, transparent 0%, rgba(255,255,255,0.03) 15%, transparent 30%, transparent 100%)',
          }}
        />

        {/* Center label */}
        <div
          className="absolute rounded-full overflow-hidden"
          style={{
            inset: '30%',
            background: 'linear-gradient(145deg, var(--accent) 0%, #c23500 60%, #FF6B35 100%)',
            boxShadow: 'inset 0 1px 8px rgba(0,0,0,0.2), 0 0 0 2px rgba(0,0,0,0.3)',
          }}
        >
          {/* Label texture lines */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,0,0,0.2) 1px, rgba(0,0,0,0.2) 2px)',
            }}
          />

          {/* Label content — name above hole, subtitle below */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Name — positioned above center */}
            <div className="relative z-10 flex flex-col items-center" style={{ marginBottom: 'clamp(8px, 1.2vw, 14px)' }}>
              <span
                className="block text-center"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(15px, 1.8vw, 22px)',
                  color: 'var(--bg)',
                  letterSpacing: '5px',
                  lineHeight: 1.2,
                }}
              >
                SAHIL
              </span>
              <span
                className="block text-center"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(15px, 1.8vw, 22px)',
                  color: 'var(--bg)',
                  letterSpacing: '5px',
                  lineHeight: 1.2,
                }}
              >
                YADAV
              </span>
            </div>

            {/* Center spindle hole */}
            <div
              className="w-[10%] h-[10%] rounded-full shrink-0"
              style={{
                backgroundColor: 'var(--bg-dark)',
                boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.2)',
              }}
            />

            {/* Subtitle — below hole */}
            <span
              className="relative z-10 block text-center"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'clamp(5px, 0.55vw, 7px)',
                color: 'rgba(15, 14, 12, 0.45)',
                letterSpacing: '2px',
                marginTop: 'clamp(4px, 0.6vw, 8px)',
              }}
            >
              RÉSUMÉ · {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Ambient glow */}
      <motion.div
        className="absolute inset-[-20%] rounded-full pointer-events-none"
        animate={{
          opacity: isPlaying ? [0.3, 0.5, 0.3] : 0.15,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'radial-gradient(circle, rgba(255, 69, 0, 0.08) 0%, transparent 60%)',
        }}
      />
    </motion.div>
  )
}

function RecordSleeve({
  isHovered,
  playingTrack,
  onTrackClick,
}: {
  isHovered: boolean
  playingTrack: number
  onTrackClick: (index: number) => void
}) {
  const sleeveRef = useRef<HTMLDivElement>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [3, -3])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-3, 3])
  const springRotateX = useSpring(rotateX, { stiffness: 150, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    setIsTouchDevice(isTouch)

    if (!isTouch) return

    let t = 0
    let raf = 0
    const autoTilt = () => {
      t += 0.015
      mouseX.set(Math.sin(t) * 0.2)
      mouseY.set(Math.cos(t * 0.7) * 0.15)
      raf = requestAnimationFrame(autoTilt)
    }
    raf = requestAnimationFrame(autoTilt)
    return () => cancelAnimationFrame(raf)
  }, [mouseX, mouseY])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isTouchDevice || !sleeveRef.current) return
    const rect = sleeveRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }, [mouseX, mouseY, isTouchDevice])

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY, isTouchDevice])

  return (
    <motion.div
      ref={sleeveRef}
      className="relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: isTouchDevice ? '100%' : 'clamp(280px, 34vw, 420px)',
        maxWidth: isTouchDevice ? '400px' : undefined,
        aspectRatio: '1',
        backgroundColor: '#141312',
        border: '1px solid rgba(212, 206, 196, 0.08)',
        padding: 'clamp(24px, 3vw, 40px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        perspective: '800px',
        rotateX: springRotateX,
        rotateY: springRotateY,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Inner glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(255, 69, 0, 0.04) 0%, transparent 60%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245, 240, 232, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 240, 232, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Shimmer */}
      <div className="shimmer absolute inset-0 pointer-events-none" />

      {/* Top section */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '8px',
              color: 'var(--accent)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Limited Press · {new Date().getFullYear()}
          </span>
          <EqualizerBars active={isHovered} />
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            color: 'var(--bg)',
            lineHeight: 0.95,
            letterSpacing: '3px',
          }}
        >
          GREATEST
        </h3>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            color: 'var(--bg)',
            lineHeight: 0.95,
            letterSpacing: '3px',
          }}
        >
          <span className="gradient-text">HITS</span>
        </h3>

        <p
          className="mt-3"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(11px, 1.1vw, 13px)',
            color: 'rgba(245, 240, 232, 0.35)',
            lineHeight: 1.5,
            maxWidth: '280px',
          }}
        >
          Full Stack Developer · Android Engineer · Problem Solver
        </p>
      </div>

      {/* Track list — interactive */}
      <div className="relative z-10 flex flex-col">
        <span
          className="mb-3"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '8px',
            color: 'rgba(245, 240, 232, 0.2)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          Tracklist
        </span>
        {trackList.map((track, i) => {
          const isActive = playingTrack === i

          return (
            <div key={track.side}>
              <motion.button
                onClick={() => onTrackClick(i)}
                className="flex items-center gap-3 py-2 w-full text-left"
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? 'none' : '1px solid rgba(245, 240, 232, 0.04)',
                }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <span
                  className="flex items-center justify-center"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: isActive ? 'var(--accent)' : 'rgba(245, 240, 232, 0.3)',
                    minWidth: '22px',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {isActive ? (
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      ▶
                    </motion.span>
                  ) : (
                    track.side
                  )}
                </span>

                <span
                  className="flex-1"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(11px, 1.1vw, 13px)',
                    color: isActive ? 'var(--bg)' : 'rgba(245, 240, 232, 0.55)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {track.title}
                </span>

                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    color: isActive ? 'var(--accent)' : 'rgba(245, 240, 232, 0.15)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {track.duration}
                </span>
              </motion.button>

              {/* Expandable detail panel */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                    className="overflow-hidden"
                    style={{ borderBottom: '1px solid rgba(245, 240, 232, 0.04)' }}
                  >
                    <div className="pb-3 pl-[34px]">
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '11px',
                          color: 'rgba(245, 240, 232, 0.45)',
                          lineHeight: 1.5,
                          marginBottom: '8px',
                        }}
                      >
                        {track.subtitle}
                      </motion.p>

                      <div className="flex flex-col gap-1.5 mb-2">
                        {track.highlights.map((h, j) => (
                          <motion.div
                            key={h}
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 + j * 0.07 }}
                          >
                            <span
                              style={{
                                width: '3px',
                                height: '3px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent)',
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '9px',
                                color: 'rgba(245, 240, 232, 0.6)',
                                letterSpacing: '0.5px',
                              }}
                            >
                              {h}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {track.tech.map((t, j) => (
                          <motion.span
                            key={t}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.25 + j * 0.05 }}
                            className="px-2 py-0.5"
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '8px',
                              color: 'var(--accent)',
                              border: '1px solid rgba(255, 69, 0, 0.25)',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {t}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex items-center justify-between pt-3" style={{ borderTop: '1px solid rgba(245, 240, 232, 0.06)' }}>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '7px',
            color: 'rgba(245, 240, 232, 0.15)',
            letterSpacing: '2px',
          }}
        >
          SY RECORDS · SIDE A
        </span>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--accent)' }}
            animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '7px',
              color: 'rgba(245, 240, 232, 0.2)',
              letterSpacing: '1px',
            }}
          >
            PDF · 1.2MB
          </span>
        </div>
      </div>

      {/* Corner decorations */}
      <div
        className="absolute top-3 right-3 transition-opacity duration-300"
        style={{
          width: '16px',
          height: '16px',
          borderTop: `1px solid ${isHovered ? 'var(--accent)' : 'rgba(245, 240, 232, 0.08)'}`,
          borderRight: `1px solid ${isHovered ? 'var(--accent)' : 'rgba(245, 240, 232, 0.08)'}`,
          transition: 'border-color 0.4s ease',
        }}
      />
      <div
        className="absolute bottom-3 left-3 transition-opacity duration-300"
        style={{
          width: '16px',
          height: '16px',
          borderBottom: `1px solid ${isHovered ? 'var(--accent)' : 'rgba(245, 240, 232, 0.08)'}`,
          borderLeft: `1px solid ${isHovered ? 'var(--accent)' : 'rgba(245, 240, 232, 0.08)'}`,
          transition: 'border-color 0.4s ease',
        }}
      />
    </motion.div>
  )
}

export default function Resume() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const compositionRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isSlid, setIsSlid] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [playingTrack, setPlayingTrack] = useState(0)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
          }
        )
      }

      if (compositionRef.current) {
        ScrollTrigger.create({
          trigger: compositionRef.current,
          start: 'top 70%',
          onEnter: () => {
            setTimeout(() => setIsSlid(true), 400)
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleDownload = () => {
    window.open(RESUME_DRIVE_URL, '_blank', 'noopener,noreferrer')
  }

  const handleView = () => {
    window.open(RESUME_DRIVE_URL, '_blank', 'noopener,noreferrer')
  }

  const handleTrackClick = (index: number) => {
    setPlayingTrack(index)
    setIsPlaying(true)
  }

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev)
  }

  return (
    <section
      id="resume"
      ref={sectionRef}
      className="relative py-16 md:py-[140px] overflow-hidden"
      style={{ backgroundColor: 'var(--bg-dark)' }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="resume-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--bg)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#resume-grid)" />
        </svg>
      </div>

      {/* Large accent glow center */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(255, 69, 0, 0.05) 0%, transparent 65%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Section Header */}
      <div className="px-5 md:px-6 lg:px-[120px] mb-10 md:mb-20 relative z-10">
        <div ref={headerRef} style={{ opacity: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            04 — Resume
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
              THE RECORD
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
              Every skill, every experience, every milestone — pressed into one record.
              Drop the needle and explore, or take the full album home.
            </p>
          </div>
        </div>
      </div>

      {/* Main Composition — Vinyl + Sleeve */}
      <div
        ref={compositionRef}
        className="relative z-10 px-5 md:px-6 lg:px-[120px] flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Vinyl Record */}
        <motion.div
          className="relative z-20"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <VinylRecord isPlaying={isPlaying} isSlid={isSlid} />
        </motion.div>

        {/* Record Sleeve */}
        <motion.div
          className="relative z-30 mt-0 lg:ml-[-60px] w-full lg:w-auto flex justify-center lg:block"
          initial={{ opacity: 0, x: 80 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <RecordSleeve
            isHovered={isHovered}
            playingTrack={playingTrack}
            onTrackClick={handleTrackClick}
          />
        </motion.div>
      </div>

      {/* Controls & CTA Row */}
      <motion.div
        className="relative z-10 mt-10 md:mt-16 px-5 md:px-6 lg:px-[120px]"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        {/* Play controls + buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Play/Pause toggle */}
          <motion.button
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden group"
            style={{
              border: '1px solid rgba(245, 240, 232, 0.15)',
              backgroundColor: 'transparent',
            }}
            whileHover={{ scale: 1.1, borderColor: 'rgba(255, 69, 0, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            data-cursor="view"
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <AnimatePresence mode="wait">
              {isPlaying ? (
                <motion.span
                  key="pause"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  className="relative z-10"
                >
                  <Pause size={16} style={{ color: 'var(--bg)' }} />
                </motion.span>
              ) : (
                <motion.span
                  key="play"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  className="relative z-10"
                >
                  <Play size={16} style={{ color: 'var(--bg)' }} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Divider */}
          <div className="hidden sm:block h-8 w-px" style={{ backgroundColor: 'rgba(245, 240, 232, 0.1)' }} />

          {/* Download Button — primary */}
          <button
            onClick={handleDownload}
            className="group relative"
            data-magnetic
            data-cursor="view"
            data-cursor-text="GET"
          >
            <div className="relative overflow-hidden" style={{ padding: '1px' }}>
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0%, var(--accent) 25%, transparent 50%, var(--accent) 75%, transparent 100%)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <div
                className="relative flex items-center justify-center gap-3 px-6 sm:px-8 py-4"
                style={{ backgroundColor: 'var(--bg-dark)' }}
              >
                <div
                  className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100"
                  style={{
                    backgroundColor: 'var(--accent)',
                    transition: 'transform 0.5s cubic-bezier(0.76,0,0.24,1)',
                  }}
                />
                <Download
                  size={16}
                  className="relative z-10 transition-colors duration-300"
                  style={{ color: 'var(--accent)' }}
                />
                <span
                  className="relative z-10 transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '16px',
                    letterSpacing: '3px',
                    color: 'var(--bg)',
                  }}
                >
                  DOWNLOAD CV
                </span>
              </div>
            </div>
          </button>

          {/* View Button — secondary */}
          <button
            onClick={handleView}
            className="group relative flex items-center justify-center gap-3 px-6 sm:px-8 py-4 overflow-hidden"
            style={{
              border: '1px solid rgba(245, 240, 232, 0.12)',
              backgroundColor: 'transparent',
            }}
            data-magnetic
            data-cursor="view"
            data-cursor-text="VIEW"
          >
            <div
              className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100"
              style={{
                backgroundColor: 'rgba(245, 240, 232, 0.06)',
                transition: 'transform 0.5s cubic-bezier(0.76,0,0.24,1)',
              }}
            />
            <Eye size={16} style={{ color: 'rgba(245, 240, 232, 0.5)' }} className="relative z-10" />
            <span
              className="relative z-10"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '16px',
                letterSpacing: '3px',
                color: 'rgba(245, 240, 232, 0.6)',
              }}
            >
              VIEW CV
            </span>
            <motion.span
              className="relative z-10"
              style={{ color: 'rgba(245, 240, 232, 0.4)' }}
              animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowUpRight size={14} />
            </motion.span>
          </button>
        </div>

        {/* Now playing text */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-3"
          animate={{ opacity: isPlaying ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: 'var(--accent)' }}
            animate={isPlaying ? { opacity: [1, 0.3, 1], scale: [1, 0.8, 1] } : { opacity: 0.3 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '3px',
              color: 'rgba(245, 240, 232, 0.35)',
            }}
          >
            {isPlaying ? `NOW PLAYING · ${trackList[playingTrack].side} — ${trackList[playingTrack].title.toUpperCase()}` : 'PAUSED'}
          </span>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-20 right-16 hidden lg:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 0.06, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ delay: 1.2 }}
      >
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="65" fill="none" stroke="var(--bg)" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="70" cy="70" r="45" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.4" />
          <circle cx="70" cy="70" r="25" fill="none" stroke="var(--bg)" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="70" cy="70" r="8" fill="none" stroke="var(--accent)" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-32 left-12 hidden lg:block"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.05 } : { opacity: 0 }}
        transition={{ delay: 1.5 }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          <path d="M0 20 L0 0 L20 0" fill="none" stroke="var(--bg)" strokeWidth="1" />
          <path d="M40 60 L60 60 L60 40" fill="none" stroke="var(--bg)" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Edge fades */}
      <div
        className="absolute top-0 left-0 right-0 h-[100px] pointer-events-none"
        style={{ background: 'linear-gradient(0deg, transparent 0%, var(--bg-dark) 100%)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-[100px] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 0%, var(--bg-dark) 100%)' }}
      />
    </section>
  )
}
