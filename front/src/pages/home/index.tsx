import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { SocialButtons } from '../../components/SocialButtons'
import './home.css'

export function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { signIn } = useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn({ email, password })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main className="auth-container">
      <div className="auth-hero-logo">
        <span className="hero-logo-badge">S</span>
        <span className="hero-logo-text">STYLE</span>
      </div>
      <p className="auth-subtitle">Welcome back to your account</p>

      <div className="auth-card">
        <h2>Sign In</h2>
        <p className="card-subtitle">Enter your credentials to access your account</p>

        <SocialButtons />

        <div className="divider">
          <span>OR CONTINUE WITH EMAIL</span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label htmlFor="password">Password</label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle Password Visibility"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            Sign In
          </button>
        </form>

        <p className="signup-prompt">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </div>

      <footer className="auth-footer">
        By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
      </footer>
    </main>
  )
}