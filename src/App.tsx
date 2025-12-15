import { useEffect, useState } from 'react'
import { FaRegMoon, FaMoon } from 'react-icons/fa'
import './App.css'

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
    <div className="min-h-screen bg-[var(--Grey-50-Light-Mode-Background)] dark:bg-[var(--Blue-950-Dark-Mode-Background)] transition-colors">
      <header className="w-full drop-shadow-md transition-colors bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)]">
        <div className="mx-auto max-w-[1440px] px-6 h-16 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]">
            Where in the world!
          </h2>

          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)] transition"
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
    </div>
  )
}

export default App

