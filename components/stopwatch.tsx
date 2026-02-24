"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"
import { formatTime } from "@/lib/types"

interface StopwatchProps {
  onTimeCapture: (time: number) => void
}

export function Stopwatch({ onTimeCapture }: StopwatchProps) {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const accumulatedRef = useRef<number>(0)

  const start = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    startTimeRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      setTime(accumulatedRef.current + elapsed)
    }, 10)
  }, [isRunning])

  const pause = useCallback(() => {
    if (!isRunning) return
    setIsRunning(false)
    accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isRunning])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTime(0)
    accumulatedRef.current = 0
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const capture = useCallback(() => {
    if (time > 0) {
      onTimeCapture(Math.round(time * 100) / 100)
    }
  }, [time, onTimeCapture])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-52 h-52 rounded-full border-4 border-primary/30 flex items-center justify-center relative">
          <div
            className="absolute inset-1 rounded-full"
            style={{
              background: isRunning
                ? "conic-gradient(oklch(0.65 0.2 145) calc(var(--progress) * 1%), oklch(0.25 0.01 260) 0)"
                : "oklch(0.22 0.008 260)",
              ["--progress" as string]: Math.min((time % 60) / 60 * 100, 100),
            }}
          />
          <div className="absolute inset-3 rounded-full bg-card flex items-center justify-center">
            <span className="font-mono text-3xl font-bold text-foreground tabular-nums tracking-tight">
              {formatTime(time)}
            </span>
          </div>
        </div>
        {isRunning && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary" />
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {!isRunning ? (
          <Button onClick={start} size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Play className="h-5 w-5" />
            Iniciar
          </Button>
        ) : (
          <Button onClick={pause} size="lg" variant="secondary" className="gap-2">
            <Pause className="h-5 w-5" />
            Pausar
          </Button>
        )}
        <Button onClick={reset} size="lg" variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Zerar
        </Button>
        <Button
          onClick={capture}
          size="lg"
          disabled={time === 0}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40"
        >
          Capturar
        </Button>
      </div>
      {time > 0 && !isRunning && (
        <p className="text-sm text-muted-foreground">
          Tempo capturado: <span className="font-mono text-foreground font-semibold">{formatTime(time)}</span>
        </p>
      )}
    </div>
  )
}
