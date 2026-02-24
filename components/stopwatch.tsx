"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw, Timer } from "lucide-react"
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

  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    setIsRunning(true)
    startTimeRef.current = Date.now()
    stopInterval()
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      setTime(accumulatedRef.current + elapsed)
    }, 50)
  }, [stopInterval])

  const pause = useCallback(() => {
    setIsRunning(false)
    accumulatedRef.current += (Date.now() - startTimeRef.current) / 1000
    setTime(accumulatedRef.current)
    stopInterval()
  }, [stopInterval])

  const reset = useCallback(() => {
    setIsRunning(false)
    setTime(0)
    accumulatedRef.current = 0
    stopInterval()
  }, [stopInterval])

  const capture = useCallback(() => {
    if (time > 0) {
      onTimeCapture(Math.round(time * 100) / 100)
    }
  }, [time, onTimeCapture])

  useEffect(() => {
    return () => stopInterval()
  }, [stopInterval])

  const progress = Math.min((time % 60) / 60, 1)
  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      {/* Timer Circle */}
      <div className="relative w-52 h-52">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="oklch(0.25 0.01 260)"
            strokeWidth="6"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke={isRunning ? "#4ade80" : "#60a5fa"}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.1s linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-bold text-foreground tabular-nums tracking-tight">
            {formatTime(time)}
          </span>
          {isRunning && (
            <span className="text-xs text-primary font-medium mt-1 animate-pulse">CRONOMETRANDO</span>
          )}
          {!isRunning && time > 0 && (
            <span className="text-xs text-muted-foreground mt-1">PAUSADO</span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isRunning ? (
          <Button
            type="button"
            onClick={start}
            size="lg"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Play className="h-5 w-5" />
            Iniciar
          </Button>
        ) : (
          <Button
            type="button"
            onClick={pause}
            size="lg"
            variant="secondary"
            className="gap-2"
          >
            <Pause className="h-5 w-5" />
            Pausar
          </Button>
        )}
        <Button
          type="button"
          onClick={reset}
          size="lg"
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Zerar
        </Button>
        <Button
          type="button"
          onClick={capture}
          size="lg"
          disabled={time === 0}
          className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40"
        >
          <Timer className="h-4 w-4" />
          Capturar
        </Button>
      </div>
    </div>
  )
}
