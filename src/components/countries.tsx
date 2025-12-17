
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface Country {
  cca3: string
  name: { common: string }
  flags?: { png?: string; svg?: string; alt?: string }
  population: number
  region: string
  capital?: string[]
}

function Countries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const url =
          'https://restcountries.com/v3.1/all?fields=cca3,name,flags,population,region,capital'

        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }

        const data = await res.json()
        if (!Array.isArray(data)) {
          throw new Error('Unexpected payload: not an array')
        }

        const sorted = data
          .filter((c: Country) => c?.name?.common)
          .sort((a, b) => a.name.common.localeCompare(b.name.common))

        setCountries(sorted)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('[Countries] fetch failed:', message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [])

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-600">Failed to load countries: {error}</div>
  if (!countries.length) return <div className="p-6"></div>

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {countries.map((country) => (
        <Link key={country.cca3} to={`/country/${country.cca3}`} className="block">
          <div className="border rounded-lg overflow-hidden shadow-lg hover:scale-105 transition">
            <img
              src={country.flags?.png || country.flags?.svg || ''}
              alt={country.flags?.alt || `${country.name.common} flag`}
              className="w-full h-40 object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{country.name.common}</h3>
              <p className="text-sm">
                Population:{' '}
                {Number.isFinite(country.population)
                  ? country.population.toLocaleString()
                  : 'N/A'}
              </p>
              <p className="text-sm">Region: {country.region || 'N/A'}</p>
              {Array.isArray(country.capital) && country.capital.length > 0 && (
                <p className="text-sm">Capital: {country.capital[0]}</p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
   )
}



export default Countries
