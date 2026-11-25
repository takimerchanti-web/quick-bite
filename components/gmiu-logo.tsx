import Image from 'next/image'
import { cn } from '@/lib/utils'

export function GmiuLogo({
  size = 44,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-card ring-1 ring-border',
        className,
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/gmiu-emblem.png"
        alt="Gyanmanjari Innovative University emblem"
        width={size}
        height={size}
        className="h-full w-full object-cover"
      />
    </span>
  )
}

export function GmiuFooter({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'text-center text-[11px] tracking-wide text-muted-foreground',
        className,
      )}
    >
      Made for GMIU Students · Gyanmanjari Innovative University, Bhavnagar
    </p>
  )
}
