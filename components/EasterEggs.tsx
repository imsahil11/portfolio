'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Toast Notification ─────────────────────────────────────────────
function Toast({ message, submessage, icon }: { message: string; submessage?: string; icon?: string }) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0, scale: 0.9 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 30, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[10001] px-8 py-4 flex items-center gap-3"
      style={{
        backgroundColor: 'var(--bg-dark)',
        border: '1px solid rgba(255, 69, 0, 0.2)',
        borderRadius: '8px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}
    >
      {icon && (
        <span style={{ fontSize: '18px' }}>{icon}</span>
      )}
      <div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--bg)', letterSpacing: '1px' }}>
          {message}
        </span>
        {submessage && (
          <span className="block mt-0.5" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(245,240,232,0.4)' }}>
            {submessage}
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ─── Matrix Rain Effect ─────────────────────────────────────────────
function MatrixRain({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789{}[]<>'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50)
    const speeds: number[] = Array(columns).fill(0).map(() => 0.4 + Math.random() * 1.2)
    const brightness: number[] = Array(columns).fill(0).map(() => 0.5 + Math.random() * 0.5)

    let frameCount = 0
    const maxFrames = 480
    let raf = 0

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Head char — bright white-green
        ctx.fillStyle = `rgba(255, 69, 0, ${brightness[i]})`
        ctx.shadowColor = '#FF4500'
        ctx.shadowBlur = y > 0 ? 6 : 0
        ctx.fillText(char, x, y)
        ctx.shadowBlur = 0

        // Occasional very bright "glitch" char
        if (Math.random() > 0.995) {
          ctx.fillStyle = '#F5F0E8'
          ctx.shadowColor = '#F5F0E8'
          ctx.shadowBlur = 15
          ctx.fillText(char, x, y)
          ctx.shadowBlur = 0
        }

        if (y > canvas.height && Math.random() > 0.98) {
          drops[i] = Math.random() * -10
          brightness[i] = 0.4 + Math.random() * 0.6
        }
        drops[i] += speeds[i]
      }

      frameCount++
      if (frameCount < maxFrames) {
        raf = requestAnimationFrame(draw)
      } else {
        onComplete()
      }
    }

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    raf = requestAnimationFrame(draw)

    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', handleResize) }
  }, [onComplete])

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.9 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  )
}

// ─── Konami Glitch Effect ───────────────────────────────────────────
// Unique retro glitch: RGB channel splits, screen tears, and a terminal boot sequence
function KonamiGlitch({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const W = canvas.width
    const H = canvas.height

    let frame = 0
    const maxFrames = 420 // ~7s
    let phase: 'glitch' | 'boot' | 'fadeout' = 'glitch'
    const bootLines: string[] = [
      '> SYSTEM BREACH DETECTED',
      '> AUTHENTICATING USER .............. OK',
      '> LOADING DEV_MODE.SYS ............ OK',
      '> INJECTING EASTER_EGGS.DLL ....... OK',
      '> BYPASSING CORPORATE FIREWALL .... OK',
      '> ACCESS LEVEL: ██████████ ADMIN',
      '> ',
      '> WELCOME BACK, DEVELOPER.',
      '> "The only way to do great work is to love what you do."',
      '> ',
      '> DEV MODE ACTIVE — 15s REMAINING',
    ]
    let bootLineIndex = 0
    let bootCharIndex = 0
    let renderedBoot: string[] = []
    let bootTimer = 0
    let raf = 0

    const draw = () => {
      frame++

      if (phase === 'glitch' && frame < 120) {
        // Phase 1: Intense glitch — RGB splits & screen tears
        ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + Math.random() * 0.4})`
        ctx.fillRect(0, 0, W, H)

        // Screen tear slices
        const slices = 8 + Math.floor(Math.random() * 12)
        for (let i = 0; i < slices; i++) {
          const y = Math.floor(Math.random() * H)
          const h = 2 + Math.floor(Math.random() * 30)
          const shift = (Math.random() - 0.5) * 60

          // Red channel
          ctx.fillStyle = `rgba(255, 0, 0, ${0.05 + Math.random() * 0.15})`
          ctx.fillRect(shift - 3, y, W, h)

          // Cyan channel
          ctx.fillStyle = `rgba(0, 255, 255, ${0.05 + Math.random() * 0.12})`
          ctx.fillRect(-shift + 3, y, W, h)

          // White flash slice
          if (Math.random() > 0.85) {
            ctx.fillStyle = `rgba(245, 240, 232, ${0.1 + Math.random() * 0.3})`
            ctx.fillRect(0, y, W, h / 2)
          }
        }

        // Occasional big white flash
        if (Math.random() > 0.92) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + Math.random() * 0.25})`
          ctx.fillRect(0, 0, W, H)
        }

        // Glitch text fragments
        if (frame % 4 === 0) {
          const fragments = ['ERR0R', 'SYS_FAULT', '0xDEAD', 'BREACH', '>>>>', 'DEV_MODE', '//HACK', 'ROOT', 'SUDO']
          ctx.font = `${12 + Math.random() * 24}px monospace`
          ctx.fillStyle = `rgba(255, 69, 0, ${0.4 + Math.random() * 0.6})`
          const frag = fragments[Math.floor(Math.random() * fragments.length)]
          ctx.fillText(frag, Math.random() * W, Math.random() * H)
        }

        // Horizontal noise lines
        for (let y = 0; y < H; y += 2) {
          if (Math.random() > 0.97) {
            ctx.fillStyle = `rgba(255, 69, 0, ${Math.random() * 0.2})`
            ctx.fillRect(0, y, W, 1)
          }
        }

      } else if (frame >= 120 && phase === 'glitch') {
        phase = 'boot'
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, W, H)

      } else if (phase === 'boot') {
        // Phase 2: Terminal boot sequence
        bootTimer++

        if (bootTimer % 3 === 0 && bootLineIndex < bootLines.length) {
          const currentLine = bootLines[bootLineIndex]
          if (bootCharIndex < currentLine.length) {
            bootCharIndex++
          } else {
            renderedBoot.push(currentLine)
            bootLineIndex++
            bootCharIndex = 0
          }
        }

        // Draw terminal
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)'
        ctx.fillRect(0, 0, W, H)

        // Scanline overlay
        for (let y = 0; y < H; y += 3) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
          ctx.fillRect(0, y, W, 1)
        }

        ctx.font = '14px monospace'
        const startY = Math.max(40, H / 2 - bootLines.length * 12)
        const startX = Math.max(40, W / 2 - 280)

        // Render completed lines
        renderedBoot.forEach((line, i) => {
          const isHighlight = line.includes('ADMIN') || line.includes('WELCOME') || line.includes('DEV MODE')
          ctx.fillStyle = isHighlight ? '#FF4500' : '#00FF41'
          ctx.shadowColor = isHighlight ? '#FF4500' : '#00FF41'
          ctx.shadowBlur = 4
          ctx.fillText(line, startX, startY + i * 24)
          ctx.shadowBlur = 0
        })

        // Render current line with typing cursor
        if (bootLineIndex < bootLines.length) {
          const partial = bootLines[bootLineIndex].slice(0, bootCharIndex)
          const cursor = frame % 30 < 15 ? '█' : ' '
          const isHL = partial.includes('ADMIN') || partial.includes('WELCOME')
          ctx.fillStyle = isHL ? '#FF4500' : '#00FF41'
          ctx.shadowColor = isHL ? '#FF4500' : '#00FF41'
          ctx.shadowBlur = 4
          ctx.fillText(partial + cursor, startX, startY + renderedBoot.length * 24)
          ctx.shadowBlur = 0
        }

        // CRT vignette
        const grad = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8)
        grad.addColorStop(0, 'transparent')
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, W, H)

        if (bootLineIndex >= bootLines.length && bootTimer > bootLines.length * 3 + 90) {
          phase = 'fadeout'
        }

      } else if (phase === 'fadeout') {
        // slow fade
      }

      if (frame < maxFrames) {
        raf = requestAnimationFrame(draw)
      } else {
        onComplete()
      }
    }

    raf = requestAnimationFrame(draw)
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    window.addEventListener('resize', handleResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', handleResize) }
  }, [onComplete])

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  )
}

