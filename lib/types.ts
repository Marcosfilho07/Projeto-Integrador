export type MeasurementType = "time" | "score" | "quantity" | "observation"

export interface Activity {
  id: string
  userId: string
  name: string
  description: string | null
  icon: string
  measurementType: MeasurementType
  createdAt: Date
}

export interface Participant {
  id: string
  name: string
  age: number
  time: number
  activity: string
  activityId: string | null
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

export function normalizeActivityName(name: string) {
  return name.trim().toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

export function iconForActivity(icon: string) {
  return icon === "Circle" ? "circle" : icon === "Puzzle" ? "puzzle" : "timer"
}

export const DEFAULT_ACTIVITY_ICONS = ["Puzzle", "Circle", "Timer", "Target", "Star"]
export const DEFAULT_MEASUREMENT_TYPES: Array<{ value: MeasurementType; label: string }> = [
  { value: "time", label: "Tempo" },
  { value: "score", label: "Pontuação" },
  { value: "quantity", label: "Quantidade" },
  { value: "observation", label: "Observação" },
]

export function activityValueLabel(measurementType: MeasurementType) {
  return measurementType === "time" ? "Tempo (segundos)" : measurementType === "score" ? "Pontuação" : measurementType === "quantity" ? "Quantidade" : "Valor"
}

export function activityValueIsNumeric(measurementType: MeasurementType) {
  return measurementType !== "observation"
}

export function formatActivityValue(value: number, type: MeasurementType) {
  return type === "time" ? formatTime(value) : `${value}`
}

export function parseActivityRow(row: any): Activity {
  return { id: row.id, userId: row.user_id, name: row.name, description: row.description, icon: row.icon || "Timer", measurementType: row.measurement_type || "time", createdAt: new Date(row.created_at) }
}

export function parseParticipantRow(row: any): Participant {
  return { id: row.id, name: row.name, age: row.age, time: Number(row.time), activity: row.activity, activityId: row.activity_id ?? null, createdAt: new Date(row.created_at) }
}
