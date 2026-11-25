'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Lock, MapPin, ShieldCheck, UserRound } from 'lucide-react'
import { GmiuFooter, GmiuLogo } from '@/components/gmiu-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CAMPUSES } from '@/lib/data'

export default function AdminLoginPage() {
  const router = useRouter()
  const [staffId, setStaffId] = useState('CANTEEN-04')
  const [counter, setCounter] = useState<string>('Main Campus')

  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      {/* left: brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 -left-24 size-[26rem] opacity-20 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at center, var(--accent), transparent 70%)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <GmiuLogo size={44} />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">GMIU Canteen</p>
            <p className="text-xs text-primary-foreground/65">
              Staff operations console
            </p>
          </div>
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-4xl leading-[1.1] font-bold tracking-tight text-balance">
            Run the counter from one screen.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-primary-foreground/70">
            Accept pre-orders, move tokens from Preparing to Ready, mark items
            sold out and close the day with a cash sales report.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-primary-foreground/15 pt-6">
            {[
              { v: '312', l: 'Tokens today' },
              { v: '₹21.4k', l: 'Cash collected' },
              { v: '6.4 min', l: 'Avg. prep' },
            ].map((s) => (
              <div key={s.l}>
                <dd className="font-display text-2xl font-bold text-accent tabular">
                  {s.v}
                </dd>
                <dt className="mt-0.5 text-[11px] tracking-wide text-primary-foreground/60 uppercase">
                  {s.l}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <p className="relative text-[11px] text-primary-foreground/50">
          Made for GMIU Students · Gyanmanjari Innovative University, Bhavnagar
        </p>
      </div>

      {/* right: form */}
      <div className="flex flex-col justify-center px-6 py-14 sm:px-16">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex items-center gap-3 lg:hidden">
            <GmiuLogo size={40} />
            <p className="font-display text-sm font-semibold">GMIU Canteen</p>
          </div>

          <span className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold text-primary lg:mt-0">
            <ShieldCheck className="size-3.5" aria-hidden="true" />
            Staff access only
          </span>

          <h2 className="mt-4 font-display text-2xl font-bold tracking-tight">
            Canteen staff login
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Use the staff ID issued by the GMIU administration office.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              router.push('/admin/orders')
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="staff-id" className="text-xs font-semibold">
                Staff ID
              </Label>
              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="staff-id"
                  required
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value.toUpperCase())}
                  className="h-12 rounded-xl pl-9"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="staff-pass" className="text-xs font-semibold">
                Password
              </Label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  id="staff-pass"
                  type="password"
                  required
                  defaultValue="canteen@2026"
                  className="h-12 rounded-xl pl-9"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="counter" className="text-xs font-semibold">
                Counter
              </Label>
              <Select value={counter} onValueChange={setCounter}>
                <SelectTrigger
                  id="counter"
                  className="h-12 w-full rounded-xl pl-9"
                >
                  <MapPin
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAMPUSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c} counter
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-12 w-full rounded-xl font-semibold"
            >
              Open dashboard
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>

          <Link
            href="/login"
            className="mt-6 block text-center text-xs font-medium text-primary underline-offset-4 hover:underline"
          >
            I&apos;m a student — go to the app
          </Link>

          <GmiuFooter className="mt-10 lg:hidden" />
        </div>
      </div>
    </main>
  )
}
