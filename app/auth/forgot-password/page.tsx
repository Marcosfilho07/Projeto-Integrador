"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Puzzle, Loader2, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError("Erro ao enviar email de recuperacao. Verifique se o email esta correto.")
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="flex flex-col items-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Verifique seu email</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Enviamos um link de recuperacao para <span className="text-foreground font-medium">{email}</span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Clique no link enviado para seu email para redefinir sua senha. 
              O link expira em 24 horas.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Nao recebeu o email? Verifique sua caixa de spam ou tente novamente.
            </p>
            <button
              onClick={() => {
                setSuccess(false)
                setEmail("")
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Tentar novamente
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/auth/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Voltar para o login
            </Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
            <Puzzle className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Esqueceu sua senha?</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Digite seu email e enviaremos um link para redefinir sua senha
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg bg-destructive/15 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar link de recuperacao"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/auth/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </p>
      </div>
    </main>
  )
}
