'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Lock, Eye, EyeOff, CheckCircle, Save, AlertCircle, Loader2 } from 'lucide-react'

type Status = 'verifying' | 'ready' | 'invalid'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  // status controla se já existe uma sessão válida de recuperação
  const [status, setStatus] = useState<Status>('verifying')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    let isMounted = true

    // 5. Escuta mudanças de auth: quando o Supabase reconhece a recuperação,
    // libera o formulário de nova senha.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setStatus('ready')
        setError(null)
      }
    })

    const establishSession = async () => {
      // Primeiro verifica se já existe uma sessão ativa
      const {
        data: { session: existingSession },
      } = await supabase.auth.getSession()
      if (existingSession) {
        if (isMounted) setStatus('ready')
        return
      }

      const url = new URL(window.location.href)

      // 3 & 4. Fluxo PKCE moderno: a URL contém ?code=...
      const code = url.searchParams.get('code')
      const errorDescription = url.searchParams.get('error_description')

      if (errorDescription) {
        if (isMounted) {
          setStatus('invalid')
          setError('O link de recuperação é inválido ou já expirou. Solicite um novo.')
        }
        return
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          if (isMounted) {
            setStatus('invalid')
            setError('O link de recuperação é inválido ou já expirou. Solicite um novo.')
          }
          return
        }
        if (isMounted) setStatus('ready')
        return
      }

      // Fluxo legado: token de recuperação no hash (#access_token=...)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      const type = hashParams.get('type')

      if (accessToken && type === 'recovery') {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        })
        if (sessionError) {
          if (isMounted) {
            setStatus('invalid')
            setError('O link de recuperação é inválido ou já expirou. Solicite um novo.')
          }
          return
        }
        if (isMounted) setStatus('ready')
        return
      }

      // Nenhum code, hash ou sessão: sessão de autenticação ausente
      if (isMounted) {
        setStatus('invalid')
        setError('Sessão de autenticação ausente. Abra esta página pelo link enviado no seu email.')
      }
    }

    establishSession()

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // 8. Senhas diferentes
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      // 6. Só chega aqui com sessão válida (botão habilitado apenas quando status === 'ready')
      // 7. Atualiza a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })
      if (updateError) throw updateError

      // 9. Faz logout da sessão temporária de recuperação
      await supabase.auth.signOut()

      setIsSuccess(true)

      // Redireciona para o login após um breve intervalo
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Ocorreu um erro ao atualizar a senha.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 8. Senha alterada com sucesso
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl font-mono">PI</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-8">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>

                <h1 className="text-2xl font-bold text-foreground">Senha alterada!</h1>

                <p className="text-muted-foreground">
                  Sua senha foi alterada com sucesso. Redirecionando para o login...
                </p>

                <div className="mt-4 w-full">
                  <Button asChild className="w-full">
                    <Link href="/auth/login">Ir para Login</Link>
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
          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl font-mono">PI</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground">Nova senha</h1>
              <p className="text-sm text-muted-foreground">Digite sua nova senha abaixo</p>
            </div>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-border bg-card p-6">
            {status === 'verifying' && (
              <div className="flex flex-col items-center gap-3 py-6 text-center">
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                <p className="text-sm text-muted-foreground">Verificando link de recuperação...</p>
              </div>
            )}

            {status === 'invalid' && (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="h-16 w-16 rounded-full bg-destructive/15 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground text-balance">
                  {error ?? 'Não foi possível validar o link de recuperação.'}
                </p>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/auth/recuperar-senha">Solicitar novo link</Link>
                </Button>
              </div>
            )}

            {status === 'ready' && (
              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Nova Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirmar Nova Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repita a nova senha"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
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
                      Salvando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Salvar nova senha
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
