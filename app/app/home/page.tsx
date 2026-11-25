'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Bell, ChevronRight, MapPin, Search, Timer } from 'lucide-react'
import { GmiuLogo } from '@/components/gmiu-logo'
import { MenuCard } from '@/components/student/menu-card'
import { Input } from '@/components/ui/input'
import { CATEGORIES, STUDENT, rupee, type MenuCategory } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const { menu, campus, activeOrder, cartCount, cartTotal } = useAppStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<MenuCategory | 'All'>('All')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menu.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [menu, query, category])

  return (
    <div className="flex flex-1 flex-col">
      {/* header */}
      <header className="rounded-b-[2rem] bg-primary px-5 pt-8 pb-6 text-primary-foreground">
        <div className="flex items-center gap-3">
          <GmiuLogo size={40} />
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[11px] text-primary-foreground/70">
              Namaste, {STUDENT.name.split(' ')[0]}
            </p>
            <p className="flex items-center gap-1 text-sm font-semibold">
              <MapPin className="size-3.5 text-accent" aria-hidden="true" />
              {campus}
            </p>
          </div>
          <span className="relative flex size-10 items-center justify-center rounded-xl bg-primary-foreground/10">
            <Bell className="size-4.5" aria-hidden="true" />
            <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-accent" />
            <span className="sr-only">Notifications</span>
          </span>
        </div>

        <h1 className="mt-5 font-display text-[26px] leading-tight font-bold tracking-tight text-balance">
          What are you eating today?
        </h1>

        <div className="relative mt-4">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dosa, chai, thali…"
            aria-label="Search the canteen menu"
            className="h-12 rounded-2xl border-transparent bg-card pl-10 text-foreground shadow-sm"
          />
        </div>
      </header>

      {/* active token strip */}
      {activeOrder ? (
        <Link
          href="/app/queue"
          className="mx-4 -mt-4 flex items-center gap-3 rounded-2xl bg-accent px-4 py-3 text-accent-foreground shadow-lg shadow-accent/25"
        >
          <Timer className="size-5 shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-wide uppercase opacity-80">
              Token #{activeOrder.token} · {activeOrder.status}
            </p>
            <p className="truncate text-sm font-semibold">
              Ready in about {activeOrder.etaMinutes} min
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0" aria-hidden="true" />
        </Link>
      ) : null}

      {/* categories */}
      <div className="mt-5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-2">
          {(['All', ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                'rounded-full px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors',
                category === c
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground ring-1 ring-border hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* menu list */}
      <section className="flex-1 px-4 pt-4 pb-28">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-display text-sm font-semibold">
            Live menu
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {results.length} items
            </span>
          </h2>
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-success">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            Canteen open till 6 PM
          </span>
        </div>

        <div className="space-y-3">
          {results.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
          {results.length === 0 ? (
            <p className="rounded-2xl bg-card p-6 text-center text-sm text-muted-foreground ring-1 ring-border">
              No items match &ldquo;{query}&rdquo;.
            </p>
          ) : null}
        </div>
      </section>

      {/* floating cart bar */}
      {cartCount > 0 ? (
        <div className="sticky bottom-16 z-20 px-4 pb-2">
          <Link
            href="/app/cart"
            className="flex items-center justify-between rounded-2xl bg-primary px-4 py-3.5 text-primary-foreground shadow-xl"
          >
            <span className="text-sm font-semibold">
              {cartCount} item{cartCount > 1 ? 's' : ''} ·{' '}
              <span className="tabular">{rupee(cartTotal)}</span> cash
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-accent">
              View cart
              <ChevronRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
        </div>
      ) : null}
    </div>
  )
}
