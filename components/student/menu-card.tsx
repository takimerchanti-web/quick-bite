'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Clock3, Plus, Star } from 'lucide-react'
import { rupee, type MenuItem } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function MenuCard({ item }: { item: MenuItem }) {
  const { addToCart } = useAppStore()

  return (
    <article
      className={cn(
        'relative flex gap-3 rounded-3xl bg-card p-3 shadow-sm ring-1 ring-border/70 transition-shadow',
        item.soldOut ? 'opacity-70' : 'hover:shadow-md',
      )}
    >
      <Link
        href={`/app/item/${item.id}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-2xl bg-muted"
      >
        <Image
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          fill
          sizes="96px"
          className={cn('object-cover', item.soldOut && 'grayscale')}
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/app/item/${item.id}`} className="min-w-0">
            <h3 className="truncate font-display text-[15px] font-semibold">
              {item.name}
            </h3>
          </Link>
          {item.soldOut ? (
            <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-destructive uppercase">
              Sold out
            </span>
          ) : (
            <span
              className="shrink-0 rounded-full border border-success/40 p-[3px]"
              aria-label="Vegetarian"
            >
              <span className="block size-2 rounded-full bg-success" />
            </span>
          )}
        </div>

        <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="font-display text-lg font-bold tabular">
              {rupee(item.price)}
            </p>
            <div className="mt-0.5 flex items-center gap-2.5 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star
                  className="size-3 fill-accent text-accent"
                  aria-hidden="true"
                />
                {item.rating}
              </span>
              <span className="flex items-center gap-1">
                <Clock3 className="size-3" aria-hidden="true" />
                {item.prepMinutes} min
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={item.soldOut}
            onClick={() => addToCart(item.id)}
            className={cn(
              'flex size-9 items-center justify-center rounded-xl transition-colors',
              item.soldOut
                ? 'cursor-not-allowed bg-muted text-muted-foreground'
                : 'bg-accent text-accent-foreground hover:bg-accent/90',
            )}
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="sr-only">
              {item.soldOut ? `${item.name} is sold out` : `Add ${item.name}`}
            </span>
          </button>
        </div>
      </div>
    </article>
  )
}
