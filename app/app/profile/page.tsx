'use client'

import Link from 'next/link'
import {
  Bell,
  ChevronRight,
  CircleQuestionMark,
  GraduationCap,
  IdCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  Wallet,
} from 'lucide-react'
import { GmiuFooter, GmiuLogo } from '@/components/gmiu-logo'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { CAMPUSES, rupee, STUDENT, type Campus } from '@/lib/data'
import { useAppStore } from '@/lib/store'

export default function ProfilePage() {
  const { campus, setCampus, orders, enrollment } = useAppStore()
  const collected = orders.filter((o) => o.status === 'Collected')
  const spent = collected.reduce((s, o) => s + o.total, 0)

  return (
    <div className="flex flex-1 flex-col">
      <header className="rounded-b-[2rem] bg-primary px-5 pt-8 pb-7 text-primary-foreground">
        <div className="flex items-center gap-4">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent font-display text-xl font-bold text-accent-foreground">
            {STUDENT.initials}
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-xl font-bold tracking-tight">
              {STUDENT.name}
            </h1>
            <p className="mt-0.5 text-xs text-primary-foreground/70">
              {STUDENT.department}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-primary-foreground/8 py-3">
            <dd className="font-display text-lg font-bold tabular">
              {orders.length}
            </dd>
            <dt className="text-[10px] tracking-wide text-primary-foreground/60 uppercase">
              Orders
            </dt>
          </div>
          <div className="rounded-2xl bg-primary-foreground/8 py-3">
            <dd className="font-display text-lg font-bold tabular">
              {rupee(spent)}
            </dd>
            <dt className="text-[10px] tracking-wide text-primary-foreground/60 uppercase">
              Cash paid
            </dt>
          </div>
          <div className="rounded-2xl bg-primary-foreground/8 py-3">
            <dd className="font-display text-lg font-bold tabular">42 min</dd>
            <dt className="text-[10px] tracking-wide text-primary-foreground/60 uppercase">
              Queue saved
            </dt>
          </div>
        </dl>
      </header>

      <section className="flex-1 space-y-3 px-4 pt-5 pb-24">
        <div className="rounded-3xl bg-card p-4 ring-1 ring-border/70">
          <h2 className="font-display text-sm font-semibold">Student details</h2>
          <dl className="mt-3 space-y-3">
            <Detail
              icon={IdCard}
              label="Enrollment number"
              value={enrollment}
            />
            <Detail
              icon={GraduationCap}
              label="Programme"
              value={`${STUDENT.department} · ${STUDENT.semester}`}
            />
            <Detail icon={MapPin} label="Default campus" value={campus} />
          </dl>
        </div>

        <div className="rounded-3xl bg-card p-4 ring-1 ring-border/70">
          <h2 className="font-display text-sm font-semibold">Preferences</h2>

          <div className="mt-3.5">
            <label
              htmlFor="campus-pref"
              className="text-xs font-medium text-muted-foreground"
            >
              Pickup campus counter
            </label>
            <Select
              value={campus}
              onValueChange={(v) => setCampus(v as Campus)}
            >
              <SelectTrigger id="campus-pref" className="mt-1.5 h-11 w-full rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAMPUSES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ToggleRow
            icon={Bell}
            label="Token ready alerts"
            description="Push notification when your food is ready"
            defaultChecked
          />
          <ToggleRow
            icon={Wallet}
            label="Cash reminder"
            description="Remind me to carry exact change"
            defaultChecked
          />
        </div>

        <div className="overflow-hidden rounded-3xl bg-card ring-1 ring-border/70">
          <LinkRow
            href="/admin/login"
            icon={LayoutDashboard}
            label="Canteen staff dashboard"
          />
          <LinkRow
            href="/app/orders"
            icon={CircleQuestionMark}
            label="Help & order issues"
          />
        </div>

        <Button
          render={<Link href="/login" />}
          variant="outline"
          className="h-12 w-full rounded-2xl text-destructive hover:text-destructive"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </Button>

        <div className="flex flex-col items-center gap-2 pt-3">
          <GmiuLogo size={36} />
          <GmiuFooter />
        </div>
      </section>
    </div>
  )
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
        <Icon className="size-4 text-primary" aria-hidden={true} />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] text-muted-foreground">{label}</dt>
        <dd className="text-sm font-semibold">{value}</dd>
      </div>
    </div>
  )
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  defaultChecked,
}: {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
        <Icon className="size-4 text-primary" aria-hidden={true} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[11px] text-muted-foreground">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} aria-label={label} />
    </div>
  )
}

function LinkRow({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 not-last:border-b not-last:border-border"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary">
        <Icon className="size-4 text-primary" aria-hidden={true} />
      </span>
      <span className="flex-1 text-sm font-semibold">{label}</span>
      <ChevronRight
        className="size-4 text-muted-foreground"
        aria-hidden={true}
      />
    </Link>
  )
}