// ─── Party Confetti ─────────────────────────────────────────────────
// Lightweight confetti bursts — no rockets, no trails, no emoji rendering
function PartyFireworks({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const W = canvas.width
    const H = canvas.height

    const colors = ['#FF4500', '#FF6B35', '#FFB300', '#FF006E', '#00D4AA', '#7C4DFF', '#F5F0E8', '#00BFFF']

    interface Particle {
      x: number; y: number; vx: number; vy: number
      color: string; size: number; life: number; maxLife: number
      shape: number; rotation: number; rotSpeed: number
    }

    const particles: Particle[] = []
    let frame = 0
    let raf = 0

    function burst(cx: number, cy: number, count: number) {
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
        const speed = 3 + Math.random() * 6
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 3 + Math.random() * 5,
          life: 0,
          maxLife: 50 + Math.random() * 30,
          shape: Math.floor(Math.random() * 3),
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 12,
        })
      }
    }

    // Staggered bursts from various positions
    burst(W * 0.5, H * 0.35, 35)
    const t1 = setTimeout(() => burst(W * 0.25, H * 0.3, 25), 250)
    const t2 = setTimeout(() => burst(W * 0.75, H * 0.3, 25), 450)
    const t3 = setTimeout(() => burst(W * 0.5, H * 0.5, 20), 700)
    const t4 = setTimeout(() => burst(W * 0.4, H * 0.2, 20), 1000)

    const animate = () => {
      frame++
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, W, H)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.vy += 0.08
        p.vx *= 0.99
        p.x += p.vx
        p.y += p.vy
        p.life++
        p.rotation += p.rotSpeed

        const progress = p.life / p.maxLife
        const alpha = Math.max(0, 1 - progress * progress)

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = alpha
        ctx.fillStyle = p.color

        const s = p.size * (1 - progress * 0.3)
        if (p.shape === 0) {
          ctx.beginPath()
          ctx.arc(0, 0, s, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 1) {
          ctx.fillRect(-s / 2, -s / 2, s, s * 1.6)
        } else {
          // triangle
          ctx.beginPath()
          ctx.moveTo(0, -s)
          ctx.lineTo(s * 0.8, s * 0.6)
          ctx.lineTo(-s * 0.8, s * 0.6)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()

        if (p.life >= p.maxLife) particles.splice(i, 1)
      }

      ctx.globalAlpha = 1

      if (frame < 180 || particles.length > 0) {
        raf = requestAnimationFrame(animate)
      } else {
        onComplete()
      }
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fillRect(0, 0, W, H)
    raf = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
    }
  }, [onComplete])

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] pointer-events-none"
    />
  )
}

// ─── Dev Stats Panel ─────────────────────────────────────────────────
function DevStatsPanel({ onClose }: { onClose: () => void }) {
  const stats = [
    { label: 'COMPONENTS', value: '14', icon: '◇' },
    { label: 'ANIMATIONS', value: '50+', icon: '◈' },
    { label: 'EASTER EGGS', value: '???', icon: '◆' },
    { label: 'FRAMEWORKS', value: 'Next.js · GSAP · Framer', icon: '⬡' },
    { label: 'FONTS', value: 'Bebas · DM Sans · JetBrains', icon: '♦' },
    { label: 'PARTICLES', value: '~120', icon: '•' },
    { label: 'BUILT WITH', value: '☕ + Late Nights', icon: '✧' },
    { label: 'VIBE', value: 'Immaculate', icon: '◎' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-[90%] max-w-[520px] p-8 overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-dark)',
          border: '1px solid rgba(255, 69, 0, 0.15)',
          borderRadius: '12px',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Scan line */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ backgroundPosition: ['0% 0%', '0% 100%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,69,0,0.03) 50%, transparent 100%)',
            backgroundSize: '100% 200%',
          }}
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '3px' }}>
              SYSTEM://DEV_STATS
            </span>
            <h3 className="mt-1" style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--bg)', lineHeight: 1 }}>
              UNDER THE HOOD
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ border: '1px solid rgba(245,240,232,0.2)', color: 'var(--bg)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}
          >
            ×
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="p-4"
              style={{ border: '1px solid rgba(245,240,232,0.06)', borderRadius: '8px' }}
            >
              <span className="flex items-center gap-2 mb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(245,240,232,0.35)', letterSpacing: '2px' }}>
                <span style={{ color: 'var(--accent)' }}>{stat.icon}</span>
                {stat.label}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--bg)' }}>
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
          style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(245,240,232,0.25)' }}
        >
          Press ESC or click outside to close • Keep exploring →
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

