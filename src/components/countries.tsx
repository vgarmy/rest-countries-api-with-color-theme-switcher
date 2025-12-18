
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from 'react'
import { Link } from "react-router-dom";
import { FiSearch, FiChevronDown } from "react-icons/fi";

interface Country {
  cca3: string;
  name: { common: string };
  flags?: { png?: string; svg?: string; alt?: string };
  population: number;
  region: string;
  capital?: string[];
}

// Accent-insensitive, case-insensitive normalizer
function normalize(input: string | undefined): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .normalize("NFD") // split accents
    .replace(/[\u0300-\u036f]/g, ""); // remove accents
}

function Countries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search (debounced)
  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");

  // Region filter
  const [region, setRegion] = useState<string>("all");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const url =
          "https://restcountries.com/v3.1/all?fields=cca3,name,flags,population,region,capital";

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status}: ${text}`);
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error("Unexpected payload: not an array");
        }

        const sorted = data
          .filter((c: Country) => c?.name?.common)
          .sort((a: Country, b: Country) =>
            a.name.common.localeCompare(b.name.common)
          );

        setCountries(sorted);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("[Countries] fetch failed:", message);
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  // Debounce the raw input into query
  useEffect(() => {
    const t = setTimeout(() => setQuery(rawQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [rawQuery]);

  // Regions list (derived from data)
  const regions = useMemo(() => {
    const unique = Array.from(
      new Set(
        countries
          .map((c) => c.region)
          .filter((r): r is string => typeof r === "string" && r.length > 0)
      )
    ).sort();
    return unique;
  }, [countries]);

  // Filtered countries
  const filteredCountries = useMemo(() => {
    const q = normalize(query);

    return countries.filter((c) => {
      // Region filter
      if (region !== "all" && c.region !== region) return false;

      // Search filter
      if (!q) return true;
      const name = normalize(c.name.common);

      // Extendable: also match capital or cca3 if you want:
      // const capital = normalize(c.capital?.[0]);
      // const code = normalize(c.cca3);

      return name.includes(q);
    });
  }, [countries, query, region]);

  // Handlers
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRawQuery(e.target.value);

  const onRegionChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setRegion(e.target.value);

  // UI states
  if (loading) return <span></span>;
  if (error)
    return (
      <div className="p-6 text-red-600">
        Failed to load countries: {error}
      </div>
    );
  if (!countries.length) return <span></span>;

  return (
    <>
      {/* Controls */}
      <div className="mt-10 mb-20 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <label className="w-full max-w-[480px] relative block" >
          <span className="sr-only">Search for country</span>
          <FiSearch
            className="pointer-events-none absolute left-5 inset-y-0 my-auto h-5 w-5 text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search for country..."
            value={rawQuery}
            onChange={onSearchChange}
            className="w-full pl-12 pr-4 py-5 rounded shadow-lg bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)] focus:outline-none placeholder-[var(--Grey-950-Light-Mode-Text)] dark:placeholder-[var(--Dark-Mode-Text)]"
            aria-label="Search for country"
          />
        </label>

        {/* Region filter */}
        <div className="w-full sm:w-auto relative">
          <FiChevronDown
            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--Grey-950-Light-Mode-Text)] dark:text[var(--Dark-Mode-Text)] mr-4"
            aria-hidden="true"
          />

          <select
            value={region} // region måste vara "" initialt för placeholdern ska visas
            onChange={onRegionChange}
            className="w-56 pl-5 py-5 rounded shadow-lg text-[var(--Grey-950-Light-Mode-Text)] dark:text[var(--Dark-Mode-Text)] appearance-none bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)] focus:outline-none"
            aria-label="Filter by region"
          >
            {/* Placeholder som visas först */}
            <option value="all">
              Filter by Region
            </option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Grid */}
{/* Grid */}
<div>
  {filteredCountries.length === 0 ? (
    <div className="text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]">
      No countries found
      {region !== "all" ? ` in ${region}` : ""} for “{query}”.
    </div>
  ) : (
    <div
      className="grid gap-x-10 gap-y-[70px] 
                 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                 text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]"
    >
      {filteredCountries.map((country) => (
        <Link
          key={country.cca3}
          to={`/country/${country.cca3}`}
          className="block"
        >
          <div className="rounded-lg overflow-hidden shadow-lg hover:scale-105 transition w-full bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)]">
            <img
              src={country.flags?.png || country.flags?.svg || ""}
              alt={country.flags?.alt || `${country.name.common} flag`}
              className="w-full h-[250px] md:h-[200px] object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="px-6 pt-6 pb-10">
              <h3 className="text-lg mb-3">{country.name.common}</h3>
              <p className="text-sm mb-1">
                <b>Population:</b>{" "}
                {Number.isFinite(country.population)
                  ? country.population.toLocaleString()
                  : "N/A"}
              </p>
              <p className="text-sm mb-1">
                <b>Region:</b> {country.region || "N/A"}
              </p>
              {Array.isArray(country.capital) && country.capital.length > 0 && (
                <p className="text-sm">
                  <b>Capital:</b> {country.capital[0]}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )}
</div>

    </>
  );
}

export default Countries
