import { Coordinates, ResolvedLocation } from "./types";

export const GREATER_SEATTLE_DEFAULT: ResolvedLocation = {
  display_name: "South Lake Union, Seattle",
  address: "1700 Westlake Ave N #200, Seattle, WA 98109",
  coordinates: { lat: 47.6246, lng: -122.3414, address: "1700 Westlake Ave N #200, Seattle, WA 98109", label: "South Lake Union" },
  source: "greater_seattle_default",
};

// Known Seattle-area company office locations
const SEATTLE_COMPANY_OFFICES: Record<string, ResolvedLocation> = {
  "ge healthcare": {
    display_name: "GE Healthcare — Bellevue",
    address: "500 108th Ave NE, Bellevue, WA 98004",
    coordinates: { lat: 47.6149, lng: -122.2006, address: "500 108th Ave NE, Bellevue, WA 98004", label: "GE Healthcare Bellevue" },
    source: "company_hq",
  },
  gehealthcare: {
    display_name: "GE Healthcare — Bellevue",
    address: "500 108th Ave NE, Bellevue, WA 98004",
    coordinates: { lat: 47.6149, lng: -122.2006, address: "500 108th Ave NE, Bellevue, WA 98004", label: "GE Healthcare Bellevue" },
    source: "company_hq",
  },
  "seattle university": {
    display_name: "Seattle University — First Hill",
    address: "901 12th Ave, Seattle, WA 98122",
    coordinates: { lat: 47.6059, lng: -122.3199, address: "901 12th Ave, Seattle, WA 98122", label: "Seattle University" },
    source: "company_hq",
  },
  "gasworks park": {
    display_name: "Gasworks Park — Wallingford",
    address: "2101 N Northlake Way, Seattle, WA 98103",
    coordinates: { lat: 47.6456, lng: -122.3344, address: "2101 N Northlake Way, Seattle, WA 98103", label: "Gasworks Park" },
    source: "company_hq",
  },
  amazon: {
    display_name: "Amazon HQ — South Lake Union",
    address: "410 Terry Ave N, Seattle, WA 98109",
    coordinates: { lat: 47.6174, lng: -122.3371, address: "410 Terry Ave N, Seattle, WA 98109", label: "Amazon HQ" },
    source: "company_hq",
  },
  microsoft: {
    display_name: "Microsoft Campus — Redmond",
    address: "1 Microsoft Way, Redmond, WA 98052",
    coordinates: { lat: 47.6423, lng: -122.1301, address: "1 Microsoft Way, Redmond, WA 98052", label: "Microsoft Campus" },
    source: "company_hq",
  },
  google: {
    display_name: "Google — South Lake Union",
    address: "601 N 34th St, Seattle, WA 98103",
    coordinates: { lat: 47.6484, lng: -122.3472, address: "601 N 34th St, Seattle, WA 98103", label: "Google Seattle" },
    source: "company_hq",
  },
  meta: {
    display_name: "Meta — South Lake Union",
    address: "1101 Dexter Ave N, Seattle, WA 98109",
    coordinates: { lat: 47.6289, lng: -122.3397, address: "1101 Dexter Ave N, Seattle, WA 98109", label: "Meta Seattle" },
    source: "company_hq",
  },
  facebook: {
    display_name: "Meta (Facebook) — South Lake Union",
    address: "1101 Dexter Ave N, Seattle, WA 98109",
    coordinates: { lat: 47.6289, lng: -122.3397, address: "1101 Dexter Ave N, Seattle, WA 98109", label: "Meta Seattle" },
    source: "company_hq",
  },
  zillow: {
    display_name: "Zillow HQ — South Lake Union",
    address: "1301 2nd Ave #3100, Seattle, WA 98101",
    coordinates: { lat: 47.6088, lng: -122.3395, address: "1301 2nd Ave #3100, Seattle, WA 98101", label: "Zillow HQ" },
    source: "company_hq",
  },
  boeing: {
    display_name: "Boeing — Renton",
    address: "100 N Naches Ave SW, Renton, WA 98055",
    coordinates: { lat: 47.5107, lng: -122.302, address: "100 N Naches Ave SW, Renton, WA 98055", label: "Boeing Renton" },
    source: "company_hq",
  },
  expedia: {
    display_name: "Expedia Group HQ — Interbay",
    address: "1111 Expedia Group Way W, Seattle, WA 98119",
    coordinates: { lat: 47.6262, lng: -122.3784, address: "1111 Expedia Group Way W, Seattle, WA 98119", label: "Expedia HQ" },
    source: "company_hq",
  },
  starbucks: {
    display_name: "Starbucks HQ — SoDo",
    address: "2401 Utah Ave S, Seattle, WA 98134",
    coordinates: { lat: 47.5795, lng: -122.3324, address: "2401 Utah Ave S, Seattle, WA 98134", label: "Starbucks HQ" },
    source: "company_hq",
  },
  tableau: {
    display_name: "Tableau (Salesforce) — Fremont",
    address: "837 N 34th St, Seattle, WA 98103",
    coordinates: { lat: 47.6484, lng: -122.347, address: "837 N 34th St, Seattle, WA 98103", label: "Tableau Seattle" },
    source: "company_hq",
  },
  salesforce: {
    display_name: "Salesforce Tower — Downtown",
    address: "929 108th Ave NE, Bellevue, WA 98004",
    coordinates: { lat: 47.6178, lng: -122.2, address: "929 108th Ave NE, Bellevue, WA 98004", label: "Salesforce Bellevue" },
    source: "company_hq",
  },
  apple: {
    display_name: "Apple Seattle — Capitol Hill",
    address: "1400 Broadway, Seattle, WA 98122",
    coordinates: { lat: 47.6149, lng: -122.3201, address: "1400 Broadway, Seattle, WA 98122", label: "Apple Seattle" },
    source: "company_hq",
  },
  oracle: {
    display_name: "Oracle — Redmond",
    address: "15615 NE 91st St, Redmond, WA 98052",
    coordinates: { lat: 47.6785, lng: -122.1136, address: "15615 NE 91st St, Redmond, WA 98052", label: "Oracle Redmond" },
    source: "company_hq",
  },
  "t-mobile": {
    display_name: "T-Mobile HQ — Bellevue",
    address: "12920 SE 38th St, Bellevue, WA 98006",
    coordinates: { lat: 47.5478, lng: -122.1478, address: "12920 SE 38th St, Bellevue, WA 98006", label: "T-Mobile HQ" },
    source: "company_hq",
  },
  tmobile: {
    display_name: "T-Mobile HQ — Bellevue",
    address: "12920 SE 38th St, Bellevue, WA 98006",
    coordinates: { lat: 47.5478, lng: -122.1478, address: "12920 SE 38th St, Bellevue, WA 98006", label: "T-Mobile HQ" },
    source: "company_hq",
  },
  nordstrom: {
    display_name: "Nordstrom HQ — Downtown Seattle",
    address: "1617 6th Ave, Seattle, WA 98101",
    coordinates: { lat: 47.6116, lng: -122.3341, address: "1617 6th Ave, Seattle, WA 98101", label: "Nordstrom HQ" },
    source: "company_hq",
  },
  costco: {
    display_name: "Costco HQ — Issaquah",
    address: "999 Lake Dr, Issaquah, WA 98027",
    coordinates: { lat: 47.5301, lng: -122.0326, address: "999 Lake Dr, Issaquah, WA 98027", label: "Costco HQ" },
    source: "company_hq",
  },
  uw: {
    display_name: "University of Washington",
    address: "4333 Brooklyn Ave NE, Seattle, WA 98195",
    coordinates: { lat: 47.6553, lng: -122.3035, address: "4333 Brooklyn Ave NE, Seattle, WA 98195", label: "UW Seattle" },
    source: "company_hq",
  },
  "university of washington": {
    display_name: "University of Washington",
    address: "4333 Brooklyn Ave NE, Seattle, WA 98195",
    coordinates: { lat: 47.6553, lng: -122.3035, address: "4333 Brooklyn Ave NE, Seattle, WA 98195", label: "UW Seattle" },
    source: "company_hq",
  },
};

