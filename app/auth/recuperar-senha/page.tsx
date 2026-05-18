'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useState } from 'react'
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/nova-senha`,
      })
      if (error) throw error
      setIsSuccess(true)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Ocorreu um erro ao enviar o email')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl font-mono">PI</span>
              </div>
            </div>

            {/* Card */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                
                <h1 className="text-2xl font-bold text-foreground">Email enviado!</h1>
                
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground">
                    Enviamos um link de recuperação para:
                  </p>
                  <p className="font-medium text-foreground">{email}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Verifique sua caixa de entrada e spam.
                  </p>
                </div>

                <div className="mt-4 w-full">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login">
                      Voltar para Login
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Back button */}
          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para login
          </Link>

          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl font-mono">PI</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Recuperar senha</h1>
              <p className="text-sm text-muted-foreground">
                Digite seu email para receber um link de recuperação
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Enviar link de recuperação
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