// ─── Snake Game ─────────────────────────────────────────────────────
function SnakeGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [highScore, setHighScore] = useState(0)
  const [gameKey, setGameKey] = useState(0)
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 })
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('snake-high')
    if (stored) setHighScore(parseInt(stored))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const GRID = 20
    const W = 20
    const H = 20
    canvas.width = W * GRID
    canvas.height = H * GRID

    let snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]
    let food = spawnFood()
    let dir = { x: 1, y: 0 }
    let nextDir = { x: 1, y: 0 }
    let currentScore = 0

    function spawnFood(): { x: number; y: number } {
      let pos: { x: number; y: number }
      do {
        pos = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) }
      } while (snake.some(s => s.x === pos.x && s.y === pos.y))
      return pos
    }

    function drawRoundedRect(cx: number, cy: number, w: number, h: number, r: number) {
      if (!ctx) return
      ctx.beginPath()
      ctx.moveTo(cx + r, cy)
      ctx.lineTo(cx + w - r, cy)
      ctx.quadraticCurveTo(cx + w, cy, cx + w, cy + r)
      ctx.lineTo(cx + w, cy + h - r)
      ctx.quadraticCurveTo(cx + w, cy + h, cx + w - r, cy + h)
      ctx.lineTo(cx + r, cy + h)
      ctx.quadraticCurveTo(cx, cy + h, cx, cy + h - r)
      ctx.lineTo(cx, cy + r)
      ctx.quadraticCurveTo(cx, cy, cx + r, cy)
      ctx.closePath()
      ctx.fill()
    }

    function tick() {
      dir = nextDir
      dirRef.current = dir
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y }

      // Walls = death
      if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H) {
        endGame(); return
      }
      // Self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        endGame(); return
      }

      snake.unshift(head)
      if (head.x === food.x && head.y === food.y) {
        currentScore += 10
        setScore(currentScore)
        food = spawnFood()
      } else {
        snake.pop()
      }

      draw()
    }

    function endGame() {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
      setGameOver(true)
      if (currentScore > highScore) {
        setHighScore(currentScore)
        localStorage.setItem('snake-high', String(currentScore))
      }
    }

    function draw() {
      if (!ctx || !canvas) return
      // Background
      ctx.fillStyle = '#0F0E0C'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grid
      ctx.strokeStyle = 'rgba(245, 240, 232, 0.03)'
      ctx.lineWidth = 0.5
      for (let i = 0; i <= W; i++) {
        ctx.beginPath(); ctx.moveTo(i * GRID, 0); ctx.lineTo(i * GRID, H * GRID); ctx.stroke()
      }
      for (let i = 0; i <= H; i++) {
        ctx.beginPath(); ctx.moveTo(0, i * GRID); ctx.lineTo(W * GRID, i * GRID); ctx.stroke()
      }

      // Snake body
      snake.forEach((s, i) => {
        const progress = 1 - i / snake.length
        const alpha = 0.4 + progress * 0.6
        if (i === 0) {
          ctx.fillStyle = '#FF4500'
          ctx.shadowColor = '#FF4500'
          ctx.shadowBlur = 8
        } else {
          ctx.fillStyle = `rgba(255, 69, 0, ${alpha})`
          ctx.shadowBlur = 0
        }
        drawRoundedRect(s.x * GRID + 1, s.y * GRID + 1, GRID - 2, GRID - 2, 4)
        ctx.shadowBlur = 0
      })

      // Food with glow
      ctx.fillStyle = '#F5F0E8'
      ctx.shadowColor = '#F5F0E8'
      ctx.shadowBlur = 12
      ctx.beginPath()
      ctx.arc(food.x * GRID + GRID / 2, food.y * GRID + GRID / 2, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Outer glow ring
      ctx.strokeStyle = 'rgba(245, 240, 232, 0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(food.x * GRID + GRID / 2, food.y * GRID + GRID / 2, 8, 0, Math.PI * 2)
      ctx.stroke()
    }

    const handleKey = (e: KeyboardEvent) => {
      const d = dirRef.current
      switch (e.key) {
        case 'ArrowUp': case 'w': if (d.y !== 1) nextDir = { x: 0, y: -1 }; break
        case 'ArrowDown': case 's': if (d.y !== -1) nextDir = { x: 0, y: 1 }; break
        case 'ArrowLeft': case 'a': if (d.x !== 1) nextDir = { x: -1, y: 0 }; break
        case 'ArrowRight': case 'd': if (d.x !== -1) nextDir = { x: 1, y: 0 }; break
      }
    }

    window.addEventListener('keydown', handleKey)
    draw()
    gameLoopRef.current = setInterval(tick, 110)

    return () => {
      window.removeEventListener('keydown', handleKey)
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [gameKey])

  const restart = () => {
    setScore(0)
    setGameOver(false)
    dirRef.current = { x: 1, y: 0 }
    setGameKey(k => k + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-4">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#F5F0E8' }}>
              SNAKE
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '2px' }}>
              SCORE: {String(score).padStart(4, '0')}
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(245,240,232,0.3)', letterSpacing: '2px' }}>
              BEST: {String(highScore).padStart(4, '0')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            style={{ border: '1px solid rgba(245,240,232,0.2)', color: '#F5F0E8', fontFamily: 'var(--font-mono)' }}
          >
            ×
          </button>
        </div>

        {/* Game canvas */}
        <div className="relative overflow-hidden" style={{ borderRadius: '8px', border: '1px solid rgba(255,69,0,0.15)' }}>
          <canvas ref={canvasRef} />

          {/* Game Over overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ backgroundColor: 'rgba(15,14,12,0.9)' }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: '#F5F0E8' }}>
                  GAME OVER
                </span>
                <span className="mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent)' }}>
                  {score} points
                </span>
                <button
                  onClick={restart}
                  className="mt-6 px-6 py-2 rounded-full transition-colors"
                  style={{ backgroundColor: 'var(--accent)', color: '#0F0E0C', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px' }}
                >
                  PLAY AGAIN
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls hint */}
        <p className="mt-3 text-center" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(245,240,232,0.25)' }}>
          WASD or Arrow Keys • ESC to close
        </p>
      </motion.div>
    </motion.div>
  )
}

