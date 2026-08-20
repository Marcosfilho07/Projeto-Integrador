"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Activity, MeasurementType } from "@/lib/types"
import { DEFAULT_ACTIVITY_ICONS, DEFAULT_MEASUREMENT_TYPES } from "@/lib/types"

interface Props { activities: Activity[]; onCreate: (data: Omit<Activity, "id" | "userId" | "createdAt">) => Promise<void>; onUpdate: (id: string, data: Partial<Omit<Activity, "id" | "userId" | "createdAt">>) => Promise<void>; onDelete: (id: string) => Promise<void> }

export function ActivityManager({ activities, onCreate, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("Timer")
  const [measurementType, setMeasurementType] = useState<MeasurementType>("time")

  function startEdit(activity?: Activity) {
    setEditing(activity?.id ?? "new"); setName(activity?.name ?? ""); setDescription(activity?.description ?? ""); setIcon(activity?.icon ?? "Timer"); setMeasurementType(activity?.measurementType ?? "time")
  }
  function cancel() { setEditing(null); setName(""); setDescription("") }
  async function save() {
    if (!name.trim()) return
    const data = { name: name.trim(), description: description.trim() || null, icon, measurementType }
    if (editing === "new") await onCreate(data); else if (editing) await onUpdate(editing, data)
    cancel()
  }

  return <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5">
    <div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Minhas brincadeiras</h2><p className="text-sm text-muted-foreground">Personalize as atividades da sua conta.</p></div><Button onClick={() => startEdit()} size="sm"><Plus data-icon="inline-start" />Nova brincadeira</Button></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{activities.map((activity) => <div key={activity.id} className="flex flex-col gap-3 rounded-lg border border-border bg-secondary/40 p-4"><div className="flex items-start justify-between gap-2"><div><h3 className="font-semibold">{activity.name}</h3><p className="text-xs text-muted-foreground">{activity.description || "Sem descrição"}</p></div><span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">{activity.measurementType === "time" ? "Tempo" : activity.measurementType === "score" ? "Pontuação" : activity.measurementType === "quantity" ? "Quantidade" : "Observação"}</span></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => startEdit(activity)}><Pencil data-icon="inline-start" />Editar</Button><Button variant="ghost" size="sm" onClick={() => { if (window.confirm(`Excluir ${activity.name}? Participantes vinculados impedirão a exclusão.`)) void onDelete(activity.id) }} className="text-destructive"><Trash2 data-icon="inline-start" />Excluir</Button></div></div>)}</div>
    {editing && <div className="flex flex-col gap-4 rounded-lg border border-primary/30 bg-primary/5 p-4"><h3 className="font-semibold">{editing === "new" ? "Nova brincadeira" : "Editar brincadeira"}</h3><div className="grid gap-4 sm:grid-cols-2"><div className="flex flex-col gap-2"><Label htmlFor="activity-name">Nome</Label><Input id="activity-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Corrida" /></div><div className="flex flex-col gap-2"><Label htmlFor="activity-type">Métrica</Label><select id="activity-type" className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={measurementType} onChange={(e) => setMeasurementType(e.target.value as MeasurementType)}>{DEFAULT_MEASUREMENT_TYPES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div></div><div className="flex flex-col gap-2"><Label htmlFor="activity-description">Descrição</Label><Textarea id="activity-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explique como funciona a brincadeira" /></div><div className="flex flex-wrap gap-2"><Label className="w-full">Ícone</Label>{DEFAULT_ACTIVITY_ICONS.map((item) => <button type="button" key={item} onClick={() => setIcon(item)} className={`rounded-md border px-3 py-1.5 text-xs ${icon === item ? "border-primary bg-primary/10 text-primary" : "border-border"}`}>{item}</button>)}</div><div className="flex justify-end gap-2"><Button variant="outline" onClick={cancel}>Cancelar</Button><Button onClick={() => void save()} disabled={!name.trim()}>Salvar</Button></div></div>}
  </section>
}
