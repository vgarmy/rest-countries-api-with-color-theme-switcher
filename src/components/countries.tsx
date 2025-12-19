import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import type { Country } from "../types";

// Accent-insensitive, case-insensitive normalizer
function normalize(input: string | undefined): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function Countries() {
  const loaderData = useLoaderData() as Country[] | undefined;
  const countries = loaderData || [];

  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setQuery(rawQuery.trim()), 250);
    return () => clearTimeout(t);
  }, [rawQuery]);

  const regions = useMemo(() => {
    if (!countries || countries.length === 0) return [];
    const unique = Array.from(
      new Set(countries.map((c) => c.region).filter((r): r is string => !!r))
    );
    return unique.sort();
  }, [countries]);

  const filteredCountries = useMemo(() => {
    if (!countries) return [];
    const q = normalize(query);
    return countries.filter((c) => {
      if (region !== "all" && c.region !== region) return false;
      if (!q) return true;
      return normalize(c.name.common).includes(q);
    });
  }, [countries, query, region]);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) =>
    setRawQuery(e.target.value);

  const handleRegionSelect = (value: string) => {
    setRegion(value);
    setDropdownOpen(false);
  };

  if (!countries) return <span>Loading countries...</span>;
  if (countries.length === 0) return <span>No countries available.</span>;

  return (
    <>
      {/* Controls */}
      <div className="mt-10 mb-20 flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <label className="w-full max-w-[480px] relative block">
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

        {/* Custom Region dropdown */}
        <div className="w-full sm:w-auto relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-56 flex justify-between items-center px-4 py-5 rounded shadow-lg text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)] bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)] focus:outline-none"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            {region === "all" ? "Filter by Region" : region}
            <FiChevronDown className="h-5 w-5 pointer-events-none" />
          </button>

          {dropdownOpen && (
            <ul
              className="absolute mt-1 pb-3 w-56 bg-[var(--Light-Mode-Elements)] dark:bg-[var(--Blue-900-Dark-Mode-Elements)] rounded shadow-lg z-50 text-[var(--Grey-950-Light-Mode-Text)] dark:text-[var(--Dark-Mode-Text)]"
              role="listbox"
            >
              <li
                className={`cursor-pointer px-4 py-2 ${
                  region === "all" ? "font-semibold" : "font-normal"
                }`}
                onClick={() => handleRegionSelect("all")}
                tabIndex={0}
                role="option"
                aria-selected={region === "all"}
              >
                All
              </li>
              {regions.map((r) => (
                <li
                  key={r}
                  className={`cursor-pointer px-4 py-1 ${
                    region === r ? "font-semibold" : "font-normal"
                  }`}
                  onClick={() => handleRegionSelect(r)}
                  tabIndex={0}
                  role="option"
                  aria-selected={region === r}
                >
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

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

export default Countries;