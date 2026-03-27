'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    number: "01",
    name: "EcoSync",
    description: "Waste management logistics platform with real-time fleet tracking, automated waste segregation guidance, user scheduling, admin dashboard, and interactive map-based location selection.",
    stack: "React · Node.js · MongoDB · Tailwind CSS · Leaflet",
    tag: "Full Stack App",
    color: "#00D4AA",
    href: "https://github.com/imsahil11/ecoSync"
  },
  {
    number: "02",
    name: "ColabX",
    description: "Platform bridging the gap between government initiatives and entrepreneurial innovation — connecting entrepreneurs with support, resources, and opportunities for growth.",
    stack: "HTML · CSS · JavaScript · Font Awesome",
    tag: "Web Platform",
    color: "#7C4DFF",
    href: "https://github.com/imsahil11/ColabX"
  },
  {
    number: "03",
    name: "BidHub",
    description: "Full-featured online auction platform with real-time bidding, user profiles, auction history, category browsing, image uploads, and an admin dashboard for site management.",
    stack: "PHP · MySQL · Apache · HTML · CSS · JavaScript",
    tag: "Auction Platform",
    color: "#FF4500",
    href: "https://github.com/imsahil11/Bidhub"
  },
  {
    number: "04",
    name: "BioAuth Sim",
    description: "Advanced biometric authentication and cybersecurity simulator featuring facial recognition, voice authentication, fingerprint scanning, multi-factor auth, and an attack simulation lab.",
    stack: "Python · Flask · OpenCV · JavaScript · HTML · CSS",
    tag: "Security Simulator",
    color: "#FFB300",
    href: "https://github.com/imsahil11/Biometric-Authentication-System-Simulator"
  }
]