// ─── Pong Game ──────────────────────────────────────────────────────
function PongGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [playerScore, setPlayerScore] = useState(0)
  const [aiScore, setAiScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [gameKey, setGameKey] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 600
    const H = 400
    canvas.width = W
    canvas.height = H

    const PADDLE_W = 10
    const PADDLE_H = 80
    const BALL_R = 6

    let playerY = H / 2 - PADDLE_H / 2
    let aiY = H / 2 - PADDLE_H / 2
    let ballX = W / 2
    let ballY = H / 2
    let ballVX = 4
    let ballVY = 2
    let pScore = 0
    let aScore = 0
    let mouseY = H / 2
    let raf: number

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseY = ((e.clientY - rect.top) / rect.height) * H
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    function reset() {
      ballX = W / 2
      ballY = H / 2
      ballVX = (Math.random() > 0.5 ? 1 : -1) * 4
      ballVY = (Math.random() - 0.5) * 4
    }

    function update() {
      // Player paddle follows mouse
      playerY += (mouseY - PADDLE_H / 2 - playerY) * 0.12
      playerY = Math.max(0, Math.min(H - PADDLE_H, playerY))

      // AI paddle
      const aiTarget = ballY - PADDLE_H / 2
      aiY += (aiTarget - aiY) * 0.06
      aiY = Math.max(0, Math.min(H - PADDLE_H, aiY))

      // Ball movement
      ballX += ballVX
      ballY += ballVY

      // Wall bounce
      if (ballY - BALL_R <= 0 || ballY + BALL_R >= H) {
        ballVY = -ballVY
        ballY = ballY - BALL_R <= 0 ? BALL_R : H - BALL_R
      }

      // Paddle collisions
      // Player (left)
      if (ballX - BALL_R <= PADDLE_W + 20 && ballY >= playerY && ballY <= playerY + PADDLE_H && ballVX < 0) {
        ballVX = -ballVX * 1.05
        const hitPos = (ballY - playerY) / PADDLE_H - 0.5
        ballVY = hitPos * 8
        ballX = PADDLE_W + 20 + BALL_R
      }

      // AI (right)
      if (ballX + BALL_R >= W - PADDLE_W - 20 && ballY >= aiY && ballY <= aiY + PADDLE_H && ballVX > 0) {
        ballVX = -ballVX * 1.05
        const hitPos = (ballY - aiY) / PADDLE_H - 0.5
        ballVY = hitPos * 8
        ballX = W - PADDLE_W - 20 - BALL_R
      }

      // Scoring
      if (ballX < 0) {
        aScore++
        setAiScore(aScore)
        reset()
      }
      if (ballX > W) {
        pScore++
        setPlayerScore(pScore)
        reset()
      }

      // Cap speed
      const speed = Math.sqrt(ballVX * ballVX + ballVY * ballVY)
      if (speed > 12) {
        ballVX = (ballVX / speed) * 12
        ballVY = (ballVY / speed) * 12
      }

      // Win condition
      if (pScore >= 5 || aScore >= 5) {
        setIsPlaying(false)
        return
      }

      draw()
      raf = requestAnimationFrame(update)
    }

    function draw() {
      if (!ctx) return
      ctx.fillStyle = '#0F0E0C'
      ctx.fillRect(0, 0, W, H)

      // Center line
      ctx.setLineDash([8, 8])
      ctx.strokeStyle = 'rgba(245, 240, 232, 0.08)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(W / 2, 0)
      ctx.lineTo(W / 2, H)
      ctx.stroke()
      ctx.setLineDash([])

      // Player paddle (accent)
      ctx.fillStyle = '#FF4500'
      ctx.shadowColor = '#FF4500'
      ctx.shadowBlur = 12
      roundRect(ctx, 20, playerY, PADDLE_W, PADDLE_H, 5)
      ctx.fill()
      ctx.shadowBlur = 0

      // AI paddle (muted)
      ctx.fillStyle = 'rgba(245, 240, 232, 0.5)'
      roundRect(ctx, W - 20 - PADDLE_W, aiY, PADDLE_W, PADDLE_H, 5)
      ctx.fill()

      // Ball
      ctx.fillStyle = '#F5F0E8'
      ctx.shadowColor = '#F5F0E8'
      ctx.shadowBlur = 10
      ctx.beginPath()
      ctx.arc(ballX, ballY, BALL_R, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0

      // Ball trail
      ctx.fillStyle = 'rgba(245, 240, 232, 0.15)'
      ctx.beginPath()
      ctx.arc(ballX - ballVX * 1, ballY - ballVY * 1, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'rgba(245, 240, 232, 0.05)'
      ctx.beginPath()
      ctx.arc(ballX - ballVX * 2, ballY - ballVY * 2, 3, 0, Math.PI * 2)
      ctx.fill()
    }

    function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      c.beginPath()
      c.moveTo(x + r, y)
      c.lineTo(x + w - r, y)
      c.quadraticCurveTo(x + w, y, x + w, y + r)
      c.lineTo(x + w, y + h - r)
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      c.lineTo(x + r, y + h)
      c.quadraticCurveTo(x, y + h, x, y + h - r)
      c.lineTo(x, y + r)
      c.quadraticCurveTo(x, y, x + r, y)
      c.closePath()
    }

    raf = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [gameKey])

  const restart = () => {
    setPlayerScore(0)
    setAiScore(0)
    setIsPlaying(true)
    setGameKey(k => k + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-6">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#F5F0E8' }}>
              PONG
            </span>
            <div className="flex items-center gap-3">
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'var(--accent)' }}>{playerScore}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'rgba(245,240,232,0.3)' }}>VS</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', color: 'rgba(245,240,232,0.5)' }}>{aiScore}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ border: '1px solid rgba(245,240,232,0.2)', color: '#F5F0E8', fontFamily: 'var(--font-mono)' }}
          >
            ×
          </button>
        </div>

        {/* Canvas */}
        <div className="relative overflow-hidden" style={{ borderRadius: '8px', border: '1px solid rgba(255,69,0,0.15)' }}>
          <canvas ref={canvasRef} style={{ display: 'block', cursor: 'none' }} />

          <AnimatePresence>
            {!isPlaying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ backgroundColor: 'rgba(15,14,12,0.9)' }}
              >
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: '#F5F0E8' }}>
                  {playerScore >= 5 ? 'YOU WIN' : 'AI WINS'}
                </span>
                <span className="mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: playerScore >= 5 ? 'var(--accent)' : 'rgba(245,240,232,0.5)' }}>
                  {playerScore} — {aiScore}
                </span>
                <button
                  onClick={restart}
                  className="mt-6 px-6 py-2 rounded-full"
                  style={{ backgroundColor: 'var(--accent)', color: '#0F0E0C', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px' }}
                >
                  REMATCH
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-3 text-center" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(245,240,232,0.25)' }}>
          Move mouse to control • First to 5 wins • ESC to close
        </p>
      </motion.div>
    </motion.div>
  )
}

