'use client'

import Link from 'next/link'
import { use } from 'react'
import { Banknote, CheckCircle2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { WaitTimer } from '@/components/student/wait-timer'
import { rupee } from '@/lib/data'
import { useAppStore } from '@/lib/store'

export default function TokenPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  const { orders, ordersAhead } = useAppStore()
  const order =
    orders.find((o) => String(o.token) === token) ??
    orders.find((o) => o.status !== 'Collected') ??
    orders[0]

  return (
    <div className="flex flex-1 flex-col bg-primary text-primary-foreground">
      <div className="flex flex-1 flex-col px-5 pt-10 pb-6">
        <div className="flex items-center justify-center gap-2 text-success">
          <CheckCircle2 className="size-4.5" aria-hidden="true" />
          <p className="text-xs font-semibold tracking-[0.16em] uppercase">
            Order confirmed
          </p>
        </div>

        {/* Signature element: the token number */}
        <div className="mt-8 text-center">
          <p className="text-[11px] font-semibold tracking-[0.24em] text-primary-foreground/60 uppercase">
            Your token number
          </p>
          <p className="mt-1 font-display text-[108px] leading-none font-bold tracking-tighter text-accent tabular">
            {order?.token ?? token}
          </p>
          <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-primary-foreground/70">
            Show this number at the {order?.campus ?? 'Main Campus'} canteen
            counter to collect your food.
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <WaitTimer minutes={order?.etaMinutes ?? 8} />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-primary-foreground/8 p-4">
            <Users className="size-4 text-accent" aria-hidden="true" />
            <p className="mt-2 font-display text-2xl font-bold tabular">
              {ordersAhead}
            </p>
            <p className="text-[11px] text-primary-foreground/65">
              orders ahead of you
            </p>
          </div>
          <div className="rounded-2xl bg-primary-foreground/8 p-4">
            <Banknote className="size-4 text-accent" aria-hidden="true" />
            <p className="mt-2 font-display text-2xl font-bold tabular">
              {rupee(order?.total ?? 0)}
            </p>
            <p className="text-[11px] text-primary-foreground/65">
              cash to pay at pickup
            </p>
          </div>
        </div>

        <ul className="mt-6 space-y-2 rounded-2xl bg-primary-foreground/8 p-4 text-sm">
          {order?.lines.map((line) => (
            <li
              key={line.itemId}
              className="flex items-center justify-between gap-3"
            >
              <span className="truncate text-primary-foreground/85">
                {line.qty} × {line.name}
              </span>
              <span className="font-semibold tabular">
                {rupee(line.price * line.qty)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-2 pt-8">
          <Button
            render={<Link href="/app/queue" />}
            size="lg"
            className="h-13 w-full rounded-2xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90"
          >
            Track my token
          </Button>
          <Button
            render={<Link href="/app/home" />}
            variant="ghost"
            className="h-12 w-full rounded-2xl text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Order something else
          </Button>
        </div>
      </div>
    </div>
  )
}
