// router.tsx
import { createBrowserRouter, type LoaderFunctionArgs } from "react-router-dom";
import App from "./App";
import Countries from "./components/countries";
import CountryPage from "./components/countryPage";
import type { Country, CountryDetail, BorderCountry } from "./types";

// Loader för alla länder
export async function countriesLoader(): Promise<Country[]> {
  const res = await fetch(
    "https://restcountries.com/v3.1/all?fields=cca3,name,flags,population,region,capital"
  );
  if (!res.ok) throw new Error("Failed to fetch countries");
  const data: Country[] = await res.json();
  return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
}

// Loader för enskild country + border countries
export async function countryLoader({ params }: LoaderFunctionArgs) {
  const code = params.code; // string | undefined
  if (!code) throw new Error("Country code missing");

  const res = await fetch(
    `https://restcountries.com/v3.1/alpha/${encodeURIComponent(code)}?fields=cca3,name,nativeName,flags,population,region,subregion,capital,languages,currencies,maps,borders,tld`
  );
  if (!res.ok) throw new Error("Failed to fetch country");

  const jsonData = await res.json();
  const country: CountryDetail = Array.isArray(jsonData) ? jsonData[0] : jsonData;

  // Hämta border countries
  let borderCountries: BorderCountry[] = [];
  const borders: string[] = country.borders ?? [];
  if (borders.length > 0) {
    const borderRes = await fetch(
      `https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}&fields=cca3,name`
    );
    if (borderRes.ok) {
      const borderData = await borderRes.json();
      borderCountries = borderData.map((c: any) => ({
        cca3: c.cca3,
        name: c.name.common,
      }));
    }
  }

  return { country, borderCountries };
}

export const router = createBrowserRouter(
  [
    {
      path: "*", // Parent path with '*' so child routes work correctly
      element: <App />,
      children: [
        { index: true, element: <Countries />, loader: countriesLoader },
        { path: "country/:code", element: <CountryPage />, loader: countryLoader },
        { path: "*", element: <Countries />, loader: countriesLoader },
      ],
    },
  ],
  {
    basename: "/rest-countries-api-with-color-theme-switcher", // <-- GitHub Pages base path
  }
);
