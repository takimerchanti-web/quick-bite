'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Banknote,
  Info,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { rupee, STUDENT } from '@/lib/data'
import { useAppStore } from '@/lib/store'

export default function CartPage() {
  const router = useRouter()
  const {
    cartLines,
    cartTotal,
    cartCount,
    setQty,
    clearCart,
    placeOrder,
    campus,
    enrollment,
  } = useAppStore()

  if (cartCount === 0) {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-3xl bg-secondary">
            <ShoppingBag
              className="size-7 text-muted-foreground"
              aria-hidden="true"
            />
          </span>
          <div>
            <p className="font-display text-base font-semibold">
              Your order is empty
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add something from today&apos;s live menu to get a token.
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

  return (
    <div className="flex flex-1 flex-col">
      <Header onClear={clearCart} />

      <section className="flex-1 space-y-3 px-4 pt-4 pb-32">
        {cartLines.map((line) => (
          <article
            key={line.itemId}
            className="flex items-center gap-3 rounded-3xl bg-card p-3 shadow-sm ring-1 ring-border/70"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-muted">
              <Image
                src={line.image || '/placeholder.svg'}
                alt={line.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-display text-sm font-semibold">
                {line.name}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground tabular">
                {rupee(line.price)} each
              </p>
              <p className="mt-1 font-display text-sm font-bold tabular">
                {rupee(line.price * line.qty)}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-secondary p-1">
              <button
                type="button"
                onClick={() => setQty(line.itemId, line.qty - 1)}
                className="flex size-8 items-center justify-center rounded-lg bg-card shadow-sm"
              >
                {line.qty === 1 ? (
                  <Trash2
                    className="size-3.5 text-destructive"
                    aria-hidden="true"
                  />
                ) : (
                  <Minus className="size-3.5" aria-hidden="true" />
                )}
                <span className="sr-only">Reduce {line.name}</span>
              </button>
              <span className="w-5 text-center font-display text-sm font-bold tabular">
                {line.qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(line.itemId, Math.min(5, line.qty + 1))}
                className="flex size-8 items-center justify-center rounded-lg bg-card shadow-sm disabled:opacity-40"
                disabled={line.qty >= 5}
              >
                <Plus className="size-3.5" aria-hidden="true" />
                <span className="sr-only">Add another {line.name}</span>
              </button>
            </div>
          </article>
        ))}

        <div className="rounded-3xl bg-card p-4 ring-1 ring-border/70">
          <h2 className="font-display text-sm font-semibold">Order summary</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label={`Items (${cartCount})`} value={rupee(cartTotal)} />
            <Row label="Packaging" value="Free" />
            <Row label="Platform fee" value="₹0" />
            <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
              <dt className="font-display text-sm font-semibold">
                Cash to pay
              </dt>
              <dd className="font-display text-2xl font-bold text-primary tabular">
                {rupee(cartTotal)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-3xl bg-primary p-4 text-primary-foreground">
          <p className="flex items-center gap-2 font-display text-sm font-semibold">
            <Banknote className="size-4 text-accent" aria-hidden="true" />
            Cash only at the counter
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/75">
            Show your token number at the GMIU canteen counter and pay{' '}
            {rupee(cartTotal)} in cash while collecting. No online payment.
          </p>
        </div>

        <div className="rounded-3xl bg-secondary p-4">
          <p className="flex items-center gap-2 text-xs font-semibold">
            <Info className="size-3.5" aria-hidden="true" />
            Pickup details
          </p>
          <dl className="mt-2.5 space-y-1.5 text-xs">
            <Row muted label="Student" value={STUDENT.name} />
            <Row muted label="Enrollment" value={enrollment} />
            <Row muted label="Campus counter" value={campus} />
          </dl>
        </div>
      </section>

      <div className="sticky bottom-16 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <Button
          size="lg"
          onClick={() => {
            const order = placeOrder()
            router.push(`/app/token/${order.token}`)
          }}
          className="h-13 w-full rounded-2xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90"
        >
          Confirm order · Get token
        </Button>
      </div>
    </div>
  )
}

function Header({ onClear }: { onClear?: () => void }) {
  const router = useRouter()
  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-4">
      <button
        type="button"
        onClick={() => router.push('/app/home')}
        className="flex size-9 items-center justify-center rounded-xl bg-secondary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        <span className="sr-only">Back to menu</span>
      </button>
      <h1 className="flex-1 font-display text-base font-semibold">
        Order summary
      </h1>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-destructive"
        >
          Clear
        </button>
      ) : null}
    </header>
  )
}

function Row({
  label,
  value,
  muted,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={muted ? 'font-medium' : 'font-semibold tabular'}>
        {value}
      </dd>
    </div>
  )
}
