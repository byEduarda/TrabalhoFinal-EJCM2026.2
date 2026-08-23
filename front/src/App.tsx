import { AuthProvider } from './contexts/AuthContext'
import { TopBanner } from './components/TopBanner'
import { Header } from './components/Header'
import { Home } from './pages/home'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="page-container">
        <TopBanner />
        <Header />
        <Home />
      </div>
    </AuthProvider>
  )
}

export default App