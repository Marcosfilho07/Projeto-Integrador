"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-semibold w-12">#</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Nome</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Idade</TableHead>
            <TableHead className="text-muted-foreground font-semibold">Tempo</TableHead>
            <TableHead className="text-muted-foreground font-semibold w-12">
              <span className="sr-only">Acoes</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((p, i) => (
            <TableRow key={p.id} className="border-border hover:bg-secondary/50">
              <TableCell className="font-mono text-sm text-muted-foreground">
                {i === 0 && sorted.length > 1 ? (
                  <Trophy className="h-4 w-4 text-accent" />
                ) : (
                  i + 1
                )}
              </TableCell>
              <TableCell className="font-medium text-foreground">{p.name}</TableCell>
              <TableCell className="text-foreground">{p.age} anos</TableCell>
              <TableCell className="font-mono text-sm text-primary font-semibold">
                {formatTime(p.time)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemove(p.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="sr-only">Remover</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
