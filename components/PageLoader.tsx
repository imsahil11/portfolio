'use client'

import { useEffect, useState } from 'react'
import { gsap } from 'gsap'

export default function PageLoader({ onComplete }: { onComplete: () => void }) {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    // Check if already loaded this session
    const hasLoaded = sessionStorage.getItem('hasLoaded')
    if (hasLoaded) {
      setShowLoader(false)
      onComplete()
      return
    }

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      sessionStorage.setItem('hasLoaded', 'true')
      setShowLoader(false)
      onComplete()
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('hasLoaded', 'true')
        setShowLoader(false)
        onComplete()
      }
    })

    // Animation sequence
    tl.fromTo('.loader-logo', 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.3, delay: 0.3 }
    )
    .to('.loader-logo', 
      { scale: 1.3, duration: 0.2, delay: 0.4 }
    )
    .to('.loader-logo', 
      { opacity: 0, duration: 0.2 }
    )
    .fromTo('.loader-bar',
      { left: '0%', width: '0%' },
      { width: '100%', duration: 0.4, ease: 'power2.out' },
      '-=0.1'
    )
    .to('.loader-bar',
      { left: '100%', width: '0%', duration: 0.2, ease: 'power2.in' }
    )
    .to('.loader-overlay',
      { y: '-100%', duration: 0.5, ease: 'power2.inOut' }
    )

    return () => {
      tl.kill()
    }
  }, [onComplete])

  if (!showLoader) return null

  return (
    <div 
      className="loader-overlay fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-dark)' }}
    >
      <span 
        className="loader-logo"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '48px',
          color: 'var(--accent)',
          opacity: 0,
        }}
      >
        SY
      </span>
      <div 
        className="loader-bar absolute"
        style={{
          height: '4px',
          backgroundColor: 'var(--accent)',
          top: '50%',
          left: '0%',
          width: '0%',
        }}
      />
    </div>
  )
}
