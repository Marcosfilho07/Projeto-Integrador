import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
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
              <div className="h-16 w-16 rounded-full bg-destructive/15 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground">Erro de autenticação</h1>
              
              <p className="text-muted-foreground">
                Ocorreu um erro durante o processo de autenticação. Por favor, tente novamente.
              </p>

              <div className="mt-4 w-full flex flex-col gap-3">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    Ir para Login
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/auth/cadastro">
                    Criar nova conta
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
