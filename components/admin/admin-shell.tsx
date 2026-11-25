'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  ChartColumn,
  LogOut,
  ScanLine,
  Smartphone,
  UtensilsCrossed,
  Zap,
} from 'lucide-react'
import { GmiuLogo } from '@/components/gmiu-logo'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin/orders', label: 'Live orders', icon: Zap },
  { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/admin/reports', label: 'Sales report', icon: ChartColumn },
  { href: '/admin/scanner', label: 'Token scanner', icon: ScanLine },
]

export function AdminShell({
  children,
  title,
  description,
  actions,
}: {
  children: ReactNode
  title: string
  description: string
  actions?: ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-svh bg-background">
      {/* sidebar */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col bg-sidebar px-3 py-5 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2.5 px-2">
          <GmiuLogo size={36} />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-sidebar-accent-foreground">
              GMIU Canteen
            </p>
            <p className="text-[10px] text-sidebar-foreground/60">
              Staff console
            </p>
          </div>
        </div>

        <nav className="mt-7 flex-1" aria-label="Dashboard sections">
          <ul className="space-y-1">
            {NAV.map((n) => {
              const active = pathname === n.href
              const Icon = n.icon
              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {n.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="space-y-1 border-t border-sidebar-border pt-3">
          <Link
            href="/app/home"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Smartphone className="size-4" aria-hidden="true" />
            Student app
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </Link>
          <p className="px-3 pt-2 text-[10px] leading-relaxed text-sidebar-foreground/40">
            Made for GMIU Students · Bhavnagar
          </p>
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-card/95 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-display text-xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {description}
              </p>
            </div>
            {actions}
          </div>

          {/* mobile nav */}
          <nav
            className="mt-4 flex gap-2 overflow-x-auto lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Dashboard sections"
          >
            {NAV.map((n) => {
              const active = pathname === n.href
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {n.label}
                </Link>
              )
            })}
          </nav>
        </header>

        <main className="flex-1 px-5 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
