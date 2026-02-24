export type ActivityType = "labirinto" | "elastico"

export interface Participant {
  id: string
  name: string
  age: number
  time: number // tempo em segundos
  activity: ActivityType
  createdAt: Date
}

export type AgeGroup = "0-5" | "6-10" | "11-15" | "16-20" | "21-30" | "31-40" | "41+"

export function getAgeGroup(age: number): AgeGroup {
  if (age <= 5) return "0-5"
  if (age <= 10) return "6-10"
  if (age <= 15) return "11-15"
  if (age <= 20) return "16-20"
  if (age <= 30) return "21-30"
  if (age <= 40) return "31-40"
  return "41+"
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const wholeSecs = Math.floor(secs)
  const centisecs = Math.round((secs - wholeSecs) * 100)
  return `${mins.toString().padStart(2, "0")}:${wholeSecs.toString().padStart(2, "0")}.${centisecs.toString().padStart(2, "0")}`
}
