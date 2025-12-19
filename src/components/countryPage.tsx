import { useLoaderData, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import type { CountryDetail, BorderCountry } from '../types';

function CountryPage() {
  const { country, borderCountries } = useLoaderData() as {
    country: CountryDetail;
    borderCountries: BorderCountry[];
  };
  const navigate = useNavigate();

  const currencyList = country.currencies
    ? Object.values(country.currencies).map(c => c.symbol ? `${c.name} (${c.symbol})` : c.name).join(', ')
    : 'N/A';
  const languageList = country.languages ? Object.values(country.languages).join(', ') : 'N/A';

  return (
    <div>
      <button onClick={() => navigate(-1)} className="rounded shadow-lg px-12 py-3 mt-5 mb-5 flex items-center gap-2">
        <FiArrowLeft /> Back
      </button>

      <div className="flex flex-col md:flex-row items-center text-gray-800">
        <div className="h-[400px] w-full md:w-[560px] shadow-lg">
          {country.flags?.svg || country.flags?.png ? (
            <img
              src={country.flags.svg || country.flags.png}
              alt={country.flags.alt || `${country.name.common} flag`}
              className="w-full h-full object-cover rounded"
            />
          ) : null}
        </div>

        <div className="py-10 md:px-10 w-full md:w-[880px]">
          <h1 className="text-4xl font-black mb-8">{country.name.common}</h1>

          <div className="flex flex-col md:flex-row gap-10">
            <div className="flex flex-col gap-2">
              {country.name.nativeName && (
                <p><b>Native Name:</b> {Object.values(country.name.nativeName)[0]?.common || 'N/A'}</p>
              )}
              <p><b>Region:</b> {country.region}</p>
              <p><b>Population:</b> {country.population.toLocaleString()}</p>
              <p><b>Subregion:</b> {country.subregion || 'N/A'}</p>
              <p><b>Capital:</b> {country.capital?.[0] || 'N/A'}</p>
            </div>

            <div className="flex flex-col gap-2">
              <p><b>Top Level Domain:</b> {country.tld?.join(', ') || 'N/A'}</p>
              <p><b>Languages:</b> {languageList}</p>
              <p><b>Currencies:</b> {currencyList}</p>
            </div>
          </div>

          <div className="mt-10">
            {borderCountries.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {borderCountries.map(b => (
                  <button
                    key={b.cca3}
                    onClick={() => navigate(`/country/${b.cca3}`)}
                    className="px-4 py-1 bg-white rounded shadow-lg"
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            ) : <p>No border countries</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountryPage;
