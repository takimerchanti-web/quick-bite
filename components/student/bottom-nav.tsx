'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Clock3, History, House, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

const TABS = [
  { href: '/app/home', label: 'Menu', icon: House },
  { href: '/app/queue', label: 'Queue', icon: Clock3 },
  { href: '/app/cart', label: 'Cart', icon: ShoppingBag },
  { href: '/app/orders', label: 'Orders', icon: History },
  { href: '/app/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const { cartCount } = useAppStore()

  return (
    <nav
      aria-label="Student app sections"
      className="sticky bottom-0 z-30 mt-auto border-t border-border bg-card/95 backdrop-blur"
    >
      <ul className="flex items-stretch justify-between px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`)
          const Icon = tab.icon
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-xl py-1.5 text-[11px] font-medium transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <span className="relative">
                  <Icon
                    className={cn('size-5', active && 'stroke-[2.4]')}
                    aria-hidden="true"
                  />
                  {tab.href === '/app/cart' && cartCount > 0 ? (
                    <span className="absolute -top-1.5 -right-2 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                      {cartCount}
                    </span>
                  ) : null}
                </span>
                {tab.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
