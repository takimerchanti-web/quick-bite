'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Pomodoro-style countdown ring for the estimated wait time.
 */
export function WaitTimer({
  minutes,
  size = 176,
  className,
  label = 'Estimated wait',
}: {
  minutes: number
  size?: number
  className?: string
  label?: string
}) {
  const total = Math.max(1, minutes) * 60
  const [remaining, setRemaining] = useState(total)

  useEffect(() => {
    setRemaining(total)
  }, [total])

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((r) => (r <= 0 ? 0 : r - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const pct = remaining / total
  const stroke = 12
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const mm = Math.floor(remaining / 60)
  const ss = remaining % 60
  const done = remaining === 0

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
      role="timer"
      aria-live="off"
      aria-label={`${label}: ${mm} minutes ${ss} seconds remaining`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-primary-foreground/15"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          className={cn(
            'transition-[stroke-dashoffset] duration-1000 ease-linear',
            done ? 'stroke-success' : 'stroke-accent',
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold tabular">
          {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
        </span>
        <span className="mt-0.5 text-[10px] font-semibold tracking-[0.16em] uppercase opacity-70">
          {done ? 'Ready now' : label}
        </span>
      </div>
    </div>
  )
}
