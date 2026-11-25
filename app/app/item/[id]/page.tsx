'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { use } from 'react'
import {
  ArrowLeft,
  Clock3,
  Flame,
  Leaf,
  Minus,
  Plus,
  Star,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { rupee } from '@/lib/data'
import { useAppStore } from '@/lib/store'

export default function ItemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { menu, addToCart } = useAppStore()
  const [qty, setQty] = useState(1)

  const item = menu.find((m) => m.id === id)

  if (!item) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          This item is no longer on the menu.
        </p>
        <Button onClick={() => router.push('/app/home')}>Back to menu</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative h-72 w-full bg-muted">
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, 390px"
          className="object-cover"
          priority
        />
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-5 left-4 flex size-10 items-center justify-center rounded-xl bg-card/90 shadow-sm backdrop-blur"
        >
          <ArrowLeft className="size-4.5" aria-hidden="true" />
          <span className="sr-only">Go back</span>
        </button>
        {item.soldOut ? (
          <span className="absolute top-5 right-4 rounded-full bg-destructive px-3 py-1.5 text-[11px] font-bold tracking-wide text-destructive-foreground uppercase">
            Sold out
          </span>
        ) : null}
      </div>

      <div className="-mt-6 flex flex-1 flex-col rounded-t-[2rem] bg-background px-5 pt-6 pb-32">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.15em] text-accent uppercase">
              {item.category}
            </p>
            <h1 className="mt-1 font-display text-2xl leading-tight font-bold tracking-tight text-balance">
              {item.name}
            </h1>
          </div>
          <p className="font-display text-2xl font-bold tabular">
            {rupee(item.price)}
          </p>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <dl className="mt-5 grid grid-cols-3 gap-2">
          {[
            {
              icon: Star,
              label: 'Rating',
              value: `${item.rating} / 5`,
            },
            {
              icon: Clock3,
              label: 'Prep time',
              value: `${item.prepMinutes} min`,
            },
            {
              icon: Flame,
              label: 'Sold today',
              value: `${item.soldToday}`,
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-2xl bg-card p-3 text-center ring-1 ring-border/70"
            >
              <Icon
                className="mx-auto size-4 text-primary"
                aria-hidden="true"
              />
              <dt className="mt-1.5 text-[10px] tracking-wide text-muted-foreground uppercase">
                {label}
              </dt>
              <dd className="font-display text-sm font-semibold tabular">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {item.veg ? (
          <p className="mt-4 flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-3 text-xs font-medium text-success">
            <Leaf className="size-4" aria-hidden="true" />
            Pure vegetarian · prepared fresh in the GMIU canteen kitchen
          </p>
        ) : null}

        <div className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-border/70">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold">Quantity</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Max 5 per item, per order
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-secondary p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex size-9 items-center justify-center rounded-lg bg-card shadow-sm disabled:opacity-40"
                disabled={qty <= 1}
              >
                <Minus className="size-4" aria-hidden="true" />
                <span className="sr-only">Decrease quantity</span>
              </button>
              <span className="w-6 text-center font-display text-lg font-bold tabular">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(5, q + 1))}
                className="flex size-9 items-center justify-center rounded-lg bg-card shadow-sm disabled:opacity-40"
                disabled={qty >= 5}
              >
                <Plus className="size-4" aria-hidden="true" />
                <span className="sr-only">Increase quantity</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Wallet className="size-3.5" aria-hidden="true" />
              Cash to pay at pickup
            </span>
            <span className="font-display text-lg font-bold tabular">
              {rupee(item.price * qty)}
            </span>
          </div>
        </div>
      </div>

      <div className="sticky bottom-16 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Button
          size="lg"
          disabled={item.soldOut}
          onClick={() => {
            addToCart(item.id, qty)
            router.push('/app/cart')
          }}
          className="h-13 w-full rounded-2xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90"
        >
          {item.soldOut
            ? 'Sold out for today'
            : `Add ${qty} to order · ${rupee(item.price * qty)}`}
        </Button>
      </div>
    </div>
  )
}
