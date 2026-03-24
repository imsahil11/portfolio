'use client'

import { useState } from 'react'
import SmoothScroll from '@/components/SmoothScroll'
import Cursor from '@/components/Cursor'
import NoiseOverlay from '@/components/NoiseOverlay'
import ScrollProgress from '@/components/ScrollProgress'
import PageLoader from '@/components/PageLoader'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Work from '@/components/Work'
import Skills from '@/components/Skills'
import Resume from '@/components/Resume'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'
import EasterEggs from '@/components/EasterEggs'
import Mascot from '@/components/Mascot'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <SmoothScroll>
      <PageLoader onComplete={() => setIsLoaded(true)} />
      <Cursor />
      <NoiseOverlay />
      <ScrollProgress />
      <EasterEggs />
      <Mascot />
      
      <main>
        <Navigation />
        <Hero isLoaded={isLoaded} />
        <About />
        <Work />
        <Skills />
        <Resume />
        <Contact />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
