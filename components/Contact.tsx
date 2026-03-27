'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactLinks = [
  { platform: 'GITHUB', value: 'github.com/imsahil11', href: 'https://github.com/imsahil11', icon: '{ }' },
  { platform: 'LINKEDIN', value: 'linkedin.com/in/imsahil11', href: 'https://linkedin.com/in/imsahil11', icon: 'in' },
  { platform: 'EMAIL', value: 'im.sahil0111@gmail.com', href: 'mailto:im.sahil0111@gmail.com', icon: '@' },
]

const AnimatedInput = React.forwardRef<HTMLInputElement, {
  label: string
  error?: string
  type?: string
} & React.InputHTMLAttributes<HTMLInputElement>>(function AnimatedInput({ 
  label, 
  error, 
  type = 'text',
  onBlur: externalOnBlur,
  onChange: externalOnChange,
  ...props 
}, ref) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  
  return (
    <div className="relative mb-6 sm:mb-8">
      <motion.label
        className="absolute left-0 pointer-events-none"
        animate={{
          top: isFocused || hasValue ? 0 : 28,
          fontSize: isFocused || hasValue ? '10px' : '15px',
          color: isFocused ? 'var(--accent)' : 'var(--muted)',
        }}
        transition={{ duration: 0.2 }}
        style={{
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        {label}
      </motion.label>
      <input
        ref={ref}
        type={type}
        className="w-full pt-6 pb-3 bg-transparent outline-none"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          color: 'var(--text)',
          border: 'none',
          borderBottom: `2px solid ${error ? 'var(--accent)' : isFocused ? 'var(--accent)' : 'var(--border)'}`,
          transition: 'border-color 0.3s ease',
          borderRadius: 0,
          WebkitAppearance: 'none',
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false)
          setHasValue(e.target.value.length > 0)
          externalOnBlur?.(e)
        }}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0)
          externalOnChange?.(e)
        }}
        {...props}
      />
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs mt-2 block"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          {error}
        </motion.span>
      )}
    </div>
  )
})

