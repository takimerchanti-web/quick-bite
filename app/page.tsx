import Link from 'next/link'
import { ArrowRight, LayoutDashboard, Smartphone, Wallet } from 'lucide-react'
import { GmiuLogo } from '@/components/gmiu-logo'
import { Button } from '@/components/ui/button'

export default function SplashPage() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-hidden bg-primary text-primary-foreground">
      {/* soft radial warmth from the accent, kept subtle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[-12rem] h-[28rem] opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(45% 60% at 50% 50%, var(--accent), transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-16 pb-10 sm:max-w-lg">
        <div className="flex items-center gap-3">
          <GmiuLogo size={52} />
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold">
              Gyanmanjari Innovative University
            </p>
            <p className="text-xs text-primary-foreground/70">
              Bhavnagar, Gujarat
            </p>
          </div>
        </div>

        <div className="mt-16">
          <p className="font-display text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            QuickBite
          </p>
          <h1 className="mt-3 font-display text-5xl leading-[1.05] font-bold tracking-tight text-balance">
            GMIU
            <br />
            Canteen
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-primary-foreground/75">
            Pre-order your food, get a digital token, and walk straight to the
            counter. Pay cash at pickup — no queue, no waiting.
          </p>
        </div>

        <ul className="mt-10 space-y-3 text-sm">
          {[
            { icon: Smartphone, text: 'Live canteen menu with sold-out status' },
            { icon: Wallet, text: 'Cash on pickup — no online payment needed' },
            { icon: ArrowRight, text: 'Track your token from Preparing to Ready' },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary-foreground/10">
                <Icon className="size-4 text-accent" aria-hidden="true" />
              </span>
              <span className="text-primary-foreground/85">{text}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-12">
          <Button
            render={<Link href="/login" />}
            size="lg"
            className="h-13 w-full rounded-2xl bg-accent text-base font-semibold text-accent-foreground hover:bg-accent/90"
          >
            Student login
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>

          <Button
            render={<Link href="/admin/login" />}
            variant="ghost"
            className="mt-2 h-12 w-full rounded-2xl text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            <LayoutDashboard className="size-4" aria-hidden="true" />
            Canteen staff dashboard
          </Button>

          <p className="mt-6 text-center text-[11px] tracking-wide text-primary-foreground/55">
            Made for GMIU Students
          </p>
        </div>
      </div>
    </main>
  )
}
