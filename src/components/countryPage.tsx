import { useLoaderData, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiMapPin } from "react-icons/fi";
import { FaMap } from "react-icons/fa";
import type { CountryDetail, BorderCountry } from '../types'

interface LoaderData {
  country: CountryDetail
  borderCountries: BorderCountry[]
}

function CountryPage() {
  const { country, borderCountries } = useLoaderData() as LoaderData
  const navigate = useNavigate()

  if (!country) return <span>Country not found</span>

  const currencyList = country.currencies
    ? Object.values(country.currencies).map(c => c.symbol ? `${c.name} (${c.symbol})` : c.name).join(', ')
    : 'N/A'

  const languageList = country.languages
    ? Object.values(country.languages).join(', ')
    : 'N/A'

  return (
    <div>
      <button onClick={() => navigate(-1)} className="rounded shadow-lg px-12 py-3 mt-10 mb-20 flex items-center gap-2 cursor-pointer bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)] text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]">
        <FiArrowLeft /> Back
      </button>

      <div className='flex flex-col md:flex-row md:space-between items-center text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]'>
        <div className='h-full md:h-[400px] w-full md:w-[560px] shadow-lg'>
            <img
               src={country.flags?.png || country.flags?.svg || ""}
              alt={country.flags?.alt || `${country.name.common} flag`}
              className="w-full h-full object-cover rounded"
            />
        </div>

        <div className='py-10 md:px-30 w-100 md:w-[880px]'>
          <h1 className="text-4xl font-black mb-8">{country.name.common}</h1>
          <div className='flex flex-col md:flex-row gap-10 md:gap-30'>
            <div className='flex flex-col gap-2'>
              {country.name.nativeName && (
                <p><b>Native Name:</b> {Object.values(country.name.nativeName)[0]?.common || 'N/A'}</p>
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
                {country.maps?.googleMaps && <a href={country.maps.googleMaps} target="_blank" rel="noreferrer"><FiMapPin /></a>}
                {country.maps?.openStreetMaps && <a href={country.maps.openStreetMaps} target="_blank" rel="noreferrer"><FaMap /></a>}
              </div>
            </div>
          </div>

          <div className="mt-10">
            {borderCountries.length > 0 ? (
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h2 className="font-medium whitespace-nowrap text-start mb-3 md:mb-0"><b>Border Countries:</b></h2>
                <div className="flex flex-wrap justify-start gap-3">
                  {borderCountries.map(border => (
                    <button key={border.cca3} onClick={() => navigate(`/country/${border.cca3}`)} className="px-4 py-1 bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)] rounded shadow-lg cursor-pointer">
                      {border.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : <p>No border countries</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountryPage