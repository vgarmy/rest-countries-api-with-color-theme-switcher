
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

interface CountryDetail {
  cca3: string
  name: { common: string; official?: string }
  flags?: { png?: string; svg?: string; alt?: string }
  population: number
  region: string
  subregion?: string
  capital?: string[]
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol?: string }>
  maps?: { googleMaps?: string; openStreetMaps?: string }
}

function CountryPage() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const [country, setCountry] = useState<CountryDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) return
    const controller = new AbortController()

    async function load() {
      try {
        setLoading(true)
        setError(null)

        const url = `https://restcountries.com/v3.1/alpha/${encodeURIComponent(
          code
        )}?fields=cca3,name,flags,population,region,subregion,capital,languages,currencies,maps`

        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(`HTTP ${res.status}: ${text}`)
        }

        const data = await res.json()
        const item = Array.isArray(data) ? data[0] : data
        if (!item) throw new Error('Country not found')

        setCountry(item as CountryDetail)
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error('[CountryPage] fetch failed:', message)
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [code])

  if (loading) return <div className="p-6">Loading country...</div>

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Failed to load country: {error}{' '}
        <button onClick={() => navigate(-1)} className="ml-2 underline text-blue-700">
          Go back
        </button>
      </div>
    )
  }

  if (!country) {
    return (
      <div className="p-6">

      </div>
    )
  }

  const currencyList = country.currencies
    ? Object.values(country.currencies)
        .map((c) => (c.symbol ? `${c.name} (${c.symbol})` : c.name))
        .join(', ')
    : 'N/A'

  const languageList = country.languages
    ? Object.values(country.languages).join(', ')
    : 'N/A'

  return (
  <div>


    {/* Inner card stays narrow */}
    <div className="max-w-4xl mx-auto border rounded-lg overflow-hidden shadow-lg m-10">
      {country.flags?.svg || country.flags?.png ? (
        <img
          src={country.flags?.svg || country.flags?.png!}
          alt={country.flags?.alt || `${country.name.common} flag`}
          className="w-full h-56 object-cover"
        />
      ) : null}
        <h1 className="text-2xl font-semibold">{country.name.common}</h1>
        {country.name.official && (
          <p className="text-gray-600">Official: {country.name.official}</p>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><span className="font-medium">Region:</span> {country.region || 'N/A'}</p>
          <p><span className="font-medium">Subregion:</span> {country.subregion || 'N/A'}</p>
          <p><span className="font-medium">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
          <p><span className="font-medium">Population:</span> {country.population.toLocaleString()}</p>
          <p><span className="font-medium">Languages:</span> {languageList}</p>
          <p><span className="font-medium">Currencies:</span> {currencyList}</p>
        </div>

        <div className="mt-6 flex gap-4">
          {country.maps?.googleMaps && (
            <a href={country.maps.googleMaps} target="_blank" rel="noreferrer" className="underline text-blue-700">
              View on Google Maps
            </a>
          )}
          {country.maps?.openStreetMaps && (
            <a href={country.maps.openStreetMaps} target="_blank" rel="noreferrer" className="underline text-blue-700">
              View on OpenStreetMap
            </a>
          )}
      </div>
    </div>
    <button onClick={() => navigate(-1)} className="mb-4 underline text-blue-700">
      ← Back
    </button>
  </div>

  )
}

export default CountryPage 
