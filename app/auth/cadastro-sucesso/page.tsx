import Link from 'next/link'
import { CheckCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CadastroSucessoPage() {
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
              
              <h1 className="text-2xl font-bold text-foreground">Conta criada!</h1>
              
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">
                  Enviamos um email de confirmação para você.
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Verifique sua caixa de entrada</span>
                </div>
              </div>

              <div className="mt-4 w-full">
                <Button asChild className="w-full">
                  <Link href="/auth/login">
                    Ir para Login
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
