import { useState } from 'react'
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { signInEmailPassword, isLoading: signingIn, error: signInError } = useSignInEmailPassword()
  const { signUpEmailPassword, isLoading: signingUp, error: signUpError } = useSignUpEmailPassword()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'signin') {
      const res = await signInEmailPassword(email, password)
      if (!res.isError) navigate(from, { replace: true })
    } else {
      const res = await signUpEmailPassword(email, password)
      if (!res.isError) {
        // After sign up, auto sign-in generally happens; navigate to home
        navigate(from, { replace: true })
      }
    }
  }

  const isBusy = signingIn || signingUp
  const error = signInError || signUpError

  return (
    <div style={{ maxWidth: 360, margin: '64px auto', padding: 16 }}>
      <h2 style={{ textAlign: 'center' }}>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          <div>Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{ width: '100%', padding: 8 }}
          />
        </label>
        <label>
          <div>Password</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{ width: '100%', padding: 8 }}
          />
        </label>
        {error && (
          <div style={{ color: 'crimson', fontSize: 14 }}>{error.message}</div>
        )}
        <button type="submit" disabled={isBusy} style={{ padding: '10px 12px' }}>
          {isBusy ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create account'}
        </button>
      </form>
      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <button
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          style={{ border: 'none', background: 'none', color: '#0b5', cursor: 'pointer' }}
        >
          {mode === 'signin' ? "Don't have an account? Sign Up" : 'Have an account? Sign In'}
        </button>
      </div>
    </div>
  )
}