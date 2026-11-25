'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { Search, TrendingUp } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CATEGORIES, rupee, type MenuCategory } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function AdminMenuPage() {
  const { menu, toggleSoldOut } = useAppStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<MenuCategory | 'All'>('All')

  const rows = useMemo(
    () =>
      menu.filter((m) => {
        const matchCat = category === 'All' || m.category === category
        const matchQuery = m.name.toLowerCase().includes(query.toLowerCase())
        return matchCat && matchQuery
      }),
    [menu, category, query],
  )

  const availableCount = menu.filter((m) => !m.soldOut).length
  const revenueToday = menu.reduce((s, m) => s + m.price * m.soldToday, 0)
  const bestSeller = [...menu].sort((a, b) => b.soldToday - a.soldToday)[0]

  return (
    <AdminShell
      title="Menu availability"
      description="Flip an item off the moment the kitchen runs out — students see it instantly."
      actions={
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5">
          <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="text-xs font-semibold text-secondary-foreground">
            {availableCount} of {menu.length} items live
          </span>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Items on the counter" value={`${availableCount}`} sub={`${menu.length - availableCount} marked sold out`} />
        <StatTile label="Menu value sold today" value={rupee(revenueToday)} sub="Across all three campuses" />
        <StatTile
          label="Best seller"
          value={bestSeller.name}
          sub={`${bestSeller.soldToday} plates today`}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-72">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the menu"
            aria-label="Search menu items"
            className="h-10 rounded-xl pl-9"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(['All', ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                category === c
                  ? 'bg-foreground text-background'
                  : 'bg-secondary text-muted-foreground hover:text-foreground',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Item</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="hidden text-right md:table-cell">
                Prep
              </TableHead>
              <TableHead className="text-right">Sold today</TableHead>
              <TableHead className="text-right">Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((m) => (
              <TableRow key={m.id} className={cn(m.soldOut && 'opacity-60')}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-secondary">
                      <Image
                        src={m.image || '/placeholder.svg'}
                        alt={m.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{m.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {m.description}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant="secondary" className="rounded-full font-medium">
                    {m.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {rupee(m.price)}
                </TableCell>
                <TableCell className="hidden text-right text-sm text-muted-foreground md:table-cell">
                  {m.prepMinutes} min
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 font-mono text-sm">
                    {m.soldToday}
                    {m.soldToday > 80 && (
                      <TrendingUp
                        className="size-3.5 text-primary"
                        aria-label="High demand"
                      />
                    )}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={!m.soldOut}
                    onCheckedChange={() => toggleSoldOut(m.id)}
                    aria-label={`Mark ${m.name} as ${m.soldOut ? 'available' : 'sold out'}`}
                  />
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No items match that search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </AdminShell>
  )
}

function StatTile({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-display text-xl font-bold tracking-tight text-balance">
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  )
}
