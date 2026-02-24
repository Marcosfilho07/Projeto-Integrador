"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Stopwatch } from "@/components/stopwatch"
import { ParticipantForm } from "@/components/participant-form"
import { ParticipantsTable } from "@/components/participants-table"
import type { ActivityType, Participant } from "@/lib/types"
import { formatTime } from "@/lib/types"
import { Clock, Users, Zap } from "lucide-react"

interface ActivityPanelProps {
  activity: ActivityType
  title: string
  description: string
  participants: Participant[]
  onAdd: (participant: Participant) => void
  onRemove: (id: string) => void
  icon: React.ReactNode
}

export function ActivityPanel({
  activity,
  title,
  description,
  participants,
  onAdd,
  onRemove,
  icon,
}: ActivityPanelProps) {
  const [capturedTime, setCapturedTime] = useState<number | null>(null)

  const bestTime = participants.length > 0
    ? Math.min(...participants.map((p) => p.time))
    : null

  const avgTime = participants.length > 0
    ? participants.reduce((sum, p) => sum + p.time, 0) / participants.length
    : null

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/15 text-primary">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground text-balance">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-secondary border-border">
          <CardContent className="p-3 flex flex-col items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold font-mono text-foreground">{participants.length}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</span>
          </CardContent>
        </Card>
        <Card className="bg-secondary border-border">
          <CardContent className="p-3 flex flex-col items-center gap-1">
            <Zap className="h-4 w-4 text-accent" />
            <span className="text-2xl font-bold font-mono text-accent">
              {bestTime !== null ? formatTime(bestTime) : "--"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Melhor</span>
          </CardContent>
        </Card>
        <Card className="bg-secondary border-border">
          <CardContent className="p-3 flex flex-col items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold font-mono text-foreground">
              {avgTime !== null ? formatTime(avgTime) : "--"}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Media</span>
          </CardContent>
        </Card>
      </div>

      {/* Stopwatch */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Temporizador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Stopwatch onTimeCapture={(t) => setCapturedTime(t)} />
        </CardContent>
      </Card>

      {/* Form */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Registrar Participante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ParticipantForm
            activity={activity}
            capturedTime={capturedTime}
            onAdd={onAdd}
            onClearTime={() => setCapturedTime(null)}
          />
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Ranking ({participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ParticipantsTable participants={participants} onRemove={onRemove} />
        </CardContent>
      </Card>
    </div>
  )
}
