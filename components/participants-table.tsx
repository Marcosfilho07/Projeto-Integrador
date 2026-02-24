"use client"

import { Button } from "@/components/ui/button"
import { Trash2, Trophy } from "lucide-react"
import type { Participant } from "@/lib/types"
import { formatTime } from "@/lib/types"

interface ParticipantsTableProps {
  participants: Participant[]
  onRemove: (id: string) => void
}

export function ParticipantsTable({ participants, onRemove }: ParticipantsTableProps) {
  const sorted = [...participants].sort((a, b) => a.time - b.time)

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-sm">Nenhum participante registrado ainda.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground w-12">#</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Nome</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Idade</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground">Tempo</th>
            <th className="px-3 py-2.5 text-left text-xs font-semibold text-muted-foreground w-12">
              <span className="sr-only">Acoes</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-secondary/30 transition-colors">
              <td className="px-3 py-2.5 font-mono text-sm text-muted-foreground">
                {i === 0 && sorted.length > 1 ? (
                  <Trophy className="h-4 w-4 text-accent" aria-label="Primeiro lugar" />
                ) : (
                  i + 1
                )}
              </td>
              <td className="px-3 py-2.5 font-medium text-foreground">{p.name}</td>
              <td className="px-3 py-2.5 text-foreground">{p.age} anos</td>
              <td className="px-3 py-2.5 font-mono text-sm text-primary font-semibold">
                {formatTime(p.time)}
              </td>
              <td className="px-3 py-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(p.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Remover</span>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
