
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { FaRegMoon, FaMoon } from 'react-icons/fa'
import './App.css'
import Countries from './components/countries'
import CountryPage from './components/countryPage'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div>
      <header className="w-full bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)] drop-shadow-md">
        <div className="flex justify-between items-center px-10 md:px-0 h-20" style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <h2 className="text-2xl font-extrabold text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]">
            Where in the world!
          </h2>
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)] cursor-pointer"
          >
            {darkMode ? (
              <>
                <FaMoon /> Dark Mode
              </>
            ) : (
              <>
                <FaRegMoon /> Dark Mode
              </>
            )}
          </button>
        </div>
      </header>


    <div className="min-h-screen bg-[var(--Grey-50-Light-Mode-Background)] dark:bg-[var(--Blue-950-Dark-Mode-Background)] transition-colors flex flex-col">
      {/* Header tar hela bredden */}


      {/* Main centrerat med flex */}
      <main className="flex justify-center w-full px-10 py-6">
        <div className="w-full" style={{ maxWidth: '1440px' }}>
          <Routes>
            <Route path="/" element={<Countries />} />
            <Route path="/country/:code" element={<CountryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
</div>
  )
}

export default App