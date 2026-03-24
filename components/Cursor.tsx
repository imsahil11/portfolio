'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'

type CursorMode = 'default' | 'link' | 'text' | 'project' | 'drag' | 'view' | 'magnetic'

interface TrailPoint {
  x: number
  y: number
  life: number
}

export default function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const dprRef = useRef(1)
  const [gameActive, setGameActive] = useState(false)
  const [cursorMode, setCursorMode] = useState<CursorMode>('default')
  const [cursorText, setCursorText] = useState('')
  const [isVisible, setIsVisible] = useState(true)

  const mouse = useRef({ x: -100, y: -100 })
  const dotPos = useRef({ x: -100, y: -100 })
  const trail = useRef<TrailPoint[]>([])
  const rafId = useRef(0)
  const magneticEls = useRef<Map<HTMLElement, boolean>>(new Map())
  const currentModeRef = useRef<CursorMode>('default')
  const currentTextRef = useRef('')

  const setCursorState = useCallback((mode: CursorMode, text = '') => {
    if (currentModeRef.current !== mode) {
      currentModeRef.current = mode
      setCursorMode(mode)
    }

    if (currentTextRef.current !== text) {
      currentTextRef.current = text
      setCursorText(text)
    }
  }, [])

  const resolveCursorState = useCallback((element: HTMLElement | null) => {
    if (!element) {
      setCursorState('default')
      return
    }

    const cursorHost = element.closest('[data-cursor]') as HTMLElement | null
    const cursorType = cursorHost?.getAttribute('data-cursor')
    const cursorTextValue =
      cursorHost?.getAttribute('data-cursor-text') ||
      element.closest('[data-cursor-text]')?.getAttribute('data-cursor-text') ||
      ''

    if (cursorType === 'view') {
      setCursorState('view', cursorTextValue || 'VIEW')
      return
    }

    if (cursorType === 'drag') {
      setCursorState('drag', cursorTextValue || 'DRAG')
      return
    }

    if (cursorType === 'project') {
      setCursorState('project', cursorTextValue || 'OPEN')
      return
    }

    if (element.closest('input') || element.closest('textarea')) {
      setCursorState('text')
      return
    }

    if (element.closest('a') || element.closest('button')) {
      setCursorState('link')
      return
    }

    setCursorState('default')
  }, [setCursorState])

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setGameActive(document.body.hasAttribute('data-game-active'))
    })
    obs.observe(document.body, { attributes: true, attributeFilter: ['data-game-active'] })
    return () => obs.disconnect()
  }, [])

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    dprRef.current = dpr
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
  }, [])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const dpr = dprRef.current

    if (canvas && ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Add trail point with minimum distance threshold
      const last = trail.current[trail.current.length - 1]
      const dx = mouse.current.x - (last?.x ?? -999)
      const dy = mouse.current.y - (last?.y ?? -999)
      if (dx * dx + dy * dy > 4) {
        trail.current.push({ x: mouse.current.x, y: mouse.current.y, life: 1 })
      }

      // Limit trail length + decay
      if (trail.current.length > 100) trail.current.splice(0, trail.current.length - 100)
      for (const p of trail.current) p.life -= 0.018
      trail.current = trail.current.filter(p => p.life > 0)

      const pts = trail.current
      if (pts.length > 2) {
        // Pass 1 — Wide ambient glow (additive blend)
        ctx.save()
        ctx.globalCompositeOperation = 'lighter'
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i], prev = pts[i - 1]
          const t = p.life
          ctx.beginPath()
          ctx.moveTo(prev.x, prev.y)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = `rgba(255, 69, 0, ${t * 0.04})`
          ctx.lineWidth = t * 20
          ctx.stroke()
        }
        ctx.restore()

        // Pass 2 — Core ribbon
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i], prev = pts[i - 1]
          const t = p.life
          ctx.beginPath()
          ctx.moveTo(prev.x, prev.y)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = `rgba(255, 69, 0, ${t * 0.25})`
          ctx.lineWidth = t * 2.5
          ctx.stroke()
        }

        // Pass 3 — Hot bright center
        for (let i = 1; i < pts.length; i++) {
          const p = pts[i], prev = pts[i - 1]
          const t = p.life
          ctx.beginPath()
          ctx.moveTo(prev.x, prev.y)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = `rgba(255, 200, 150, ${t * 0.15})`
          ctx.lineWidth = Math.max(t * 0.8, 0.3)
          ctx.stroke()
        }
      }
    }

    // Dot — tight follow
    dotPos.current.x += (mouse.current.x - dotPos.current.x) * 0.25
    dotPos.current.y += (mouse.current.y - dotPos.current.y) * 0.25

    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0)`
    }

    rafId.current = requestAnimationFrame(render)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsVisible(false)
      return
    }

    setupCanvas()
    window.addEventListener('resize', setupCanvas)

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      resolveCursorState(document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)

      magneticEls.current.forEach((_, el) => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const d = Math.hypot(e.clientX - cx, e.clientY - cy)
        if (d < 100) {
          const pull = (100 - d) / 100
          gsap.to(el, { x: (e.clientX - cx) * pull * 0.3, y: (e.clientY - cy) * pull * 0.3, duration: 0.3, ease: 'power2.out' })
        } else {
          gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1,0.3)' })
        }
      })
    }

    const onDown = () => {
      if (dotRef.current) gsap.to(dotRef.current.querySelector('.c-dot'), { scale: 0.5, duration: 0.1 })
    }

    const onUp = () => {
      if (dotRef.current) gsap.to(dotRef.current.querySelector('.c-dot'), { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.3)' })
    }

    const setupMag = () => {
      document.querySelectorAll('[data-magnetic]').forEach(el => magneticEls.current.set(el as HTMLElement, true))
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('mouseup', onUp)
    rafId.current = requestAnimationFrame(render)
    setTimeout(setupMag, 500)

    const mutObs = new MutationObserver(() => setTimeout(setupMag, 100))
    mutObs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('resize', setupCanvas)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(rafId.current)
      mutObs.disconnect()
    }
  }, [render, resolveCursorState, setupCanvas])

  if (!isVisible || gameActive) return null

  const isExpanded = ['project', 'view', 'drag'].includes(cursorMode)
  const isLink = cursorMode === 'link'
  const isText = cursorMode === 'text'

  return (
    <>
      {/* Canvas trail */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9996]" />

      {/* Dot — tight follow */}
      <div ref={dotRef} className="fixed pointer-events-none z-[9999]" style={{ top: 0, left: 0, willChange: 'transform' }}>
        <div className="c-dot relative">
          <div style={{
            width: isText ? 2 : isExpanded ? 10 : isLink ? 7 : 6,
            height: isText ? 20 : isExpanded ? 10 : isLink ? 7 : 6,
            borderRadius: isText ? '1px' : '50%',
            backgroundColor: '#FF4500',
            transform: 'translate(-50%, -50%)',
            transition: 'width 0.35s cubic-bezier(0.23,1,0.32,1), height 0.35s cubic-bezier(0.23,1,0.32,1)',
            boxShadow: isText ? 'none' : isExpanded ? '0 0 28px rgba(255,69,0,0.35), 0 0 12px rgba(255,69,0,0.5), 0 0 4px rgba(255,69,0,0.85)' : '0 0 20px rgba(255,69,0,0.4), 0 0 8px rgba(255,69,0,0.6), 0 0 3px rgba(255,69,0,0.9)',
          }} />
          {isLink && (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: '-15px',
                  top: '0px',
                  width: '8px',
                  height: '1px',
                  backgroundColor: 'rgba(255,69,0,0.75)',
                  transform: 'translateY(-50%)',
                  animation: 'c-link-left 1s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '9px',
                  top: '0px',
                  width: '8px',
                  height: '1px',
                  backgroundColor: 'rgba(255,69,0,0.75)',
                  transform: 'translateY(-50%)',
                  animation: 'c-link-right 1s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '-3px',
                  top: '-12px',
                  width: '12px',
                  height: '12px',
                  border: '1px solid rgba(255,69,0,0.22)',
                  borderRadius: '999px',
                  animation: 'c-link-pulse 1.6s ease-out infinite',
                }}
              />
            </>
          )}
          {isExpanded && cursorText && (
            <div
              style={{
                position: 'absolute',
                left: '18px',
                top: '-10px',
                padding: '5px 9px',
                backgroundColor: 'rgba(15,14,12,0.92)',
                color: '#F5F0E8',
                border: '1px solid rgba(255,69,0,0.28)',
                borderRadius: '999px',
                fontFamily: 'var(--font-mono)',
                fontSize: '9px',
                fontWeight: 600,
                letterSpacing: '1.6px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                boxShadow: '0 10px 30px rgba(15,14,12,0.2)',
                animation: 'c-chip-in 0.22s ease-out',
              }}
            >
              {cursorText}
            </div>
          )}
          {isText && (
            <div style={{ position: 'absolute', width: 2, height: 20, backgroundColor: '#FF4500', transform: 'translate(-50%, -50%)', animation: 'c-blink 1s steps(1) infinite' }} />
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes c-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes c-link-left {
          0%, 100% { transform: translateY(-50%) translateX(0); opacity: 0.45; }
          50% { transform: translateY(-50%) translateX(-3px); opacity: 1; }
        }
        @keyframes c-link-right {
          0%, 100% { transform: translateY(-50%) translateX(0); opacity: 0.45; }
          50% { transform: translateY(-50%) translateX(3px); opacity: 1; }
        }
        @keyframes c-link-pulse {
          0% { transform: scale(0.85); opacity: 0; }
          25% { opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes c-chip-in {
          0% { opacity: 0; transform: translateY(4px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}
