import { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext'
import './Header.css'

export function Header() {
  const { user } = useContext(AuthContext)
  const [showLoginWarning, setShowLoginWarning] = useState(false)
  const warningTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleAuthRequiredClick = (e: React.MouseEvent) => {
    if (user) return

    e.preventDefault()
    setShowLoginWarning(true)

    if (warningTimeout.current) clearTimeout(warningTimeout.current)
    warningTimeout.current = setTimeout(() => setShowLoginWarning(false), 3000)
  }

  return (
    <header className="header">
      <div className="header-left">
        <button className="icon-btn mobile-menu-btn" aria-label="Menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/" className="brand-logo">
          <span className="logo-badge">S</span>
          <span className="logo-text">STYLE</span>
        </Link>

        <nav className="desktop-nav">
          <a href="#">New In</a>
          <a href="#">Women</a>
          <a href="#">Men</a>
          <a href="#">Sale</a>
        </nav>
      </div>

      <div className="search-container desktop-search">
        <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="Search for products..." />
      </div>

      <div className="header-actions">
        <button className="icon-btn mobile-search-btn" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        <Link to="/wishlist" className="icon-btn" aria-label="Favorites" onClick={handleAuthRequiredClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </Link>

        <Link to={user ? '/perfil' : '/login'} className="icon-btn" aria-label="Account">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </Link>

        <button className="icon-btn cart-btn" aria-label="Cart" onClick={handleAuthRequiredClick}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          <span className="cart-badge">2</span>
        </button>
      </div>

      {showLoginWarning && (
        <div className="login-warning-toast" role="alert">
          Usuário não logado
        </div>
      )}
    </header>
  )
}