export function resolveCompanyLocation(companyName: string): ResolvedLocation {
  const key = companyName.toLowerCase().trim();
  for (const [k, v] of Object.entries(SEATTLE_COMPANY_OFFICES)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  // Default unknown companies to downtown Seattle
  return {
    display_name: `${companyName} — Downtown Seattle`,
    address: "1201 3rd Ave, Seattle, WA 98101",
    coordinates: {
      lat: 47.6062,
      lng: -122.3321,
      address: "1201 3rd Ave, Seattle, WA 98101",
      label: `${companyName} (est.)`,
    },
    source: "company_hq",
  };
}

const NEIGHBORHOOD_COORDS: Record<string, Coordinates> = {
  "capitol hill":         { lat: 47.6254, lng: -122.3192, address: "Broadway & E Pike St, Seattle, WA 98122",        label: "Capitol Hill" },
  "south lake union":     { lat: 47.6246, lng: -122.3414, address: "1700 Westlake Ave N, Seattle, WA 98109",          label: "South Lake Union" },
  "ballard":              { lat: 47.6682, lng: -122.3842, address: "5400 Ballard Ave NW, Seattle, WA 98107",           label: "Ballard" },
  "fremont":              { lat: 47.6506, lng: -122.3501, address: "3501 Fremont Ave N, Seattle, WA 98103",            label: "Fremont" },
  "queen anne":           { lat: 47.6368, lng: -122.3571, address: "Queen Anne Ave N & W McGraw St, Seattle, WA 98109",label: "Queen Anne" },
  "west seattle":         { lat: 47.5628, lng: -122.3857, address: "4700 California Ave SW, Seattle, WA 98116",        label: "West Seattle" },
  "columbia city":        { lat: 47.5597, lng: -122.2907, address: "4801 Rainier Ave S, Seattle, WA 98118",            label: "Columbia City" },
  "central district":     { lat: 47.6103, lng: -122.2998, address: "23rd Ave & E Union St, Seattle, WA 98122",         label: "Central District" },
  "beacon hill":          { lat: 47.5693, lng: -122.3089, address: "15th Ave S & S Beacon St, Seattle, WA 98108",      label: "Beacon Hill" },
  "north seattle":        { lat: 47.6975, lng: -122.3421, address: "N 85th St & Greenwood Ave N, Seattle, WA 98103",   label: "North Seattle" },
  "u district":           { lat: 47.658,  lng: -122.3122, address: "University Way NE & NE 42nd St, Seattle, WA 98105",label: "U District" },
  "university district":  { lat: 47.658,  lng: -122.3122, address: "University Way NE & NE 42nd St, Seattle, WA 98105",label: "U District" },
  "downtown":             { lat: 47.6062, lng: -122.3321, address: "1201 3rd Ave, Seattle, WA 98101",                  label: "Downtown Seattle" },
  "slu":                  { lat: 47.6246, lng: -122.3414, address: "1700 Westlake Ave N, Seattle, WA 98109",           label: "South Lake Union" },
  "bellevue":             { lat: 47.6101, lng: -122.2015, address: "10500 NE 8th St, Bellevue, WA 98004",              label: "Bellevue" },
  "redmond":              { lat: 47.6740, lng: -122.1215, address: "15600 NE 8th St, Redmond, WA 98052",               label: "Redmond" },
  "redmond, wa":          { lat: 47.6740, lng: -122.1215, address: "15600 NE 8th St, Redmond, WA 98052",               label: "Redmond" },
  "first hill":           { lat: 47.6059, lng: -122.3199, address: "900 Madison St, Seattle, WA 98104",                label: "First Hill" },
  "wallingford":          { lat: 47.6592, lng: -122.3357, address: "45th St & Wallingford Ave N, Seattle, WA 98103",   label: "Wallingford" },
  "south seattle":        { lat: 47.5490, lng: -122.2961, address: "Rainier Ave S & S Alaska St, Seattle, WA 98118",   label: "South Seattle" },
  "capitol hill seattle": { lat: 47.6254, lng: -122.3192, address: "Broadway & E Pike St, Seattle, WA 98122",          label: "Capitol Hill" },
  "kirkland":             { lat: 47.6815, lng: -122.2087, address: "123 Lake St S, Kirkland, WA 98033",                label: "Kirkland" },
  "bothell":              { lat: 47.7601, lng: -122.2043, address: "18415 101st Ave NE, Bothell, WA 98011",            label: "Bothell" },
};

export function resolveHomeLocation(rawLocation: string): ResolvedLocation {
  const lower = rawLocation.toLowerCase().trim();

  if (
    lower.includes("greater seattle") ||
    lower === "seattle, wa" ||
    lower === "seattle, washington"
  ) {
    return GREATER_SEATTLE_DEFAULT;
  }

  // Try neighborhood match
  for (const [key, coords] of Object.entries(NEIGHBORHOOD_COORDS)) {
    if (lower.includes(key)) {
      return {
        display_name: coords.label ?? key,
        address: coords.address,
        coordinates: coords,
        source: "linkedin_raw",
      };
    }
  }

  // Generic Seattle fallback
  if (lower.includes("seattle")) {
    return GREATER_SEATTLE_DEFAULT;
  }

  // Non-Seattle — return with placeholder coords
  return {
    display_name: rawLocation,
    address: rawLocation,
    coordinates: { lat: 47.6062, lng: -122.3321, address: rawLocation },
    source: "linkedin_raw",
  };
}

export function googleMapsUrl(coords: Coordinates): string {
  return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
}
