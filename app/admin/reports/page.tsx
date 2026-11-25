'use client'

import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { CATEGORY_SPLIT, HOURLY_SALES, rupee } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const RANGES = ['Today', 'This week', 'This month'] as const
type Range = (typeof RANGES)[number]

const MULTIPLIER: Record<Range, number> = {
  Today: 1,
  'This week': 5.4,
  'This month': 22.8,
}

const revenueConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
} satisfies ChartConfig

const ordersConfig = {
  orders: { label: 'Orders', color: 'var(--chart-2)' },
} satisfies ChartConfig

const splitConfig = {
  value: { label: 'Share of orders' },
} satisfies ChartConfig

export default function AdminReportsPage() {
  const { menu } = useAppStore()
  const [range, setRange] = useState<Range>('Today')
  const factor = MULTIPLIER[range]

  const revenueData = useMemo(
    () =>
      HOURLY_SALES.map((h) => ({
        ...h,
        revenue: Math.round(h.revenue * factor),
        orders: Math.round(h.orders * factor),
      })),
    [factor],
  )

  const totalRevenue = revenueData.reduce((s, h) => s + h.revenue, 0)
  const totalOrders = revenueData.reduce((s, h) => s + h.orders, 0)
  const avgTicket = Math.round(totalRevenue / totalOrders)
  const peak = revenueData.reduce((a, b) => (b.revenue > a.revenue ? b : a))

  const topItems = useMemo(
    () =>
      [...menu]
        .sort((a, b) => b.soldToday * b.price - a.soldToday * a.price)
        .slice(0, 5)
        .map((m) => ({
          name: m.name,
          plates: Math.round(m.soldToday * factor),
          revenue: Math.round(m.soldToday * m.price * factor),
        })),
    [menu, factor],
  )
  const topMax = topItems[0]?.revenue ?? 1

  return (
    <AdminShell
      title="Sales report"
      description="Where the money and the rush actually happen."
      actions={
        <div className="flex gap-1 rounded-full bg-secondary p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                range === r
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Revenue" value={rupee(totalRevenue)} delta={12.4} />
        <Kpi label="Orders served" value={totalOrders.toLocaleString('en-IN')} delta={8.1} />
        <Kpi label="Average ticket" value={rupee(avgTicket)} delta={-2.6} />
        <Kpi label="Peak hour" value={peak.hour} delta={19.3} note={`${peak.orders} orders`} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-5 xl:col-span-2">
          <header className="mb-4">
            <h2 className="font-display text-base font-semibold">
              Revenue through the day
            </h2>
            <p className="text-xs text-muted-foreground">
              The 12–2 PM lunch window carries the counter.
            </p>
          </header>
          <ChartContainer config={revenueConfig} className="h-[260px] w-full">
            <BarChart data={revenueData} margin={{ left: 4, right: 4, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={11}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={48}
                fontSize={11}
                tickFormatter={(v) => `₹${Math.round(Number(v) / 1000)}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => rupee(Number(value))}
                  />
                }
              />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {revenueData.map((d) => (
                  <Cell
                    key={d.hour}
                    fill={
                      d.hour === peak.hour
                        ? 'var(--color-revenue)'
                        : 'var(--chart-4)'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-4">
            <h2 className="font-display text-base font-semibold">
              Order flow
            </h2>
            <p className="text-xs text-muted-foreground">
              Tokens issued per hour.
            </p>
          </header>
          <ChartContainer config={ordersConfig} className="h-[260px] w-full">
            <LineChart data={revenueData} margin={{ left: 4, right: 8, top: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={11}
                interval={1}
              />
              <YAxis tickLine={false} axisLine={false} width={32} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="orders"
                type="monotone"
                stroke="var(--color-orders)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </section>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-5 xl:col-span-2">
          <header className="mb-4">
            <h2 className="font-display text-base font-semibold">
              Top earners
            </h2>
            <p className="text-xs text-muted-foreground">
              Ranked by revenue, not plate count.
            </p>
          </header>
          <ul className="space-y-3.5">
            {topItems.map((t, i) => (
              <li key={t.name}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="truncate text-sm font-medium">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">
                      {i + 1}
                    </span>
                    {t.name}
                  </p>
                  <p className="shrink-0 font-mono text-sm font-semibold">
                    {rupee(t.revenue)}
                  </p>
                </div>
                <div className="mt-1.5 flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(t.revenue / topMax) * 100}%` }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                    {t.plates.toLocaleString('en-IN')} plates
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5">
          <header className="mb-4">
            <h2 className="font-display text-base font-semibold">
              Category mix
            </h2>
            <p className="text-xs text-muted-foreground">
              Share of every order placed.
            </p>
          </header>
          <ChartContainer config={splitConfig} className="h-[200px] w-full">
            <BarChart
              data={CATEGORY_SPLIT}
              layout="vertical"
              margin={{ left: 0, right: 16 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="category"
                tickLine={false}
                axisLine={false}
                width={80}
                fontSize={11}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent formatter={(value) => `${value}%`} />
                }
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {CATEGORY_SPLIT.map((c, i) => (
                  <Cell key={c.category} fill={`var(--chart-${i + 1})`} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </section>
      </div>
    </AdminShell>
  )
}

function Kpi({
  label,
  value,
  delta,
  note,
}: {
  label: string
  value: string
  delta: number
  note?: string
}) {
  const up = delta >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1.5 font-display text-2xl font-bold tracking-tight">
        {value}
      </p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          className={cn(
            'inline-flex items-center gap-0.5 text-xs font-semibold',
            up ? 'text-primary' : 'text-destructive',
          )}
        >
          <Icon className="size-3.5" aria-hidden="true" />
          {Math.abs(delta)}%
        </span>
        <span className="text-xs text-muted-foreground">
          {note ?? 'vs last period'}
        </span>
      </div>
    </div>
  )
}
