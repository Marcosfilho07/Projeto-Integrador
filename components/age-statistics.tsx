"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from "recharts"
import { Activity, Participant, formatTime } from "@/lib/types"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const AGE_GROUPS = ["0–9", "10–19", "20–29", "30–39", "40–49", "50–59", "60+"] as const
const chartConfig: ChartConfig = { media: { label: "Tempo médio", color: "var(--chart-1)" } }
const normalize = (value: string) => value.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
const belongsToActivity = (participant: Participant, activity: Activity) => participant.activityId === activity.id || (!participant.activityId && normalize(participant.activity) === normalize(activity.name))
const ageGroup = (age: number) => age <= 9 ? "0–9" : age <= 19 ? "10–19" : age <= 29 ? "20–29" : age <= 39 ? "30–39" : age <= 49 ? "40–49" : age <= 59 ? "50–59" : "60+"

function validTime(value: number) { return Number.isFinite(value) && value >= 0 }
function formatAverage(value: number | null) { return value === null ? "—" : formatTime(value) }

export function AgeStatistics({ activities, participants }: { activities: Activity[]; participants: Participant[] }) {
  const [selectedId, setSelectedId] = useState(activities[0]?.id ?? "")
  const selectedActivity = activities.find((activity) => activity.id === selectedId) ?? activities[0]
  const items = useMemo(() => selectedActivity ? participants.filter((participant) => belongsToActivity(participant, selectedActivity)) : [], [participants, selectedActivity])
  const times = items.filter((item) => validTime(item.time)).map((item) => item.time)
  const averages = AGE_GROUPS.map((group) => {
    const groupItems = items.filter((item) => ageGroup(item.age) === group && validTime(item.time))
    return { group, count: items.filter((item) => ageGroup(item.age) === group).length, average: groupItems.length ? groupItems.reduce((sum, item) => sum + item.time, 0) / groupItems.length : null }
  })
  const ranking = [...items].filter((item) => validTime(item.time)).sort((a, b) => a.time - b.time).slice(0, 10)
  const best = times.length ? Math.min(...times) : null
  const worst = times.length ? Math.max(...times) : null
  const average = times.length ? times.reduce((sum, time) => sum + time, 0) / times.length : null

  if (!activities.length) return <Card><CardContent className="py-10 text-center text-muted-foreground">Nenhuma brincadeira cadastrada.</CardContent></Card>
  return <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-bold">Estatísticas</h2><p className="text-sm text-muted-foreground">Dados separados por brincadeira.</p></div><Select value={selectedActivity.id} onValueChange={setSelectedId}><SelectTrigger className="w-full sm:w-64"><SelectValue placeholder="Selecione a brincadeira" /></SelectTrigger><SelectContent>{activities.map((activity) => <SelectItem key={activity.id} value={activity.id}>{activity.name}</SelectItem>)}</SelectContent></Select></div>
    <div className="grid gap-3 sm:grid-cols-4"><Card><CardHeader className="pb-2"><CardDescription>Participantes</CardDescription><CardTitle>{items.length}</CardTitle></CardHeader></Card><Card><CardHeader className="pb-2"><CardDescription>Melhor tempo</CardDescription><CardTitle className="font-mono text-lg">{formatAverage(best)}</CardTitle></CardHeader></Card><Card><CardHeader className="pb-2"><CardDescription>Pior tempo</CardDescription><CardTitle className="font-mono text-lg">{formatAverage(worst)}</CardTitle></CardHeader></Card><Card><CardHeader className="pb-2"><CardDescription>Tempo médio</CardDescription><CardTitle className="font-mono text-lg">{formatAverage(average)}</CardTitle></CardHeader></Card></div>
    <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle>Tempo médio por faixa etária</CardTitle><CardDescription>Somente tempos válidos de {selectedActivity.name}.</CardDescription></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-72 w-full"><BarChart accessibilityLayer data={averages.map((item) => ({ ...item, average: item.average ?? 0 }))}><CartesianGrid vertical={false} /><XAxis dataKey="group" /><YAxis tickFormatter={(value) => `${value}s`} /><Tooltip content={<ChartTooltipContent formatter={(value) => formatTime(Number(value))} />} /><Bar dataKey="average" fill="var(--color-media)" radius={6}>{averages.map((item) => <Cell key={item.group} fill={item.average === null ? "var(--muted)" : "var(--color-media)"} />)}</Bar></BarChart></ChartContainer></CardContent></Card><Card><CardHeader><CardTitle>Participantes por faixa etária</CardTitle><CardDescription>Todas as faixas são exibidas, mesmo sem registros.</CardDescription></CardHeader><CardContent><div className="flex flex-col gap-3">{averages.map((item) => <div key={item.group} className="flex items-center justify-between border-b border-border pb-2 text-sm last:border-0"><span>{item.group} anos</span><div className="flex items-center gap-3"><Badge variant="secondary">{item.count} participante{item.count === 1 ? "" : "s"}</Badge><span className="font-mono text-muted-foreground">{formatAverage(item.average)}</span></div></div>)}</div></CardContent></Card></div>
    <Card><CardHeader><CardTitle>Ranking</CardTitle><CardDescription>Melhores tempos de {selectedActivity.name}.</CardDescription></CardHeader><CardContent>{ranking.length ? <div className="flex flex-col gap-2">{ranking.map((item, index) => <div key={item.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"><span><span className="mr-3 font-mono text-muted-foreground">{index + 1}º</span>{item.name}</span><span className="font-mono font-semibold">{formatTime(item.time)}</span></div>)}</div> : <p className="text-sm text-muted-foreground">Nenhum tempo válido registrado.</p>}</CardContent></Card>
  </div>
}

export { ageGroup }
