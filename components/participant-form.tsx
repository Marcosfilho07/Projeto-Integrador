"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import type { Activity, Participant } from "@/lib/types"

interface Props { activity: Activity; capturedTime: number | null; onAdd: (participant: Participant) => Promise<void>; onClearTime: () => void }

export function ParticipantForm({ activity, capturedTime, onAdd, onClearTime }: Props) {
  const [name, setName] = useState(""); const [age, setAge] = useState(""); const [manualTime, setManualTime] = useState("")
  const effectiveTime = capturedTime !== null ? capturedTime : manualTime ? Number(manualTime) : null
  async function handleSubmit(event: React.FormEvent) { event.preventDefault(); if (!name.trim() || !age || effectiveTime === null || effectiveTime <= 0) return; await onAdd({ id: crypto.randomUUID(), name: name.trim(), age: Number(age), time: effectiveTime, activity: activity.name, activityId: activity.id, createdAt: new Date() }); setName(""); setAge(""); setManualTime(""); onClearTime() }
  const valid = Boolean(name.trim() && age && effectiveTime !== null && effectiveTime > 0)
  return <form onSubmit={(event) => void handleSubmit(event)} className="flex flex-col gap-4"><div className="flex flex-col gap-2"><Label htmlFor={`name-${activity.id}`}>Nome do participante</Label><Input id={`name-${activity.id}`} value={name} onChange={(event) => setName(event.target.value)} placeholder="Digite o nome" required /></div><div className="flex flex-col gap-2"><Label htmlFor={`age-${activity.id}`}>Idade</Label><Input id={`age-${activity.id}`} type="number" min={1} max={120} value={age} onChange={(event) => setAge(event.target.value)} placeholder="Digite a idade" required /></div><div className="flex flex-col gap-2"><Label htmlFor={`time-${activity.id}`}>Tempo (segundos)</Label>{capturedTime !== null ? <div className="flex items-center gap-2"><div className="flex-1 rounded-md border border-primary/30 bg-primary/10 px-3 py-2 font-mono text-sm text-primary">{capturedTime.toFixed(2)}s capturado</div><Button type="button" variant="ghost" size="sm" onClick={onClearTime}>Limpar</Button></div> : <Input id={`time-${activity.id}`} type="number" step="0.01" min="0.01" value={manualTime} onChange={(event) => setManualTime(event.target.value)} placeholder="Digite em segundos" />}</div><Button type="submit" disabled={!valid} className="w-full"><UserPlus data-icon="inline-start" />Registrar participante</Button></form>
}