// ─── Memory Card Game ───────────────────────────────────────────────
const techCards = [
  { id: 'react', symbol: '⚛', label: 'React' },
  { id: 'node', symbol: '⬡', label: 'Node' },
  { id: 'kotlin', symbol: 'K', label: 'Kotlin' },
  { id: 'java', symbol: '☕', label: 'Java' },
  { id: 'mongo', symbol: '🍃', label: 'Mongo' },
  { id: 'next', symbol: '▲', label: 'Next.js' },
  { id: 'ts', symbol: 'TS', label: 'TypeScript' },
  { id: 'git', symbol: '⎇', label: 'Git' },
]

interface MemoryCard {
  id: string
  symbol: string
  label: string
  pairId: number
  flipped: boolean
  matched: boolean
}

function MemoryGame({ onClose }: { onClose: () => void }) {
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [won, setWon] = useState(false)
  const lockRef = useRef(false)

  useEffect(() => {
    initGame()
  }, [])

  const initGame = () => {
    const doubled = [...techCards, ...techCards].map((card, i) => ({
      ...card,
      pairId: i,
      flipped: false,
      matched: false,
    }))
    // Fisher-Yates shuffle
    for (let i = doubled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [doubled[i], doubled[j]] = [doubled[j], doubled[i]]
    }
    setCards(doubled)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setWon(false)
    lockRef.current = false
  }

  const flipCard = (index: number) => {
    if (lockRef.current) return
    if (cards[index].flipped || cards[index].matched) return
    if (flippedCards.length >= 2) return

    const newCards = [...cards]
    newCards[index].flipped = true
    setCards(newCards)

    const newFlipped = [...flippedCards, index]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      lockRef.current = true

      const [first, second] = newFlipped
      if (cards[first].id === cards[second].id) {
        // Match!
        setTimeout(() => {
          const matched = [...newCards]
          matched[first].matched = true
          matched[second].matched = true
          setCards(matched)
          setFlippedCards([])
          lockRef.current = false
          const newMatches = matches + 1
          setMatches(newMatches)
          if (newMatches === techCards.length) {
            setWon(true)
          }
        }, 400)
      } else {
        // No match
        setTimeout(() => {
          const reset = [...newCards]
          reset[first].flipped = false
          reset[second].flipped = false
          setCards(reset)
          setFlippedCards([])
          lockRef.current = false
        }, 800)
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.85, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5 px-1">
          <div className="flex items-center gap-6">
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: '#F5F0E8' }}>
              MEMORY
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(245,240,232,0.4)', letterSpacing: '2px' }}>
              MOVES: {moves} &nbsp;•&nbsp; PAIRS: {matches}/{techCards.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ border: '1px solid rgba(245,240,232,0.2)', color: '#F5F0E8', fontFamily: 'var(--font-mono)' }}
          >
            ×
          </button>
        </div>

        {/* Cards grid */}
        <div
          className="grid grid-cols-4 gap-3 p-6"
          style={{ backgroundColor: '#0F0E0C', borderRadius: '12px', border: '1px solid rgba(255,69,0,0.12)' }}
        >
          {cards.map((card, i) => (
            <motion.button
              key={i}
              onClick={() => flipCard(i)}
              className="relative w-[80px] h-[100px] perspective-500"
              whileHover={{ scale: card.matched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-lg"
                animate={{
                  rotateY: card.flipped || card.matched ? 180 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  backfaceVisibility: 'hidden',
                  backgroundColor: 'rgba(245, 240, 232, 0.04)',
                  border: '1px solid rgba(245, 240, 232, 0.08)',
                }}
              >
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', color: 'rgba(245,240,232,0.15)' }}>?</span>
              </motion.div>

              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-lg"
                animate={{
                  rotateY: card.flipped || card.matched ? 0 : -180,
                }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  backfaceVisibility: 'hidden',
                  backgroundColor: card.matched ? 'rgba(255, 69, 0, 0.15)' : 'rgba(245, 240, 232, 0.08)',
                  border: `1px solid ${card.matched ? 'rgba(255, 69, 0, 0.4)' : 'rgba(245, 240, 232, 0.15)'}`,
                  boxShadow: card.matched ? '0 0 20px rgba(255, 69, 0, 0.15)' : 'none',
                }}
              >
                <span style={{ fontSize: '28px', marginBottom: '4px' }}>{card.symbol}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: card.matched ? 'var(--accent)' : 'rgba(245,240,232,0.5)', letterSpacing: '1px' }}>
                  {card.label}
                </span>
              </motion.div>
            </motion.button>
          ))}
        </div>

        {/* Win overlay */}
        <AnimatePresence>
          {won && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 flex items-center justify-between"
              style={{ backgroundColor: 'rgba(255,69,0,0.1)', borderRadius: '8px', border: '1px solid rgba(255,69,0,0.2)' }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: '#F5F0E8' }}>
                  PERFECT MATCH!
                </span>
                <span className="ml-3" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent)' }}>
                  {moves} moves
                </span>
              </div>
              <button
                onClick={initGame}
                className="px-5 py-2 rounded-full"
                style={{ backgroundColor: 'var(--accent)', color: '#0F0E0C', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '1px' }}
              >
                AGAIN
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-3 text-center" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(245,240,232,0.25)' }}>
          Match the tech stack pairs • ESC to close
        </p>
      </motion.div>
    </motion.div>
  )
}