const AnimatedTextarea = React.forwardRef<HTMLTextAreaElement, {
  label: string
  error?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function AnimatedTextarea({ 
  label, 
  error,
  onBlur: externalOnBlur,
  onChange: externalOnChange,
  ...props 
}, ref) {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)
  
  return (
    <div className="relative mb-6 sm:mb-8">
      <motion.label
        className="absolute left-0 pointer-events-none"
        animate={{
          top: isFocused || hasValue ? 0 : 28,
          fontSize: isFocused || hasValue ? '10px' : '15px',
          color: isFocused ? 'var(--accent)' : 'var(--muted)',
        }}
        transition={{ duration: 0.2 }}
        style={{
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        {label}
      </motion.label>
      <textarea
        ref={ref}
        rows={4}
        className="w-full pt-6 pb-3 bg-transparent outline-none resize-none"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '16px',
          color: 'var(--text)',
          border: 'none',
          borderBottom: `2px solid ${error ? 'var(--accent)' : isFocused ? 'var(--accent)' : 'var(--border)'}`,
          transition: 'border-color 0.3s ease',
          borderRadius: 0,
          WebkitAppearance: 'none',
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false)
          setHasValue(e.target.value.length > 0)
          externalOnBlur?.(e)
        }}
        onChange={(e) => {
          setHasValue(e.target.value.length > 0)
          externalOnChange?.(e)
        }}
        {...props}
      />
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs mt-2 block"
          style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
        >
          {error}
        </motion.span>
      )}
    </div>
  )
})

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<number | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !headingRef.current) return

    const ctx = gsap.context(() => {
      const chars = headingRef.current?.querySelectorAll('.char')
      chars?.forEach((char, i) => {
        gsap.fromTo(
          char,
          { y: '100%', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
            },
            delay: i * 0.03,
          }
        )
      })
    }, headingRef)

    return () => ctx.revert()
  }, [])

  const onSubmit = async (data: ContactFormData) => {
    console.log('Form submitted:', data)
    setIsSubmitted(true)
  }

  const headingText = "LET'S BUILD"

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen px-5 md:px-6 lg:px-[120px] py-16 md:py-[120px] overflow-hidden"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute right-0 top-0 w-[50%] h-[50%] opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle at top right, var(--accent) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Section Label */}
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        className="block mb-6 sm:mb-8"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '2px',
        }}
      >
        05 — Get In Touch
      </motion.span>

      {/* Heading with character animation */}
      <div ref={headingRef} className="mb-10 md:mb-16 overflow-hidden">
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 10vw, 140px)',
            color: 'var(--text)',
            lineHeight: 0.95,
            margin: 0,
          }}
        >
          {headingText.split('').map((char, i) => (
            <span key={i} className="char inline-block" style={{ opacity: 0 }}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h2>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 10vw, 140px)',
            color: 'var(--text)',
            lineHeight: 0.95,
            margin: 0,
          }}
        >
          {'SOMETHING'.split('').map((char, i) => (
            <span key={i} className="char inline-block" style={{ opacity: 0 }}>
              {char}
            </span>
          ))}
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-block gradient-text"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(44px, 10vw, 140px)',
            }}
          >
            .
          </motion.span>
        </h2>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-10 md:gap-16 lg:gap-20">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ delay: 0.3 }}
        >
          <p
            className="mb-8 sm:mb-12"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--muted)',
              lineHeight: 1.8,
            }}
          >
            I'm actively looking for internships, freelance projects, and interesting problems to work on.
            If you're building something and need a developer who takes quality seriously — reach out.
          </p>

          {/* Contact Links */}
          <div>
            {contactLinks.map((link, i) => (
              <motion.a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center py-4 sm:py-5 relative overflow-hidden group"
                style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={() => !isTouchDevice && setHoveredLink(i)}
                onMouseLeave={() => !isTouchDevice && setHoveredLink(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Hover background — desktop only */}
                {!isTouchDevice && (
                  <motion.div
                    className="absolute inset-0 origin-left"
                    style={{ backgroundColor: 'var(--surface)' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredLink === i ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
                  />
                )}

                {/* Icon — always accent on mobile */}
                <span
                  className="relative z-10 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center mr-3 sm:mr-4 transition-colors duration-300"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: isTouchDevice || hoveredLink === i ? 'var(--bg)' : 'var(--muted)',
                    backgroundColor: isTouchDevice || hoveredLink === i ? 'var(--accent)' : 'transparent',
                    border: `1px solid ${isTouchDevice || hoveredLink === i ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                >
                  {link.icon}
                </span>

                <div className="relative z-10 flex-1 min-w-0">
                  <span
                    className="block"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--muted)',
                      marginBottom: '4px',
                    }}
                  >
                    {link.platform}
                  </span>
                  <span
                    className="transition-colors duration-300 block truncate"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      color: hoveredLink === i ? 'var(--accent)' : 'var(--text)',
                    }}
                  >
                    {link.value}
                  </span>
                </div>

                {/* Arrow — always visible on mobile */}
                <motion.span
                  className="relative z-10 shrink-0"
                  initial={isTouchDevice ? { x: 0, opacity: 0.6 } : { x: -10, opacity: 0 }}
                  animate={isTouchDevice 
                    ? { x: 0, opacity: 0.6 } 
                    : { x: hoveredLink === i ? 0 : -10, opacity: hoveredLink === i ? 1 : 0 }
                  }
                  transition={{ duration: 0.2 }}
                  style={{ fontSize: '18px', color: 'var(--accent)' }}
                >
                  ↗
                </motion.span>
              </motion.a>
            ))}
          </div>

          {/* Additional CTA */}
          <motion.div
            className="mt-8 sm:mt-12 p-5 sm:p-6 relative overflow-hidden"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.7 }}
          >
            <div className="shimmer absolute inset-0" />
            <span
              className="block mb-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--accent)',
                letterSpacing: '2px',
              }}
            >
              PREFER A QUICK CALL?
            </span>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--muted)',
              }}
            >
              Schedule a 15-min chat to discuss your project
            </p>
          </motion.div>
        </motion.div>

        {/* Right Column - Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ delay: 0.4 }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className={isSubmitted ? 'pointer-events-none' : ''}>
            <AnimatedInput
              label="Your Name"
              {...register('name')}
              disabled={isSubmitted}
              error={errors.name?.message}
            />

            <AnimatedInput
              label="Email Address"
              type="email"
              {...register('email')}
              disabled={isSubmitted}
              error={errors.email?.message}
            />

            <AnimatedTextarea
              label="Your Message"
              {...register('message')}
              disabled={isSubmitted}
              error={errors.message?.message}
            />

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitted}
              className="group relative w-full h-14 sm:h-16 overflow-hidden"
              style={{
                backgroundColor: 'var(--text)',
                color: 'var(--bg)',
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                letterSpacing: '3px',
                border: 'none',
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                className="absolute inset-0 origin-left"
                style={{ backgroundColor: 'var(--accent)' }}
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitted ? (
                  <>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      ✓
                    </motion.span>
                    MESSAGE SENT
                  </>
                ) : (
                  <>
                    SEND MESSAGE
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Success message */}
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-6 text-center"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--accent)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  color: 'var(--accent)',
                }}
              >
                THANK YOU!
              </span>
              <p
                className="mt-2"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--muted)',
                }}
              >
                I'll get back to you within 24 hours.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
