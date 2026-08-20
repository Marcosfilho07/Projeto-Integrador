"use client"

import { useState } from "react"
import { Stopwatch } from "@/components/stopwatch"
import { ParticipantForm } from "@/components/participant-form"
import { ParticipantsTable } from "@/components/participants-table"
import type { Activity, Participant } from "@/lib/types"
import { formatTime } from "@/lib/types"
import { Clock, Users, Zap } from "lucide-react"

interface Props { activity: Activity; participants: Participant[]; onAdd: (participant: Participant) => Promise<void>; onRemove: (id: string) => Promise<void> }

export function ActivityPanel({ activity, participants, onAdd, onRemove }: Props) {
  const [capturedTime, setCapturedTime] = useState<number | null>(null)
  const bestTime = participants.length ? Math.min(...participants.map((p) => p.time)) : null
  const avgTime = participants.length ? participants.reduce((sum, p) => sum + p.time, 0) / participants.length : null
  return <div className="flex flex-col gap-6"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary"><span className="text-xs font-semibold">{activity.icon === "Circle" ? "EL" : activity.icon === "Puzzle" ? "LB" : "AT"}</span></div><div><h2 className="text-xl font-bold text-foreground text-balance">{activity.name}</h2><p className="text-sm text-muted-foreground">{activity.description}</p></div></div><div className="grid grid-cols-3 gap-3"><div className="rounded-xl border border-border bg-secondary p-3 text-center"><Users className="mx-auto size-4 text-muted-foreground" /><span className="block text-2xl font-bold font-mono">{participants.length}</span><span className="text-[10px] text-muted-foreground uppercase">Total</span></div><div className="rounded-xl border border-border bg-secondary p-3 text-center"><Zap className="mx-auto size-4 text-accent" /><span className="block text-lg font-bold font-mono text-accent">{bestTime !== null ? formatTime(bestTime) : "--"}</span><span className="text-[10px] text-muted-foreground uppercase">Melhor</span></div><div className="rounded-xl border border-border bg-secondary p-3 text-center"><Clock className="mx-auto size-4 text-muted-foreground" /><span className="block text-lg font-bold font-mono">{avgTime !== null ? formatTime(avgTime) : "--"}</span><span className="text-[10px] text-muted-foreground uppercase">Média</span></div></div><div className="rounded-xl border border-border bg-card p-6"><h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase">Temporizador</h3><Stopwatch onTimeCapture={setCapturedTime} /></div><div className="rounded-xl border border-border bg-card p-6"><h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase">Registrar participante</h3><ParticipantForm activity={activity} capturedTime={capturedTime} onAdd={onAdd} onClearTime={() => setCapturedTime(null)} /></div><div className="rounded-xl border border-border bg-card p-6"><h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase">Ranking ({participants.length})</h3><ParticipantsTable participants={participants} onRemove={onRemove} /></div></div>
}
