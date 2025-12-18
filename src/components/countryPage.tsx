import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import { FaMap } from "react-icons/fa";


interface CountryDetail {
  cca3: string
  name: {
    common: string;
    official?: string;
    nativeName?: Record<string, { official: string; common: string }>
  }
  flags?: { png?: string; svg?: string; alt?: string }
  population: number
  region: string
  subregion?: string
  capital?: string[]
  languages?: Record<string, string>
  currencies?: Record<string, { name: string; symbol?: string }>
  maps?: { googleMaps?: string; openStreetMaps?: string }
  borders?: string[]
  tld?: string[]
}

interface BorderCountry {
  cca3: string
  name: string
}

function CountryPage() {
  const { code = '' } = useParams()
  const navigate = useNavigate()
  const [country, setCountry] = useState<CountryDetail | null>(null)
  const [borderCountries, setBorderCountries] = useState<BorderCountry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [code])

  // Fetch country details
  useEffect(() => {
    if (!code) return
    const controller = new AbortController()

    async function loadCountry() {
      try {
        setLoading(true)
        setError(null)

        const url = `https://restcountries.com/v3.1/alpha/${encodeURIComponent(
          code
        )}?fields=cca3,name,nativeName,flags,population,region,subregion,capital,languages,currencies,maps,borders,tld`

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

    loadCountry()
    return () => controller.abort()
  }, [code])

  // Normalize borders to empty array to satisfy TypeScript
  const borderCodes = country?.borders ?? []

  // Fetch border countries once country is loaded
  useEffect(() => {
    if (!borderCodes.length) {
      setBorderCountries([])
      return
    }

    async function loadBorders() {
      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}&fields=cca3,name`
        )
        const data = await res.json()
        const borders = data.map((c: any) => ({
          cca3: c.cca3,
          name: c.name.common
        }))
        setBorderCountries(borders)
      } catch (err) {
        console.error('Failed to fetch border countries:', err)
        setBorderCountries([])
      }
    }

    loadBorders()
  }, [borderCodes])

  if (loading) return <span></span>

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

  if (!country) return <span></span>

  // At this point, TypeScript knows country is not null
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
      <button onClick={() => navigate(-1)} className="rounded shadow-lg px-12 py-3 mt-15 mb-15 flex flex-row items-center justify-center gap-2 cursor-pointer bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)] text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]">
        <FiArrowLeft /> Back
      </button>

      <div className='flex flex-col md:flex-row md:space-between items-center text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]'>
        <div className='h-full md:h-[400px] w-full md:w-[560px] shadow-lg'>
          {country.flags?.svg || country.flags?.png ? (
            <img
              src={country.flags?.svg || country.flags?.png!}
              alt={country.flags?.alt || `${country.name.common} flag`}
              className="w-full h-full object-cover rounded"
            />
          ) : null}
        </div>

        <div className='py-10 md:px-30 w-100 md:w-[880px]'>
          <h1 className="text-4xl font-black mb-8">{country.name.common}</h1>
          <div className='flex flex-col md:flex-row gap-10 md:gap-30'>
            <div className='flex flex-col gap-2'>
              {country.name.nativeName && (
                <p>
                  <b>Native Name:</b> {Object.values(country.name.nativeName)[0]?.common || 'N/A'}
                </p>
              )}
              <p><b>Region:</b> {country.region || 'N/A'}</p>
              <p><b>Population:</b> {country.population.toLocaleString()}</p>
              <p><b>Subregion:</b> {country.subregion || 'N/A'}</p>
              <p><b>Capital:</b> {country.capital?.[0] || 'N/A'}</p>
            </div>

            <div className='flex flex-col gap-2'>
              <p><b>Top Level Domain:</b> {country.tld?.join(', ') || 'N/A'}</p>
              <p><b>Languages:</b> {languageList}</p>
              <p><b>Currencies:</b> {currencyList}</p>
              <div className="mt-6 flex gap-4 text-2xl">
                {country.maps?.googleMaps && (
                  <a href={country.maps.googleMaps} target="_blank" rel="noreferrer">
                    <FiMapPin />
                  </a>
                )}
                {country.maps?.openStreetMaps && (
                  <a href={country.maps.openStreetMaps} target="_blank" rel="noreferrer">
                    <FaMap />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10">
            {borderCountries.length > 0 ? (
              <div className="mt-10 flex flex-col md:flex-row md:items-center gap-2">
                <h2 className="font-medium whitespace-nowrap text-start mb-3 md:mb-0"><b>Border Countries:</b></h2>
                <div className="flex flex-wrap justify-start gap-3">
                  {borderCountries.map((border) => (
                    <button
                      key={border.cca3}
                      onClick={() => navigate(`/country/${border.cca3}`)}
                      className="px-4 py-1 bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)] rounded shadow-lg cursor-pointer"
                    >
                      {border.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-start">No border countries</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountryPage
