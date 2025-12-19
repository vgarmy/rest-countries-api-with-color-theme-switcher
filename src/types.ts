export interface Country {
  cca3: string;
  name: { common: string };
  flags?: { png?: string; svg?: string; alt?: string };
  population: number;
  region: string;
  capital?: string[];
}

export interface CountryDetail {
  cca3: string;
  name: {
    common: string;
    official?: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  flags?: { png?: string; svg?: string; alt?: string };
  population: number;
  region: string;
  subregion?: string;
  capital?: string[];
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol?: string }>;
  maps?: { googleMaps?: string; openStreetMaps?: string };
  borders?: string[];
  tld?: string[];
}

export interface BorderCountry {
  cca3: string;
  name: string;
}