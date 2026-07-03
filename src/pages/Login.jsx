import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password.')
      console.error(err)
    }
  }

  const cards = [
    { icon: '🚆', label: 'Trains' },
    { icon: '🏨', label: 'Hotels' },
    { icon: '🗺️', label: 'Places' },
    { icon: '🤖', label: 'AI Planner' },
  ]

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', display: 'flex', minHeight: '100vh' }}>

      {/* Left Panel */}
      <div style={{
        flex: '0 0 58%', background: '#2563EB', padding: '36px 40px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '22px', color: '#fff' }}>
          Yatra<span style={{ color: '#93C5FD' }}>One</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '12px', width: '100%', maxWidth: '340px'
          }}>
            {cards.map((c) => (
              <div key={c.label} style={{
                background: '#1D4ED8', borderRadius: '12px',
                padding: '16px 12px', display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: '8px'
              }}>
                <div style={{
                  width: '100%', height: '70px', background: '#1E40AF',
                  borderRadius: '8px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '28px'
                }}>
                  {c.icon}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>
                  {c.label}
                </div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '17px', color: '#fff', textAlign: 'center', fontWeight: 400 }}>
            Your journey starts here
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <span style={{ width: '20px', height: '6px', borderRadius: '3px', background: '#fff' }}></span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#93C5FD', opacity: 0.5 }}></span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#93C5FD', opacity: 0.5 }}></span>
          </div>
        </div>

        <div style={{ height: '20px' }}></div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, background: '#fff', padding: '48px 52px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>
        <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '26px', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
          Welcome back
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '28px' }}>
          Login to continue your journey
        </p>

        {/* Google Button */}
        <button style={{
          width: '100%', height: '46px', background: '#fff',
          border: '1px solid #E2E8F0', borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '10px', cursor: 'pointer', fontSize: '14px',
          fontWeight: 500, color: '#1E293B', marginBottom: '20px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '0.5px', background: '#E2E8F0' }}></div>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>or</span>
          <div style={{ flex: 1, height: '0.5px', background: '#E2E8F0' }}></div>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748B', marginBottom: '6px' }}>
            Email address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            style={{
              width: '100%', height: '46px', border: '1px solid #E2E8F0',
              borderRadius: '8px', padding: '0 14px', fontSize: '14px',
              color: '#1E293B', outline: 'none', fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '8px', position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748B', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#2563EB'}
            onBlur={e => e.target.style.borderColor = '#E2E8F0'}
            style={{
              width: '100%', height: '46px', border: '1px solid #E2E8F0',
              borderRadius: '8px', padding: '0 40px 0 14px', fontSize: '14px',
              color: '#1E293B', outline: 'none', fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box'
            }}
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute', right: '12px', bottom: '12px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#94A3B8', fontSize: '18px', padding: 0
            }}
          >
            {showPassword ? '🙈' : '👁'}
          </button>
        </div>

        {/* Forgot Password */}
        <div style={{ textAlign: 'right', marginBottom: '20px' }}>
          <span
            onClick={() => navigate('/forgot-password')}
            style={{ fontSize: '13px', color: '#2563EB', cursor: 'pointer' }}
          >
            Forgot password?
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '10px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%', height: '46px', background: '#2563EB',
            color: '#fff', border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: 500, cursor: 'pointer',
            fontFamily: 'Inter, sans-serif', marginBottom: '20px'
          }}
        >
          Log in
        </button>

        {/* Sign Up Link */}
        <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            style={{ color: '#2563EB', fontWeight: 500, cursor: 'pointer' }}
          >
            Sign up
          </span>
        </div>

      </div>
    </div>
  )
}