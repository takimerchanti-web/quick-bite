'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  BellRing,
  Check,
  ChefHat,
  CircleDot,
  PackageCheck,
  Radio,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WaitTimer } from '@/components/student/wait-timer'
import { LIVE_QUEUE, rupee, type OrderStatus } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const STEPS: { status: OrderStatus; label: string; icon: typeof ChefHat }[] = [
  { status: 'Preparing', label: 'Preparing in kitchen', icon: ChefHat },
  { status: 'Ready', label: 'Ready at counter', icon: BellRing },
  { status: 'Collected', label: 'Collected & paid', icon: PackageCheck },
]

export default function QueuePage() {
  const { activeOrder, advanceStatus, ordersAhead } = useAppStore()
  const [nowServing, setNowServing] = useState(54)

  // simulate the live counter ticking forward
  useEffect(() => {
    const id = setInterval(() => {
      setNowServing((n) => (activeOrder ? Math.min(n + 1, activeOrder.token) : n))
    }, 9000)
    return () => clearInterval(id)
  }, [activeOrder])

  if (!activeOrder) {
    return (
      <div className="flex flex-1 flex-col">
        <header className="border-b border-border bg-card px-5 py-4">
          <h1 className="font-display text-base font-semibold">Live queue</h1>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-3xl bg-secondary">
            <Radio className="size-7 text-muted-foreground" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-base font-semibold">
              No active token
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Place an order to see live kitchen updates here.
            </p>
          </div>
          <Button
            render={<Link href="/app/home" />}
            className="h-11 rounded-2xl px-5"
          >
            Browse menu
          </Button>
        </div>
      </div>
    )
  }

  const currentStep = STEPS.findIndex((s) => s.status === activeOrder.status)

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-border bg-card px-5 py-4">
        <h1 className="font-display text-base font-semibold">Live queue</h1>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-success">
          <span className="size-1.5 animate-pulse rounded-full bg-success" />
          Updating live
        </span>
      </header>

      <section className="px-4 pt-4 pb-28">
        {/* hero token + timer */}
        <div className="rounded-3xl bg-primary p-5 text-primary-foreground">
          <div className="flex items-center gap-5">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-primary-foreground/60 uppercase">
                Your token
              </p>
              <p className="font-display text-6xl leading-none font-bold tracking-tighter text-accent tabular">
                {activeOrder.token}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/10 px-2.5 py-1 text-[11px] font-semibold">
                <CircleDot className="size-3 text-accent" aria-hidden="true" />
                {activeOrder.status}
              </p>
            </div>
            <WaitTimer minutes={activeOrder.etaMinutes} size={120} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 border-t border-primary-foreground/15 pt-4 text-center">
            <Stat label="Now serving" value={`#${nowServing}`} />
            <Stat label="Ahead of you" value={`${ordersAhead}`} />
            <Stat label="Cash due" value={rupee(activeOrder.total)} />
          </div>
        </div>

        {/* status stepper */}
        <div className="mt-4 rounded-3xl bg-card p-4 ring-1 ring-border/70">
          <h2 className="font-display text-sm font-semibold">Token status</h2>
          <ol className="mt-4 space-y-1">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              const done = i < currentStep
              const active = i === currentStep
              return (
                <li key={step.status} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                        done && 'bg-success text-primary-foreground',
                        active && 'bg-accent text-accent-foreground',
                        !done && !active && 'bg-secondary text-muted-foreground',
                      )}
                    >
                      {done ? (
                        <Check className="size-4" aria-hidden="true" />
                      ) : (
                        <Icon className="size-4" aria-hidden="true" />
                      )}
                    </span>
                    {i < STEPS.length - 1 ? (
                      <span
                        className={cn(
                          'my-1 w-0.5 flex-1 rounded-full',
                          done ? 'bg-success' : 'bg-border',
                        )}
                      />
                    ) : null}
                  </div>
                  <div className="pb-5">
                    <p
                      className={cn(
                        'font-display text-sm font-semibold',
                        !done && !active && 'text-muted-foreground',
                      )}
                    >
                      {step.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {done
                        ? 'Completed'
                        : active
                          ? step.status === 'Preparing'
                            ? `About ${activeOrder.etaMinutes} min left`
                            : 'Head to the counter now'
                          : 'Pending'}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>

          {activeOrder.status !== 'Collected' ? (
            <Button
              variant="outline"
              className="w-full rounded-2xl"
              onClick={() =>
                advanceStatus(
                  activeOrder.id,
                  activeOrder.status === 'Preparing' ? 'Ready' : 'Collected',
                )
              }
            >
              Simulate next update
            </Button>
          ) : null}
        </div>

        {/* queue board */}
        <div className="mt-4 rounded-3xl bg-card p-4 ring-1 ring-border/70">
          <h2 className="font-display text-sm font-semibold">
            Counter board
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {activeOrder.campus}
            </span>
          </h2>
          <ul className="mt-3 grid grid-cols-4 gap-2">
            {[...LIVE_QUEUE]
              .sort((a, b) => a.token - b.token)
              .map((q) => (
                <li
                  key={q.id}
                  className={cn(
                    'rounded-2xl py-3 text-center',
                    q.status === 'Ready'
                      ? 'bg-accent text-accent-foreground'
                      : q.status === 'Collected'
                        ? 'bg-secondary text-muted-foreground line-through'
                        : 'bg-secondary text-foreground',
                  )}
                >
                  <span className="font-display text-lg font-bold tabular">
                    {q.token}
                  </span>
                </li>
              ))}
            <li className="rounded-2xl bg-primary py-3 text-center text-primary-foreground ring-2 ring-accent">
              <span className="font-display text-lg font-bold tabular">
                {activeOrder.token}
              </span>
            </li>
          </ul>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <Legend className="bg-accent" label="Ready" />
            <Legend className="bg-secondary" label="In kitchen" />
            <Legend className="bg-primary" label="Your token" />
          </p>
        </div>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-base font-bold tabular">{value}</p>
      <p className="text-[10px] tracking-wide text-primary-foreground/60 uppercase">
        {label}
      </p>
    </div>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn('size-2.5 rounded-sm', className)} />
      {label}
    </span>
  )
}