// ─── Coffee Break Effect ────────────────────────────────────────────
function CoffeeEffect({ onComplete }: { onComplete: () => void }) {
  const cups = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    delay: Math.random() * 1.5,
    duration: 2.5 + Math.random() * 2,
    emoji: ['☕', '☕', '☕', '💨', '♨️'][Math.floor(Math.random() * 5)],
    size: 18 + Math.random() * 22,
  }))

  useEffect(() => {
    const timer = setTimeout(onComplete, 5000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
    >
      {/* Floating emojis */}
      {cups.map(cup => (
        <motion.div
          key={cup.id}
          initial={{ y: '110vh', opacity: 0, rotate: -20 + Math.random() * 40 }}
          animate={{ y: '-10vh', opacity: [0, 0.8, 0.8, 0], rotate: -20 + Math.random() * 40 }}
          transition={{ duration: cup.duration, delay: cup.delay, ease: 'easeOut' }}
          className="absolute"
          style={{ left: `${cup.x}%`, fontSize: `${cup.size}px` }}
        >
          {cup.emoji}
        </motion.div>
      ))}

      {/* Central message card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="text-center p-8 rounded-2xl"
          style={{
            backgroundColor: 'rgba(15,14,12,0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,69,0,0.15)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
          }}
        >
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '56px', display: 'block' }}
          >
            ☕
          </motion.span>
          <div className="mt-3" style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: '#F5F0E8' }}>
            COFFEE BREAK
          </div>
          <motion.div
            className="mt-3 mx-auto h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(245,240,232,0.08)', width: '180px' }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3.5, ease: 'linear', delay: 0.5 }}
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--accent)' }}
            />
          </motion.div>
          <div className="mt-2" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'rgba(245,240,232,0.4)', letterSpacing: '2px' }}>
            CAFFEINE LEVELS: REPLENISHING...
          </div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-4 flex justify-center gap-1"
          >
            {['☕','☕','☕','☕','☕'].map((c, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.5 }}
                style={{ fontSize: '16px' }}
              >
                {c}
              </motion.span>
            ))}
          </motion.div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(245,240,232,0.25)', display: 'block', marginTop: '8px' }}
          >
            "Powered by caffeine and ambition"
          </motion.span>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Hello Wave Effect ──────────────────────────────────────────────
function HelloWave({ onComplete }: { onComplete: () => void }) {
  const letters = 'HELLO THERE'.split('')

  useEffect(() => {
    const timer = setTimeout(onComplete, 4000)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] pointer-events-none flex flex-col items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}
    >
      <div className="flex flex-wrap justify-center">
        {letters.map((letter, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 80, rotateX: -90, scale: 0.5 }}
            animate={{
              opacity: 1,
              y: [80, -15, 0],
              rotateX: [-90, 5, 0],
              scale: [0.5, 1.1, 1],
            }}
            transition={{
              duration: 0.7,
              delay: i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 10vw, 100px)',
              color: '#F5F0E8',
              display: 'inline-block',
              minWidth: letter === ' ' ? '0.3em' : undefined,
              textShadow: '0 0 40px rgba(255,69,0,0.3)',
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>

      {/* Waving hand */}
      <motion.span
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: [0, 20, -10, 20, -10, 0] }}
        transition={{ delay: 1, duration: 1.2 }}
        style={{ fontSize: '48px', marginTop: '16px' }}
      >
        👋
      </motion.span>

      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          color: 'rgba(245,240,232,0.45)',
          marginTop: '20px',
        }}
      >
        Thanks for exploring — you&apos;re awesome ✨
      </motion.span>
    </motion.div>
  )
}

