'use client'

import { useMemo, useState } from 'react'
import {
  BellRing,
  Check,
  ChefHat,
  Clock3,
  IndianRupee,
  Search,
  Users,
} from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LIVE_QUEUE, rupee, type OrderStatus, type QueueOrder } from '@/lib/data'
import { cn } from '@/lib/utils'

const COLUMNS: { status: OrderStatus; label: string; icon: typeof ChefHat }[] = [
  { status: 'Preparing', label: 'Preparing', icon: ChefHat },
  { status: 'Ready', label: 'Ready for pickup', icon: BellRing },
  { status: 'Collected', label: 'Collected', icon: Check },
]

export default function AdminOrdersPage() {
  const [queue, setQueue] = useState<QueueOrder[]>(LIVE_QUEUE)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return queue
    return queue.filter(
      (o) =>
        String(o.token).includes(q) ||
        o.student.toLowerCase().includes(q) ||
        o.enrollment.toLowerCase().includes(q),
    )
  }, [queue, query])

  const advance = (id: string, status: OrderStatus) =>
    setQueue((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))

  const preparing = queue.filter((o) => o.status === 'Preparing')
  const ready = queue.filter((o) => o.status === 'Ready')
  const cash = queue
    .filter((o) => o.status === 'Collected')
    .reduce((s, o) => s + o.total, 0)

  return (
    <AdminShell
      title="Live orders"
      description="Main Campus counter · auto-refreshing every 5 seconds"
      actions={
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-success/12 px-3 py-1.5 text-xs font-semibold text-success">
            <span className="size-1.5 animate-pulse rounded-full bg-success" />
            Live
          </span>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Token, name or enrollment"
              aria-label="Search live orders"
              className="h-9 w-56 rounded-xl pl-8 text-xs"
            />
          </div>
        </div>
      }
    >
      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={ChefHat}
          label="In kitchen"
          value={String(preparing.length)}
          hint="tokens being cooked"
        />
        <Kpi
          icon={BellRing}
          label="Awaiting pickup"
          value={String(ready.length)}
          hint="students called to counter"
          accent
        />
        <Kpi
          icon={Clock3}
          label="Avg. prep time"
          value="6.4 min"
          hint="last 20 tokens"
        />
        <Kpi
          icon={IndianRupee}
          label="Cash collected"
          value={rupee(cash)}
          hint="this shift"
        />
      </div>

      {/* kanban columns */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const orders = filtered.filter((o) => o.status === col.status)
          const Icon = col.icon
          return (
            <section
              key={col.status}
              className="rounded-2xl bg-card p-3 ring-1 ring-border"
            >
              <header className="flex items-center justify-between px-1 pb-3">
                <h2 className="flex items-center gap-2 font-display text-sm font-semibold">
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  {col.label}
                </h2>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[11px] font-bold tabular',
                    col.status === 'Ready'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {orders.length}
                </span>
              </header>

              <ul className="space-y-2.5">
                {orders.map((o) => (
                  <li
                    key={o.id}
                    className="rounded-xl bg-background p-3 ring-1 ring-border"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-2xl leading-none font-bold text-primary tabular">
                          {o.token}
                        </span>
                        <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                          token
                        </span>
                      </div>
                      <span className="text-[11px] whitespace-nowrap text-muted-foreground">
                        {o.minutesAgo} min ago
                      </span>
                    </div>

                    <p className="mt-2 truncate text-sm font-semibold">
                      {o.student}
                    </p>
                    <p className="text-[11px] text-muted-foreground tabular">
                      {o.enrollment} · {o.campus}
                    </p>

                    <ul className="mt-2.5 space-y-1 border-t border-border pt-2.5 text-xs">
                      {o.lines.map((l) => (
                        <li key={l.name} className="flex justify-between gap-2">
                          <span className="truncate text-muted-foreground">
                            {l.name}
                          </span>
                          <span className="font-semibold tabular">×{l.qty}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-bold tabular">
                        {rupee(o.total)}
                        <span className="ml-1 text-[10px] font-normal text-muted-foreground">
                          cash
                        </span>
                      </span>
                      {o.status === 'Preparing' ? (
                        <Button
                          size="sm"
                          className="h-8 rounded-lg bg-accent text-xs font-semibold text-accent-foreground hover:bg-accent/90"
                          onClick={() => advance(o.id, 'Ready')}
                        >
                          Mark ready
                        </Button>
                      ) : o.status === 'Ready' ? (
                        <Button
                          size="sm"
                          className="h-8 rounded-lg text-xs font-semibold"
                          onClick={() => advance(o.id, 'Collected')}
                        >
                          Collected
                        </Button>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                          <Check className="size-3.5" aria-hidden="true" />
                          Paid
                        </span>
                      )}
                    </div>
                  </li>
                ))}

                {orders.length === 0 ? (
                  <li className="rounded-xl border border-dashed border-border py-8 text-center text-xs text-muted-foreground">
                    No tokens here
                  </li>
                ) : null}
              </ul>
            </section>
          )
        })}
      </div>
    </AdminShell>
  )
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  value: string
  hint: string
  accent?: boolean
}) {
  return (
    <div
      className={cn(
        'rounded-2xl p-4 ring-1',
        accent
          ? 'bg-primary text-primary-foreground ring-primary'
          : 'bg-card ring-border',
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn(
            'text-[11px] font-semibold tracking-wide uppercase',
            accent ? 'text-primary-foreground/65' : 'text-muted-foreground',
          )}
        >
          {label}
        </p>
        <Icon
          className={cn('size-4', accent ? 'text-accent' : 'text-primary')}
          aria-hidden={true}
        />
      </div>
      <p className="mt-2 font-display text-3xl font-bold tabular">{value}</p>
      <p
        className={cn(
          'mt-0.5 text-[11px]',
          accent ? 'text-primary-foreground/60' : 'text-muted-foreground',
        )}
      >
        {hint}
      </p>
    </div>
  )
}

<Users className="hidden" />
