"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import type { Participant, AgeGroup } from "@/lib/types"
import { getAgeGroup } from "@/lib/types"

interface AgeStatisticsProps {
  labirintoParticipants: Participant[]
  elasticoParticipants: Participant[]
}

const AGE_GROUPS: AgeGroup[] = ["0-5", "6-10", "11-15", "16-20", "21-30", "31-40", "41+"]

const CHART_COLORS = [
  "#4ade80",
  "#facc15",
  "#60a5fa",
  "#f87171",
  "#c084fc",
  "#fb923c",
  "#2dd4bf",
]

function computeStats(participants: Participant[]) {
  const total = participants.length
  if (total === 0) return []
  
  const counts: Record<string, number> = {}
  for (const group of AGE_GROUPS) {
    counts[group] = 0
  }
  for (const p of participants) {
    const group = getAgeGroup(p.age)
    counts[group]++
  }
  return AGE_GROUPS.map((group, i) => ({
    group,
    count: counts[group],
    percentage: total > 0 ? Math.round((counts[group] / total) * 100) : 0,
    fill: CHART_COLORS[i],
  })).filter((d) => d.count > 0)
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{payload[0].value}%</p>
    </div>
  )
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
      <p className="text-xs text-muted-foreground">{payload[0].value}%</p>
    </div>
  )
}

function StatSection({ title, participants, color }: { title: string; participants: Participant[]; color: string }) {
  const data = useMemo(() => computeStats(participants), [participants])

  if (participants.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground py-8 text-center">
          Nenhum dado disponivel ainda.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <span className="text-sm text-muted-foreground font-mono">{participants.length} participantes</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.01 260)" />
              <XAxis
                dataKey="group"
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                axisLine={{ stroke: "oklch(0.28 0.01 260)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "oklch(0.65 0 0)", fontSize: 12 }}
                axisLine={{ stroke: "oklch(0.28 0.01 260)" }}
                tickLine={false}
                unit="%"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="percentage" radius={[6, 6, 0, 0]} maxBarSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="percentage"
                nameKey="group"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`pie-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {data.map((d) => (
          <div key={d.group} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.fill }} />
            <span className="text-xs text-muted-foreground">
              {d.group} anos ({d.percentage}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AgeStatistics({ labirintoParticipants, elasticoParticipants }: AgeStatisticsProps) {
  return (
    <div className="flex flex-col gap-8">
      <StatSection
        title="Labirinto"
        participants={labirintoParticipants}
        color="#4ade80"
      />
      <div className="h-px bg-border" />
      <StatSection
        title="Elastico com Bolinhas"
        participants={elasticoParticipants}
        color="#facc15"
      />
    </div>
  )
}