// ─── Hire Card ──────────────────────────────────────────────────────
function HireCard({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, rotateY: -10, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, opacity: 1 }}
        exit={{ scale: 0.85, rotateY: 10, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative w-[90%] max-w-[380px] overflow-hidden"
        style={{
          backgroundColor: '#0F0E0C',
          borderRadius: '16px',
          border: '1px solid rgba(255,69,0,0.2)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 100px rgba(255,69,0,0.05)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Accent gradient strip */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #FF4500, #FF6B35, #FFB300, #FF4500)' }} />

        <div className="p-8">
          {/* Status */}
          <div className="flex items-center gap-2 mb-6">
            <motion.div
              className="w-2 h-2 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ backgroundColor: '#00FF41' }}
            />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#00FF41', letterSpacing: '2px' }}>
              AVAILABLE FOR HIRE
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', color: '#F5F0E8', lineHeight: 1 }}>
            SAHIL YADAV
          </h3>
          <p className="mt-1" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'rgba(245,240,232,0.35)', letterSpacing: '1px' }}>
            FULL-STACK DEVELOPER
          </p>

          {/* Contact links */}
          <div className="mt-6 space-y-3">
            {[
              { icon: '✉', label: 'im.sahil0111@gmail.com', href: 'mailto:im.sahil0111@gmail.com' },
              { icon: '⎇', label: 'github.com/sahil', href: '#' },
              { icon: '◉', label: 'sahilyadav.dev', href: '#' },
            ].map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                style={{
                  border: '1px solid rgba(245,240,232,0.06)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'rgba(245,240,232,0.6)',
                  textDecoration: 'none',
                  display: 'flex',
                }}
                onClick={e => e.stopPropagation()}
              >
                <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Motivational quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 p-3 rounded-lg"
            style={{ backgroundColor: 'rgba(255,69,0,0.06)', border: '1px solid rgba(255,69,0,0.1)' }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--accent)', letterSpacing: '1px' }}>
              "Let&apos;s build something extraordinary together."
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-4 text-center"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'rgba(245,240,232,0.2)' }}
          >
            Click outside or press ESC to close
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Cosmic Reveal (42) ─────────────────────────────────────────────
function CosmicReveal({ onComplete }: { onComplete: () => void }) {
  const rings = Array.from({ length: 6 }, (_, i) => i)
  const stars = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 2.5,
    delay: Math.random() * 2,
    duration: 1 + Math.random() * 1.5,
  }))

  useEffect(() => {
    const timer = setTimeout(onComplete, 5500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
    >
      {/* Twinkling stars */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: '#F5F0E8',
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: star.duration, delay: star.delay, repeat: Infinity }}
        />
      ))}

      {/* Expanding rings */}
      {rings.map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ border: `1px solid rgba(255, 69, 0, ${0.4 - i * 0.05})` }}
          initial={{ width: 0, height: 0, opacity: 0.7 }}
          animate={{ width: [0, 500 + i * 80], height: [0, 500 + i * 80], opacity: [0.5, 0] }}
          transition={{ duration: 2.5, delay: 0.2 + i * 0.35, ease: 'easeOut' }}
        />
      ))}

      {/* The Answer */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.15, 1], opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          animate={{ textShadow: ['0 0 40px rgba(255,69,0,0.3)', '0 0 80px rgba(255,69,0,0.5)', '0 0 40px rgba(255,69,0,0.3)'] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(80px, 18vw, 180px)',
            color: '#F5F0E8',
            lineHeight: 1,
          }}
        >
          42
        </motion.span>

        <motion.span
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="mt-4 text-center"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'rgba(245,240,232,0.5)',
            maxWidth: '320px',
          }}
        >
          The Answer to the Ultimate Question of Life,
          the Universe, and Everything.
        </motion.span>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            color: 'rgba(245,240,232,0.25)',
            marginTop: '12px',
          }}
        >
          — Deep Thought, 7.5 million years later
        </motion.span>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Easter Eggs Component ─────────────────────────────────────
