"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"
import type { ActivityType, Participant } from "@/lib/types"

interface ParticipantFormProps {
  activity: ActivityType
  capturedTime: number | null
  onAdd: (participant: Participant) => void
  onClearTime: () => void
}

export function ParticipantForm({ activity, capturedTime, onAdd, onClearTime }: ParticipantFormProps) {
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [manualTime, setManualTime] = useState("")

  const effectiveTime = capturedTime !== null ? capturedTime : (manualTime ? parseFloat(manualTime) : null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !age || effectiveTime === null || effectiveTime <= 0) return

    const participant: Participant = {
      id: crypto.randomUUID(),
      name: name.trim(),
      age: parseInt(age),
      time: effectiveTime,
      activity,
      createdAt: new Date(),
    }
    onAdd(participant)
    setName("")
    setAge("")
    setManualTime("")
    onClearTime()
  }

  const isValid = name.trim() && age && effectiveTime !== null && effectiveTime > 0

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`name-${activity}`} className="text-sm font-medium text-foreground">
          Nome do Participante
        </Label>
        <Input
          id={`name-${activity}`}
          placeholder="Digite o nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`age-${activity}`} className="text-sm font-medium text-foreground">
          Idade
        </Label>
        <Input
          id={`age-${activity}`}
          type="number"
          min={1}
          max={120}
          placeholder="Digite a idade"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={`time-${activity}`} className="text-sm font-medium text-foreground">
          Tempo (segundos)
        </Label>
        {capturedTime !== null ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-md bg-primary/10 border border-primary/30 px-3 py-2 font-mono text-sm text-primary">
              {capturedTime.toFixed(2)}s (capturado do temporizador)
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClearTime}
              className="text-muted-foreground hover:text-foreground"
            >
              Limpar
            </Button>
          </div>
        ) : (
          <Input
            id={`time-${activity}`}
            type="number"
            step="0.01"
            min={0.01}
            placeholder="Ou digite manualmente em segundos"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        )}
      </div>
      <Button
        type="submit"
        disabled={!isValid}
        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 mt-2"
      >
        <UserPlus className="h-4 w-4" />
        Registrar Participante
      </Button>
    </form>
  )
}
