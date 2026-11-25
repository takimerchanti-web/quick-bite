'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, IdCard, Lock, MapPin } from 'lucide-react'
import { GmiuFooter, GmiuLogo } from '@/components/gmiu-logo'
import { PhoneShell } from '@/components/phone-shell'
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
import { CAMPUSES, type Campus } from '@/lib/data'
import { useAppStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { campus, setCampus, enrollment, setEnrollment } = useAppStore()
  const [password, setPassword] = useState('')

  return (
    <div className="min-h-svh bg-secondary/60 sm:py-8">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 sm:max-w-none">
        <PhoneShell>
          <form
            className="flex flex-1 flex-col px-6 pt-12 pb-8"
            onSubmit={(e) => {
              e.preventDefault()
              router.push('/app/home')
            }}
          >
            <div className="flex flex-col items-center text-center">
              <GmiuLogo size={64} className="ring-2 ring-accent/40" />
              <h1 className="mt-4 font-display text-2xl font-bold tracking-tight">
                GMIU Canteen
              </h1>
              <p className="mt-1 text-xs font-medium tracking-[0.18em] text-accent uppercase">
                QuickBite
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Sign in with your GMIU enrollment number to start pre-ordering.
              </p>
            </div>

            <div className="mt-9 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="enrollment" className="text-xs font-semibold">
                  Enrollment number
                </Label>
                <div className="relative">
                  <IdCard
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="enrollment"
                    required
                    value={enrollment}
                    onChange={(e) => setEnrollment(e.target.value.toUpperCase())}
                    placeholder="Enter enrollment number"
                    autoComplete="username"
                    className="h-12 rounded-xl pl-9 tabular"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-12 rounded-xl pl-9"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="campus" className="text-xs font-semibold">
                  Campus
                </Label>
                <Select
                  value={campus}
                  onValueChange={(v) => setCampus(v as Campus)}
                >
                  <SelectTrigger
                    id="campus"
                    className="h-12 w-full rounded-xl pl-9"
                  >
                    <MapPin
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <SelectValue placeholder="Select your campus" />
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
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                size="lg"
                className="h-13 w-full rounded-2xl text-base font-semibold"
              >
                Sign in
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Trouble signing in? Contact the GMIU IT helpdesk.
              </p>
            </div>

            <div className="mt-auto pt-10">
              <Link
                href="/admin/login"
                className="block text-center text-xs font-medium text-primary underline-offset-4 hover:underline"
              >
                I&apos;m canteen staff — open the dashboard
              </Link>
              <GmiuFooter className="mt-4" />
            </div>
          </form>
        </PhoneShell>
      </div>
    </div>
  )
}
