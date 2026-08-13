import { useEffect, useState } from 'react'

interface ConfettiProps {
  show: boolean
  onComplete?: () => void
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  rotation: number
  delay: number
  size: number
}

const COLORS = [
  'var(--primary-400)', 'var(--primary-500)',
  'var(--secondary-400)', 'var(--secondary-500)',
  'var(--accent-400)', 'var(--warning-400)',
  'var(--success-400)', 'var(--info-400)',
]

export default function Confetti({ show, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    if (!show) {
      setParticles([])
      return
    }

    const newParticles: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      delay: Math.random() * 0.6,
      size: 6 + Math.random() * 8,
    }))

    setParticles(newParticles)

    const timer = setTimeout(() => {
      onComplete?.()
    }, 2500)

    return () => clearTimeout(timer)
  }, [show, onComplete])

  if (!show) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  )
}
