'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { rupee, type OrderStatus } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<OrderStatus, string> = {
  Preparing: 'bg-accent/15 text-accent-foreground',
  Ready: 'bg-success/15 text-success',
  Collected: 'bg-secondary text-muted-foreground',
}

export default function OrdersPage() {
  const router = useRouter()
  const { orders, reorder } = useAppStore()

  const spent = orders
    .filter((o) => o.status === 'Collected')
    .reduce((s, o) => s + o.total, 0)

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-border bg-card px-5 py-4">
        <h1 className="font-display text-base font-semibold">Order history</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {orders.length} orders · {rupee(spent)} paid in cash this month
        </p>
      </header>

      <section className="flex-1 space-y-3 px-4 pt-4 pb-24">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-3xl bg-card p-4 shadow-sm ring-1 ring-border/70"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-sm font-semibold">
                  Token #{order.token}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {order.placedAt} · {order.campus}
                </p>
              </div>
              <span
                className={cn(
                  'rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase',
                  STATUS_STYLE[order.status],
                )}
              >
                {order.status}
              </span>
            </div>

            <ul className="mt-3 flex items-center gap-2">
              {order.lines.map((line) => (
                <li
                  key={line.itemId}
                  className="relative size-12 overflow-hidden rounded-xl bg-muted ring-1 ring-border"
                >
                  <Image
                    src={line.image || '/placeholder.svg'}
                    alt={line.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                  {line.qty > 1 ? (
                    <span className="absolute right-0 bottom-0 rounded-tl-md bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      ×{line.qty}
                    </span>
                  ) : null}
                </li>
              ))}
              <li className="min-w-0 flex-1 pl-1 text-xs leading-snug text-muted-foreground">
                {order.lines.map((l) => l.name).join(', ')}
              </li>
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
              <p className="font-display text-base font-bold tabular">
                {rupee(order.total)}
                <span className="ml-1.5 text-[11px] font-normal text-muted-foreground">
                  cash
                </span>
              </p>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  reorder(order)
                  router.push('/app/cart')
                }}
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Reorder
              </Button>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
