'use client'

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Extremely subtle warm gradient — barely visible temperature shift */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 245, 235, 0.5) 0%, transparent 60%),
            radial-gradient(ellipse 100% 90% at 20% 80%, rgba(248, 240, 228, 0.4) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  )
}
