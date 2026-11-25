import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Renders a screen inside a phone-like frame on wide viewports and
 * full-bleed on real mobile devices.
 */
export function PhoneShell({
  children,
  className,
  label,
}: {
  children: ReactNode
  className?: string
  label?: string
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div
        className={cn(
          'relative w-full overflow-hidden bg-background',
          'sm:w-[390px] sm:rounded-[2.5rem] sm:border-8 sm:border-primary sm:shadow-2xl',
          className,
        )}
      >
        <div className="hidden items-center justify-center pt-2 sm:flex">
          <span className="h-1.5 w-24 rounded-full bg-primary-foreground/25" />
        </div>
        <div className="flex min-h-[100svh] flex-col sm:min-h-[780px]">
          {children}
        </div>
      </div>
      {label ? (
        <p className="hidden text-xs font-medium text-muted-foreground sm:block">
          {label}
        </p>
      ) : null}
    </div>
  )
}
