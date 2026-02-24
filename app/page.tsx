"use client"

import { useState } from "react"
import { ActivityPanel } from "@/components/activity-panel"
import { AgeStatistics } from "@/components/age-statistics"
import type { Participant } from "@/lib/types"
import { Puzzle, Circle, BarChart3 } from "lucide-react"

type TabValue = "labirinto" | "elastico" | "estatisticas"

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [activeTab, setActiveTab] = useState<TabValue>("labirinto")

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
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
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
          <div className="text-xs text-muted-foreground font-mono">
            {participants.length} registros
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-6 flex flex-col gap-6">
        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-secondary border border-border p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("labirinto")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "labirinto"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Puzzle className="h-4 w-4" />
            <span className="hidden sm:inline">Labirinto</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("elastico")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "elastico"
                ? "bg-accent text-accent-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Circle className="h-4 w-4" />
            <span className="hidden sm:inline">Elastico</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("estatisticas")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "estatisticas"
                ? "bg-chart-3 text-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Estatisticas</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "labirinto" && (
          <ActivityPanel
            activity="labirinto"
            title="Labirinto"
            description="Registre o tempo que cada participante levou para completar o labirinto."
            participants={labirintoParticipants}
            onAdd={addParticipant}
            onRemove={removeParticipant}
            icon={<Puzzle className="h-5 w-5" />}
          />
        )}

        {activeTab === "elastico" && (
          <ActivityPanel
            activity="elastico"
            title="Elastico com Bolinhas"
            description="Registre o tempo que cada participante levou na brincadeira do elastico com bolinhas."
            participants={elasticoParticipants}
            onAdd={addParticipant}
            onRemove={removeParticipant}
            icon={<Circle className="h-5 w-5" />}
          />
        )}

        {activeTab === "estatisticas" && (
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
        )}
      </div>
    </main>
  )
}
