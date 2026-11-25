import type { ReactNode } from 'react'
import { BottomNav } from '@/components/student/bottom-nav'
import { PhoneShell } from '@/components/phone-shell'
import { GmiuFooter } from '@/components/gmiu-logo'

export default function StudentAppLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-svh bg-secondary/60 sm:py-8">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 sm:max-w-none">
        <PhoneShell>
          <div className="flex flex-1 flex-col">{children}</div>
          <BottomNav />
        </PhoneShell>
        <GmiuFooter className="hidden pb-2 sm:block" />
      </div>
    </div>
  )
}
