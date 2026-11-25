'use client'

import { useState } from 'react'
import { CheckCircle2, Delete, ScanLine, XCircle } from 'lucide-react'
import { AdminShell } from '@/components/admin/admin-shell'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LIVE_QUEUE, rupee, type QueueOrder } from '@/lib/data'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type Result =
  | { kind: 'idle' }
  | { kind: 'ok'; order: QueueOrder }
  | { kind: 'already'; order: QueueOrder }
  | { kind: 'unknown'; token: string }

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'del']

export default function AdminScannerPage() {
  const { orders } = useAppStore()
  const [entry, setEntry] = useState('')
  const [result, setResult] = useState<Result>({ kind: 'idle' })
  const [collected, setCollected] = useState<number[]>([53, 52])
  const [log, setLog] = useState<{ token: number; student: string }[]>([])

  // student-placed orders are also valid tokens at the counter
  const allTokens: QueueOrder[] = [
    ...orders
      .filter((o) => o.status !== 'Collected')
      .map((o) => ({
        id: o.id,
        token: o.token,
        student: o.student,
        enrollment: o.enrollment,
        campus: o.campus,
        lines: o.lines.map((l) => ({ name: l.name, qty: l.qty })),
        total: o.total,
        status: o.status,
        minutesAgo: 0,
      })),
    ...LIVE_QUEUE,
  ]

  function press(key: string) {
    setResult({ kind: 'idle' })
    if (key === 'clear') return setEntry('')
    if (key === 'del') return setEntry((e) => e.slice(0, -1))
    setEntry((e) => (e.length >= 3 ? e : e + key))
  }

  function verify() {
    if (!entry) return
    const token = Number(entry)
    const match = allTokens.find((o) => o.token === token)

    if (!match) {
      setResult({ kind: 'unknown', token: entry })
    } else if (collected.includes(token) || match.status === 'Collected') {
      setResult({ kind: 'already', order: match })
    } else {
      setResult({ kind: 'ok', order: match })
      setCollected((c) => [...c, token])
      setLog((l) => [{ token, student: match.student }, ...l].slice(0, 6))
    }
    setEntry('')
  }

  return (
    <AdminShell
      title="Token scanner"
      description="Punch in the token the student shows you. One tap, order closed."
      actions={
        <div className="flex items-center gap-2 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-semibold text-secondary-foreground">
          <ScanLine className="size-3.5" aria-hidden="true" />
          {collected.length} handed over today
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr]">
        {/* keypad */}
        <section className="rounded-2xl border border-border bg-card p-5">
          <h2 className="sr-only">Token keypad</h2>
          <div
            className="flex h-20 items-center justify-center rounded-xl bg-secondary font-display text-4xl font-bold tabular-nums tracking-widest"
            aria-live="polite"
            aria-label={entry ? `Token ${entry}` : 'No token entered'}
          >
            {entry || <span className="text-muted-foreground">—</span>}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {KEYS.map((k) => (
              <Button
                key={k}
                type="button"
                variant={k === '0' || !isNaN(Number(k)) ? 'secondary' : 'ghost'}
                onClick={() => press(k)}
                aria-label={
                  k === 'del' ? 'Delete last digit' : k === 'clear' ? 'Clear' : k
                }
                className="h-14 rounded-xl font-display text-lg font-semibold"
              >
                {k === 'del' ? (
                  <Delete className="size-5" aria-hidden="true" />
                ) : k === 'clear' ? (
                  <span className="text-xs font-semibold tracking-wide">CLR</span>
                ) : (
                  k
                )}
              </Button>
            ))}
          </div>

          <Button
            type="button"
            onClick={verify}
            disabled={!entry}
            className="mt-3 h-12 w-full rounded-xl text-sm font-semibold"
          >
            Verify &amp; hand over
          </Button>
        </section>

        {/* result + log */}
        <div className="flex flex-col gap-4">
          <section
            className={cn(
              'flex min-h-56 flex-col justify-center rounded-2xl border p-6 transition-colors',
              result.kind === 'ok' && 'border-primary/40 bg-primary/5',
              result.kind === 'already' && 'border-accent/50 bg-accent/10',
              result.kind === 'unknown' && 'border-destructive/40 bg-destructive/5',
              result.kind === 'idle' && 'border-border border-dashed bg-card',
            )}
            aria-live="polite"
          >
            {result.kind === 'idle' && (
              <div className="text-center">
                <ScanLine
                  className="mx-auto size-8 text-muted-foreground"
                  aria-hidden="true"
                />
                <p className="mt-3 font-display text-base font-semibold">
                  Waiting for a token
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try 58, 55 or 53 to see how verification responds.
                </p>
              </div>
            )}

            {result.kind === 'unknown' && (
              <div className="text-center">
                <XCircle
                  className="mx-auto size-8 text-destructive"
                  aria-hidden="true"
                />
                <p className="mt-3 font-display text-lg font-semibold">
                  Token {result.token} not found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask the student to reopen their order screen.
                </p>
              </div>
            )}

            {(result.kind === 'ok' || result.kind === 'already') && (
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  {result.kind === 'ok' ? (
                    <CheckCircle2
                      className="size-7 text-primary"
                      aria-hidden="true"
                    />
                  ) : (
                    <XCircle className="size-7 text-accent" aria-hidden="true" />
                  )}
                  <div>
                    <p className="font-display text-lg font-semibold">
                      {result.kind === 'ok'
                        ? `Token ${result.order.token} verified`
                        : `Token ${result.order.token} already collected`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {result.order.student} · {result.order.enrollment} ·{' '}
                      {result.order.campus}
                    </p>
                  </div>
                </div>

                <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
                  {result.order.lines.map((l) => (
                    <li
                      key={l.name}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        <span className="font-mono text-muted-foreground">
                          {l.qty}×
                        </span>{' '}
                        {l.name}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-semibold">
                  <span>Paid</span>
                  <span className="font-mono">{rupee(result.order.total)}</span>
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-semibold">
              Recently handed over
            </h2>
            {log.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                Nothing verified in this session yet.
              </p>
            ) : (
              <ul className="mt-3 flex flex-wrap gap-2">
                {log.map((l) => (
                  <li key={`${l.token}-${l.student}`}>
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1 font-normal"
                    >
                      <span className="font-mono font-semibold">
                        #{l.token}
                      </span>
                      <span className="ml-1.5 text-muted-foreground">
                        {l.student}
                      </span>
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  )
}
