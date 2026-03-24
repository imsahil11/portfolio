'use client'

import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })
  const glowOpacity = useTransform(scrollYProgress, [0, 0.1, 0.5, 1], [0, 1, 1, 1])

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-[72px] left-0 right-0 h-[2px] z-[999] origin-left"
        style={{
          scaleX,
          background: 'linear-gradient(90deg, var(--accent) 0%, #FF6B35 60%, #FFB300 100%)',
        }}
      />
      {/* Glow effect */}
      <motion.div
        className="fixed top-[72px] left-0 right-0 h-[6px] z-[998] origin-left pointer-events-none"
        style={{
          scaleX,
          opacity: glowOpacity,
          background: 'linear-gradient(90deg, rgba(255,69,0,0.4) 0%, rgba(255,107,53,0.3) 60%, rgba(255,179,0,0.2) 100%)',
          filter: 'blur(4px)',
        }}
      />
    </>
  )
}
