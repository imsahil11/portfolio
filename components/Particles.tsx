'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  originX: number
  originY: number
  vx: number
  vy: number
  size: number
  opacity: number
  hue: number
  pulsePhase: number
  pulseSpeed: number
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particles = useRef<Particle[]>([])
  const mouse = useRef({ x: -1000, y: -1000, active: false })
  const rafId = useRef<number>(0)
  const time = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      initParticles()
    }

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

    const initParticles = () => {
      particles.current = []
      const density = Math.max(30, Math.floor((width * height) / 18000))
      const count = Math.min(density, isTouchDevice ? 40 : 120)

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        particles.current.push({
          x,
          y,
          originX: x,
          originY: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 1.8 + 0.6,
          opacity: Math.random() * 0.4 + 0.15,
          hue: Math.random() > 0.7 ? 16 : Math.random() > 0.5 ? 20 : 0,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.005 + Math.random() * 0.01,
        })
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, active: true }
    }

    const handleMouseLeave = () => {
      mouse.current.active = false
    }

    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseleave', handleMouseLeave)
    }

    const animate = () => {
      time.current += 1
      ctx.clearRect(0, 0, width, height)

      const pts = particles.current
      const mouseX = mouse.current.x
      const mouseY = mouse.current.y
      const mouseActive = mouse.current.active
      const interactionRadius = 180
      const connectionDistance = 140

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i]

        if (mouseActive) {
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < interactionRadius) {
            const force = (interactionRadius - dist) / interactionRadius
            const angle = Math.atan2(dy, dx)
            p.vx -= Math.cos(angle) * force * 0.03
            p.vy -= Math.sin(angle) * force * 0.03
          }
        }

        const returnForce = 0.002
        p.vx += (p.originX - p.x) * returnForce
        p.vy += (p.originY - p.y) * returnForce

        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.985
        p.vy *= 0.985

        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        const pulse = Math.sin(time.current * p.pulseSpeed + p.pulsePhase)
        const currentOpacity = p.opacity + pulse * 0.08
        const currentSize = p.size + pulse * 0.3

        if (p.hue > 0) {
          ctx.fillStyle = `hsla(${p.hue}, 100%, 55%, ${currentOpacity})`
        } else {
          ctx.fillStyle = `rgba(15, 14, 12, ${currentOpacity * 0.6})`
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2)
        ctx.fill()

        if (p.hue > 0 && currentSize > 1.2) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, currentSize + 3, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${p.hue}, 100%, 55%, ${currentOpacity * 0.08})`
          ctx.fill()
        }

        for (let j = i + 1; j < pts.length; j++) {
          const other = pts[j]
          const ddx = p.x - other.x
          const ddy = p.y - other.y
          const distance = Math.sqrt(ddx * ddx + ddy * ddy)

          if (distance < connectionDistance) {
            const lineOpacity = 0.04 * (1 - distance / connectionDistance)

            let mouseProximityBoost = 0
            if (mouseActive) {
              const midX = (p.x + other.x) / 2
              const midY = (p.y + other.y) / 2
              const mouseDist = Math.sqrt(
                (mouseX - midX) ** 2 + (mouseY - midY) ** 2
              )
              if (mouseDist < interactionRadius) {
                mouseProximityBoost = (1 - mouseDist / interactionRadius) * 0.08
              }
            }

            const finalOpacity = lineOpacity + mouseProximityBoost
            const isAccentLine = p.hue > 0 || other.hue > 0

            if (isAccentLine) {
              ctx.strokeStyle = `rgba(255, 69, 0, ${finalOpacity * 1.5})`
            } else {
              ctx.strokeStyle = `rgba(15, 14, 12, ${finalOpacity})`
            }

            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        }
      }

      rafId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      if (!isTouchDevice) {
        window.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.7 }}
    />
  )
}
