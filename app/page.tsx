"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ActivityPanel } from "@/components/activity-panel"
import { AgeStatistics } from "@/components/age-statistics"
import type { Participant } from "@/lib/types"
import { Puzzle, Circle, BarChart3 } from "lucide-react"

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([])

  const labirintoParticipants = participants.filter((p) => p.activity === "labirinto")
  const elasticoParticipants = participants.filter((p) => p.activity === "elastico")

  function addParticipant(participant: Participant) {
    setParticipants((prev) => [...prev, participant])
  }

  function removeParticipant(id: string) {
    setParticipants((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm font-mono">PI</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Projeto Integrador</h1>
              <p className="text-xs text-muted-foreground">Registro de Atividades</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <span>{participants.length} registros</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        <Tabs defaultValue="labirinto" className="flex flex-col gap-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary border border-border h-12">
            <TabsTrigger
              value="labirinto"
              className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Puzzle className="h-4 w-4" />
              <span className="hidden sm:inline">Labirinto</span>
            </TabsTrigger>
            <TabsTrigger
              value="elastico"
              className="gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
            >
              <Circle className="h-4 w-4" />
              <span className="hidden sm:inline">Elastico</span>
            </TabsTrigger>
            <TabsTrigger
              value="estatisticas"
              className="gap-2 data-[state=active]:bg-chart-3 data-[state=active]:text-foreground"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Estatisticas</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="labirinto">
            <ActivityPanel
              activity="labirinto"
              title="Labirinto"
              description="Registre o tempo que cada participante levou para completar o labirinto."
              participants={labirintoParticipants}
              onAdd={addParticipant}
              onRemove={removeParticipant}
              icon={<Puzzle className="h-5 w-5" />}
            />
          </TabsContent>

          <TabsContent value="elastico">
            <ActivityPanel
              activity="elastico"
              title="Elastico com Bolinhas"
              description="Registre o tempo que cada participante levou na brincadeira do elastico com bolinhas."
              participants={elasticoParticipants}
              onAdd={addParticipant}
              onRemove={removeParticipant}
              icon={<Circle className="h-5 w-5" />}
            />
          </TabsContent>

          <TabsContent value="estatisticas">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-chart-3/15 text-chart-3">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Estatisticas por Faixa Etaria</h2>
                  <p className="text-sm text-muted-foreground">
                    Distribuicao percentual dos participantes por faixa etaria em cada atividade.
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Labirinto</span>
                  <span className="text-3xl font-bold font-mono text-primary">{labirintoParticipants.length}</span>
                  <span className="text-xs text-muted-foreground">participantes</span>
                </div>
                <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Elastico</span>
                  <span className="text-3xl font-bold font-mono text-accent">{elasticoParticipants.length}</span>
                  <span className="text-xs text-muted-foreground">participantes</span>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <AgeStatistics
                  labirintoParticipants={labirintoParticipants}
                  elasticoParticipants={elasticoParticipants}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
