import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../firebase'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')

  const getStrength = (pwd) => {
    if (pwd.length === 0) return { label: '', bars: 0 }
    if (pwd.length < 6) return { label: 'Weak', bars: 1 }
    if (pwd.length < 10) return { label: 'Medium', bars: 2 }
    return { label: 'Strong', bars: 3 }
  }

  const strength = getStrength(newPassword)

  const barColor = (index) => {
    if (index >= strength.bars) return '#E2E8F0'
    if (strength.bars === 1) return '#EF4444'
    if (strength.bars === 2) return '#F59E0B'
    return '#10B981'
  }

  const handleSendReset = async () => {
    setError('')
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setStep(2)
    } catch (err) {
      console.error(err)
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    }
  }

  const leftContent = [
    { icon: '🔐', tag: "We'll get you back on track" },
    { icon: '📧', tag: 'Check your inbox' },
    { icon: '🔑', tag: 'Almost there!' },
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

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div style={{
            background: '#1D4ED8', borderRadius: '12px', width: '100%',
            maxWidth: '300px', height: '180px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '56px'
          }}>
            {leftContent[step - 1].icon}
          </div>
          <div style={{ fontSize: '17px', color: '#fff', textAlign: 'center' }}>
            {leftContent[step - 1].tag}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {[1, 2, 3].map((s) => (
              <span key={s} style={{
                width: s === step ? '20px' : '6px',
                height: '6px',
                borderRadius: s === step ? '3px' : '50%',
                background: s === step ? '#fff' : '#93C5FD',
                opacity: s === step ? 1 : 0.5,
                transition: 'all 0.3s'
              }}></span>
            ))}
          </div>
        </div>

        <div style={{ height: '20px' }}></div>
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, background: '#fff', padding: '48px 52px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>

        {/* Back Row */}
        <div
          onClick={() => step === 1 ? navigate('/login') : setStep(step - 1)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '28px', cursor: 'pointer' }}
        >
          <span style={{ fontSize: '18px', color: '#2563EB' }}>←</span>
          <span style={{ fontSize: '13px', color: '#2563EB' }}>Back to login</span>
        </div>

        {/* Step 1 — Enter Email */}
        {step === 1 && (
          <>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', background: '#DBEAFE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '32px'
            }}>🔒</div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', textAlign: 'center' }}>
              Forgot your password?
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', marginBottom: '24px', lineHeight: 1.6 }}>
              Enter your email and we'll send you a reset link
            </p>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748B', marginBottom: '6px' }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
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
            {error && (
              <div style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <button
              onClick={handleSendReset}
              style={{
                width: '100%', height: '52px', background: '#2563EB', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '16px',
                fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                marginBottom: '16px'
              }}
            >
              Send reset link
            </button>
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
              Remember your password?{' '}
              <span onClick={() => navigate('/login')} style={{ color: '#2563EB', fontWeight: 500, cursor: 'pointer' }}>
                Log in
              </span>
            </div>
          </>
        )}

        {/* Step 2 — Email Sent */}
        {step === 2 && (
          <>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', background: '#DCFCE7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '36px', color: '#10B981'
            }}>✓</div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', textAlign: 'center' }}>
              Check your email
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', marginBottom: '24px', lineHeight: 1.6 }}>
              We sent a reset link to<br />
              <strong style={{ color: '#1E293B' }}>{email}</strong>
            </p>
            <div
              onClick={handleSendReset}
              style={{ textAlign: 'center', fontSize: '13px', color: '#2563EB', marginBottom: '16px', cursor: 'pointer' }}
            >
              Resend email
            </div>
            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', height: '52px', background: '#fff', color: '#2563EB',
                border: '1.5px solid #2563EB', borderRadius: '10px', fontSize: '16px',
                fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                marginBottom: '16px'
              }}
            >
              Back to login
            </button>
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
              Didn't get it? Check your spam folder.
            </div>
          </>
        )}

        {/* Step 3 — UI only (Firebase handles actual reset via email link) */}
        {step === 3 && (
          <>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', background: '#DBEAFE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', fontSize: '32px'
            }}>🔑</div>
            <h2 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '24px', fontWeight: 700, color: '#1E293B', marginBottom: '6px', textAlign: 'center' }}>
              Set new password
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', marginBottom: '24px', lineHeight: 1.6 }}>
              Your new password must be different from your previous password
            </p>

            <div style={{ marginBottom: '6px', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748B', marginBottom: '6px' }}>
                New password
              </label>
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                style={{
                  width: '100%', height: '46px', border: '1px solid #E2E8F0',
                  borderRadius: '8px', padding: '0 40px 0 14px', fontSize: '14px',
                  color: '#1E293B', outline: 'none', fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
              <button onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '12px', bottom: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '16px', padding: 0 }}>
                {showNew ? '🙈' : '👁'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: barColor(i) }}></div>
              ))}
            </div>
            {strength.label && (
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '12px' }}>
                Password strength: {strength.label}
              </div>
            )}

            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748B', marginBottom: '6px' }}>
                Confirm new password
              </label>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#2563EB'}
                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                style={{
                  width: '100%', height: '46px', border: '1px solid #E2E8F0',
                  borderRadius: '8px', padding: '0 40px 0 14px', fontSize: '14px',
                  color: '#1E293B', outline: 'none', fontFamily: 'Inter, sans-serif',
                  boxSizing: 'border-box'
                }}
              />
              <button onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '12px', bottom: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '16px', padding: 0 }}>
                {showConfirm ? '🙈' : '👁'}
              </button>
            </div>

            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', height: '52px', background: '#2563EB', color: '#fff',
                border: 'none', borderRadius: '10px', fontSize: '16px',
                fontWeight: 500, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                marginBottom: '16px'
              }}
            >
              Reset password
            </button>
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#64748B' }}>
              Remember your password?{' '}
              <span onClick={() => navigate('/login')} style={{ color: '#2563EB', fontWeight: 500, cursor: 'pointer' }}>
                Log in
              </span>
            </div>
          </>
        )}

      </div>
    </div>
  )
}