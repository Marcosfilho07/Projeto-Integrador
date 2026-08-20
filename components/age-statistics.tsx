"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { Activity, Participant, AgeGroup } from "@/lib/types"
import { getAgeGroup } from "@/lib/types"

const GROUPS: AgeGroup[] = ["0-5", "6-10", "11-15", "16-20", "21-30", "31-40", "41+"]
const COLORS = ["#4ade80", "#facc15", "#60a5fa", "#f87171", "#c084fc", "#fb923c", "#2dd4bf"]
function stats(items: Participant[]) { const counts = Object.fromEntries(GROUPS.map((group) => [group, 0])); items.forEach((item) => { counts[getAgeGroup(item.age)]++ }); return GROUPS.map((group, index) => ({ group, percentage: items.length ? Math.round((counts[group] / items.length) * 100) : 0, fill: COLORS[index] })).filter((item) => item.percentage) }
function ActivityStats({ activity, participants }: { activity: Activity; participants: Participant[] }) { const items = participants.filter((p) => p.activityId === activity.id || (!p.activityId && p.activity === activity.name)); const data = stats(items); return <section className="flex flex-col gap-4"><div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{activity.name}</h3><span className="text-sm text-muted-foreground">{items.length} participantes</span></div>{!items.length ? <p className="py-6 text-center text-sm text-muted-foreground">Nenhum dado disponível ainda.</p> : <div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="group" /><YAxis unit="%" /><Tooltip /><Bar dataKey="percentage" radius={[6, 6, 0, 0]}>{data.map((entry) => <Cell key={entry.group} fill={entry.fill} />)}</Bar></BarChart></ResponsiveContainer></div>}</section> }
export function AgeStatistics({ activities, participants }: { activities: Activity[]; participants: Participant[] }) { return <div className="flex flex-col gap-8">{activities.map((activity) => <ActivityStats key={activity.id} activity={activity} participants={participants} />)}</div> }