function ProjectRow({ project, index }: { project: typeof projects[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const rowRef = useRef<HTMLDivElement>(null)
  const imageX = useMotionValue(0)
  const imageY = useMotionValue(0)
  const springX = useSpring(imageX, { stiffness: 150, damping: 20 })
  const springY = useSpring(imageY, { stiffness: 150, damping: 20 })

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !rowRef.current) return

    const isMobile = window.matchMedia('(pointer: coarse)').matches

    const ctx = gsap.context(() => {
      gsap.fromTo(
        rowRef.current,
        { 
          clipPath: isMobile ? 'none' : 'inset(100% 0 0 0)',
          y: isMobile ? 30 : 0,
          opacity: 0,
        },
        {
          clipPath: isMobile ? 'none' : 'inset(0% 0 0 0)',
          y: 0,
          opacity: 1,
          duration: isMobile ? 0.6 : 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: rowRef.current,
            start: 'top 85%',
          },
          delay: isMobile ? 0 : index * 0.15,
        }
      )
    }, rowRef)

    return () => ctx.revert()
  }, [index])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rowRef.current || isTouchDevice) return
    const rect = rowRef.current.getBoundingClientRect()
    imageX.set(e.clientX - rect.left - 150)
    imageY.set(e.clientY - rect.top - 100)
  }

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isTouchDevice) return
    e.preventDefault()
    setIsExpanded(prev => !prev)
  }

  const isActive = isTouchDevice ? isExpanded : isHovered

  return (
    <div
      ref={rowRef}
      className="block relative overflow-hidden group"
      style={{
        borderBottom: '1px solid var(--border)',
        clipPath: 'inset(100% 0 0 0)',
        opacity: 0,
      }}
      onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
      onMouseLeave={() => !isTouchDevice && setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={handleTap}
      data-cursor="project"
      data-cursor-text="VIEW"
    >
      {/* Animated accent line on left — always visible on mobile */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        initial={{ scaleY: isTouchDevice ? 1 : 0 }}
        animate={{ scaleY: isTouchDevice ? 1 : (isHovered ? 1 : 0) }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
        style={{ 
          backgroundColor: project.color, 
          originY: 0,
          boxShadow: isActive ? `0 0 20px ${project.color}40` : 'none',
          opacity: isTouchDevice ? 0.6 : 1,
        }}
      />

      {/* Hover Background with gradient */}
      <AnimatePresence>
        {!isTouchDevice && isHovered && (
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 origin-left"
            style={{ 
              background: `linear-gradient(90deg, ${project.color}08 0%, var(--surface) 100%)`,
              zIndex: 0,
            }}
          />
        )}
      </AnimatePresence>

      {/* Floating preview card — desktop only */}
      <motion.div
        className="absolute pointer-events-none z-20 hidden lg:block"
        style={{ 
          x: springX, 
          y: springY,
          width: 300,
          height: 200,
        }}
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          scale: isHovered ? 1 : 0.8,
          rotate: isHovered ? 0 : -5,
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-full h-full flex items-center justify-center relative overflow-hidden"
          style={{ 
            backgroundColor: 'var(--bg-dark)',
            border: `1px solid ${project.color}40`,
          }}
        >
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id={`grid-${project.number}`} width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke={project.color} strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${project.number})`} />
            </svg>
          </div>
          
          <span
            className="relative z-10"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '80px',
              color: project.color,
              opacity: 0.3,
            }}
          >
            {project.number}
          </span>
          
          <motion.div
            className="absolute inset-0"
            animate={{ backgroundPosition: ['0% 0%', '0% 100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${project.color}10 50%, transparent 100%)`,
              backgroundSize: '100% 200%',
            }}
          />
        </div>
      </motion.div>

      {/* Row Content */}
      <div className="relative z-10 py-8 sm:py-10 md:py-14 pl-4 lg:pl-8 pr-4 lg:pr-4">
        {/* Mobile: number badge + tag row */}
        <div className="flex items-center gap-3 mb-3 lg:hidden">
          <span
            className="px-2 py-0.5"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: project.color,
              border: `1px solid ${project.color}40`,
              letterSpacing: '1px',
            }}
          >
            {project.number}
          </span>
          <span
            className="flex items-center gap-1.5"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--muted)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            {project.tag}
          </span>
        </div>

        {/* Desktop grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[100px_1fr_180px_60px] gap-2 lg:gap-8 items-start lg:items-center">
          {/* Column 1: Number — desktop only */}
          <motion.span
            className="hidden lg:block"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '72px',
              color: 'var(--text)',
              opacity: 0.05,
              lineHeight: 1,
            }}
            animate={{ 
              opacity: isHovered ? 0.2 : 0.05,
              color: isHovered ? project.color : 'var(--text)',
            }}
            transition={{ duration: 0.3 }}
          >
            {project.number}
          </motion.span>

          {/* Column 2: Name + Description + Stack */}
          <div className="overflow-hidden">
            <motion.h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 5vw, 72px)',
                color: 'var(--text)',
                lineHeight: 1,
                margin: 0,
              }}
              animate={{ x: isHovered && !isTouchDevice ? 16 : 0 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
            >
              <span className="inline-block relative">
                {project.name}
                <motion.span
                  className="absolute -bottom-1 left-0 h-[2px]"
                  style={{ backgroundColor: project.color }}
                  initial={{ width: 0 }}
                  animate={{ width: isActive ? '100%' : 0 }}
                  transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                />
              </span>
            </motion.h3>
            
            {/* Description — always visible on mobile; fade on desktop */}
            <motion.p
              className="mt-2 sm:mt-3"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--muted)',
                maxWidth: '540px',
                lineHeight: 1.6,
              }}
              animate={{ 
                x: isHovered && !isTouchDevice ? 16 : 0, 
                opacity: isTouchDevice ? 1 : (isHovered ? 1 : 0.8),
              }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
            >
              {project.description}
            </motion.p>
            
            {/* Tech tags */}
            <motion.div
              className="mt-3 flex flex-wrap gap-1.5 sm:gap-2"
              animate={{ x: isHovered && !isTouchDevice ? 16 : 0 }}
              transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            >
              {project.stack.split(' · ').map((tech, i) => (
                <span
                  key={i}
                  className="px-2 py-1"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: isActive ? project.color : 'var(--muted)',
                    border: `1px solid ${isActive ? project.color + '40' : 'var(--border)'}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            {/* Mobile: View on GitHub link */}
            <motion.a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 lg:hidden"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: project.color,
                letterSpacing: '1px',
                textDecoration: 'none',
              }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              VIEW PROJECT
              <ArrowUpRight size={14} strokeWidth={2} />
            </motion.a>
          </div>

          {/* Column 3: Tag — desktop only */}
          <motion.span
            className="hidden lg:flex items-center gap-2"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--muted)',
            }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
          >
            <span
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ 
                backgroundColor: project.color,
                boxShadow: isHovered ? `0 0 10px ${project.color}` : 'none',
              }}
            />
            {project.tag}
          </motion.span>

          {/* Column 4: Arrow — desktop only */}
          <motion.a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
            style={{
              border: `1px solid ${isHovered ? project.color + '60' : 'var(--border)'}`,
              backgroundColor: isHovered ? project.color + '12' : 'transparent',
              transition: 'all 0.3s ease',
              textDecoration: 'none',
            }}
            animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: isHovered ? 0 : -45 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight
                size={18}
                strokeWidth={2}
                style={{ color: isHovered ? project.color : 'var(--text)' }}
              />
            </motion.div>
          </motion.a>
        </div>
      </div>
    </div>
  )
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative px-5 md:px-6 lg:px-[120px] py-20 md:py-[140px]"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Decorative elements */}
      <div className="absolute top-20 right-20 opacity-[0.03] pointer-events-none hidden lg:block">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" fill="none" stroke="var(--text)" strokeWidth="1" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="var(--text)" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="var(--text)" strokeWidth="1" />
        </svg>
      </div>

      {/* Section Header */}
      <div
        ref={headerRef}
        className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end pb-6 md:pb-8 mb-0 gap-3 md:gap-4"
        style={{ borderBottom: '1px solid var(--border)', opacity: 0 }}
      >
        <div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            02 — Projects
          </span>
          <h2
            className="mt-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 80px)',
              color: 'var(--text)',
              lineHeight: 1,
            }}
          >
            PROJECTS
          </h2>
        </div>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--muted)',
          }}
        >
          ({projects.length.toString().padStart(2, '0')} Projects)
        </span>
      </div>

      {/* Project Rows */}
      <div className="relative z-10">
        {projects.map((project, i) => (
          <ProjectRow key={project.number} project={project} index={i} />
        ))}
      </div>

      {/* All Projects — GitHub CTA */}
      <motion.div
        className="relative z-10 mt-16 md:mt-24 flex flex-col items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        {/* Decorative line */}
        <motion.div
          className="mb-8 md:mb-10 overflow-hidden"
          style={{ width: 1, height: 60 }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            className="w-full h-full"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)' }}
            animate={{ y: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        <a
          href="https://github.com/imsahil11"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
          data-magnetic
          data-cursor="view"
          data-cursor-text="VISIT"
        >
          {/* Outer border container */}
          <div className="relative overflow-hidden" style={{ padding: '1px' }}>
            {/* Animated border gradient */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, var(--accent) 25%, transparent 50%, var(--accent) 75%, transparent 100%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner content */}
            <div
              className="relative flex items-center gap-4 sm:gap-6 px-6 sm:px-10 py-4 sm:py-5"
              style={{ backgroundColor: 'var(--bg)' }}
            >
              {/* Background fill on hover */}
              <div
                className="absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100"
                style={{ backgroundColor: 'var(--accent)', transition: 'transform 0.5s cubic-bezier(0.76,0,0.24,1)' }}
              />

              {/* GitHub icon */}
              <div className="relative z-10 flex items-center justify-center" style={{ width: 28, height: 28 }}>
                <svg viewBox="0 0 24 24" width="20" height="20" className="transition-colors duration-300 group-hover:fill-(--bg)" style={{ fill: 'var(--text)' }}>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>

              {/* Text stack */}
              <div className="relative z-10">
                <div className="flex items-center gap-2">
                  <span
                    className="transition-colors duration-300 group-hover:text-(--bg)"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(14px, 2vw, 18px)',
                      letterSpacing: '2px',
                      color: 'var(--text)',
                      lineHeight: 1,
                    }}
                  >
                    VIEW ALL PROJECTS
                  </span>
                  <motion.span
                    className="transition-colors duration-300 group-hover:text-(--bg)"
                    style={{ color: 'var(--accent)' }}
                    animate={{ x: [0, 4, 0], y: [0, -2, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowUpRight size={18} />
                  </motion.span>
                </div>
                <span
                  className="transition-colors duration-300 group-hover:text-(--bg) hidden sm:block"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--muted)',
                    letterSpacing: '1px',
                  }}
                >
                  github.com/imsahil11
                </span>
              </div>

              {/* Ping dot */}
              <div className="relative z-10 ml-2 hidden sm:block">
                <motion.div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                  }}
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
        </a>

        {/* Bottom decorative text */}
        <motion.span
          className="mt-6"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '3px',
            color: 'var(--muted)',
            opacity: 0.4,
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.4 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
        >
          MORE PROJECTS LOADING · · ·
        </motion.span>
      </motion.div>
    </section>
  )
}