export default function EasterEggs() {
  // Toasts & overlays
  const [toast, setToast] = useState<{ message: string; submessage?: string; icon?: string } | null>(null)
  const [showMatrix, setShowMatrix] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showKonamiGlitch, setShowKonamiGlitch] = useState(false)
  const [devMode, setDevMode] = useState(false)
  const [showDevStats, setShowDevStats] = useState(false)
  const [crtMode, setCrtMode] = useState(false)

  // Games
  const [showSnake, setShowSnake] = useState(false)
  const [showPong, setShowPong] = useState(false)
  const [showMemory, setShowMemory] = useState(false)

  // Creative effects
  const [showCoffee, setShowCoffee] = useState(false)
  const [showHello, setShowHello] = useState(false)
  const [showHire, setShowHire] = useState(false)
  const [show42, setShow42] = useState(false)

  // Hide custom cursor when any game/overlay is active
  const isOverlayActive = showSnake || showPong || showMemory || showDevStats || showHire
  useEffect(() => {
    if (isOverlayActive) {
      document.body.setAttribute('data-game-active', 'true')
    } else {
      document.body.removeAttribute('data-game-active')
    }
    return () => { document.body.removeAttribute('data-game-active') }
  }, [isOverlayActive])

  // Tracking
  const typedBuffer = useRef('')
  const konamiIndex = useRef(0)
  const toastTimer = useRef<NodeJS.Timeout | null>(null)

  const showToast = useCallback((message: string, submessage?: string, icon?: string, duration = 3500) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ message, submessage, icon })
    toastTimer.current = setTimeout(() => setToast(null), duration)
  }, [])

  // Notify mascot of events
  const notifyMascot = useCallback((type: string) => {
    window.dispatchEvent(new CustomEvent('mascot-react', { detail: { type } }))
  }, [])

  // Check typed keywords
  const checkKeyword = useCallback((buffer: string) => {
    const lower = buffer.toLowerCase()

    if (lower.endsWith('matrix')) {
      setShowMatrix(true)
      showToast('ENTERING THE MATRIX', 'Wake up, Neo...', '🔴')
      notifyMascot('matrix')
      typedBuffer.current = ''
    } else if (lower.endsWith('party')) {
      setShowConfetti(true)
      showToast('PARTY MODE 🎉', 'You deserve this', '✨')
      notifyMascot('party')
      typedBuffer.current = ''
    } else if (lower.endsWith('snake')) {
      setShowSnake(true)
      showToast('SNAKE LOADED', 'Use WASD or arrows', '🐍')
      notifyMascot('game')
      typedBuffer.current = ''
    } else if (lower.endsWith('pong')) {
      setShowPong(true)
      showToast('PONG LOADED', 'Move your mouse', '🏓')
      notifyMascot('game')
      typedBuffer.current = ''
    } else if (lower.endsWith('memory')) {
      setShowMemory(true)
      showToast('MEMORY LOADED', 'Match the tech pairs', '🧠')
      notifyMascot('game')
      typedBuffer.current = ''
    } else if (lower.endsWith('42')) {
      setShow42(true)
      notifyMascot('generic')
      typedBuffer.current = ''
    } else if (lower.endsWith('hello')) {
      setShowHello(true)
      notifyMascot('generic')
      typedBuffer.current = ''
    } else if (lower.endsWith('hire')) {
      setShowHire(true)
      notifyMascot('generic')
      typedBuffer.current = ''
    } else if (lower.endsWith('coffee')) {
      setShowCoffee(true)
      notifyMascot('coffee')
      typedBuffer.current = ''
    }
  }, [showToast, notifyMascot])

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC closes everything
      if (e.key === 'Escape') {
        setShowSnake(false)
        setShowPong(false)
        setShowMemory(false)
        setShowDevStats(false)
        setShowHire(false)
        setShowCoffee(false)
        setShowHello(false)
        setShow42(false)
        setCrtMode(false)
        setDevMode(false)
        return
      }

      // Ctrl+Shift+D → Dev Stats
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setShowDevStats(true)
        return
      }

      // Konami code check
      if (e.code === konamiCode[konamiIndex.current]) {
        konamiIndex.current++
        if (konamiIndex.current === konamiCode.length) {
          // Activate full DEV MODE with unique glitch effect
          setDevMode(true)
          setCrtMode(true)
          setShowKonamiGlitch(true)
          showToast('DEV MODE ACTIVATED', '↑↑↓↓←→←→BA — You know the classics.', '🎮', 5000)
          notifyMascot('konami')
          setTimeout(() => { setDevMode(false); setCrtMode(false) }, 15000)
          konamiIndex.current = 0
        }
      } else if (!e.code.startsWith('Arrow')) {
        konamiIndex.current = 0
      }

      // Only track letter/number keys for keyword detection
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Don't capture when user is typing in an input
        const active = document.activeElement
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return

        typedBuffer.current += e.key
        // Keep buffer manageable
        if (typedBuffer.current.length > 20) {
          typedBuffer.current = typedBuffer.current.slice(-20)
        }
        checkKeyword(typedBuffer.current)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [checkKeyword, showToast])

  // Listen for commands from the mascot terminal
  useEffect(() => {
    const handleTerminalCommand = (e: Event) => {
      const command = (e as CustomEvent).detail?.command
      if (command) {
        typedBuffer.current = command
        checkKeyword(command)
      }
    }
    window.addEventListener('terminal-command', handleTerminalCommand)
    return () => window.removeEventListener('terminal-command', handleTerminalCommand)
  }, [checkKeyword])

  // Console easter egg (enhanced)
  useEffect(() => {
    console.log(
      '%c⚡ SAHIL YADAV — PORTFOLIO ⚡',
      'color: #FF4500; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 0px #0F0E0C;'
    )
    console.log(
      '%c💡 Type these anywhere on the page:',
      'color: #F5F0E8; font-size: 13px; background: #0F0E0C; padding: 8px 12px; border-radius: 4px;'
    )
    const secrets = [
      ['snake', 'Play Snake 🐍'],
      ['pong', 'Play Pong 🏓'],
      ['memory', 'Play Memory 🧠'],
      ['matrix', 'Enter the Matrix 🔴'],
      ['party', 'Confetti burst ✨'],
      ['hello', 'Say hi 👋'],
      ['42', 'The answer 🌌'],
      ['hire', 'Contact info 💼'],
      ['coffee', 'Fuel status ☕'],
      ['↑↑↓↓←→←→BA', 'DEV MODE 🎮'],
      ['Ctrl+Shift+D', 'Dev stats panel 📊'],
    ]
    secrets.forEach(([key, desc]) => {
      console.log(
        `%c  ${key.padEnd(18)} %c→ ${desc}`,
        'color: #FF4500; font-family: monospace; font-size: 12px;',
        'color: #8C8780; font-family: monospace; font-size: 12px;'
      )
    })
  }, [])

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} submessage={toast.submessage} icon={toast.icon} />}
      </AnimatePresence>

      {/* Matrix Rain */}
      <AnimatePresence>
        {showMatrix && <MatrixRain onComplete={() => setShowMatrix(false)} />}
      </AnimatePresence>

      {/* Party Fireworks */}
      <AnimatePresence>
        {showConfetti && <PartyFireworks onComplete={() => setShowConfetti(false)} />}
      </AnimatePresence>

      {/* Konami Glitch */}
      <AnimatePresence>
        {showKonamiGlitch && <KonamiGlitch onComplete={() => setShowKonamiGlitch(false)} />}
      </AnimatePresence>

      {/* Dev Stats Panel */}
      <AnimatePresence>
        {showDevStats && <DevStatsPanel onClose={() => setShowDevStats(false)} />}
      </AnimatePresence>

      {/* Snake Game */}
      <AnimatePresence>
        {showSnake && <SnakeGame onClose={() => setShowSnake(false)} />}
      </AnimatePresence>

      {/* Pong Game */}
      <AnimatePresence>
        {showPong && <PongGame onClose={() => setShowPong(false)} />}
      </AnimatePresence>

      {/* Memory Game */}
      <AnimatePresence>
        {showMemory && <MemoryGame onClose={() => setShowMemory(false)} />}
      </AnimatePresence>

      {/* Coffee Effect */}
      <AnimatePresence>
        {showCoffee && <CoffeeEffect onComplete={() => setShowCoffee(false)} />}
      </AnimatePresence>

      {/* Hello Wave */}
      <AnimatePresence>
        {showHello && <HelloWave onComplete={() => setShowHello(false)} />}
      </AnimatePresence>

      {/* Hire Card */}
      <AnimatePresence>
        {showHire && <HireCard onClose={() => setShowHire(false)} />}
      </AnimatePresence>

      {/* Cosmic Answer 42 */}
      <AnimatePresence>
        {show42 && <CosmicReveal onComplete={() => setShow42(false)} />}
      </AnimatePresence>

      {/* CRT Scanline Effect (Konami DEV MODE) */}
      <AnimatePresence>
        {crtMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[9990]"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 3px)',
              mixBlendMode: 'multiply',
            }}
          />
        )}
      </AnimatePresence>

      {/* Dev Mode accent override */}
      {devMode && (
        <style>{`
          :root {
            --accent: #00FF41 !important;
          }
        `}</style>
      )}
    </>
  )
}
