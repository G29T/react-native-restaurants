export type Country = {
  id: string;
  label: string;
  lat: number;
  lng: number;
};

export const COUNTRIES: Country[] = [
  { id: 'Australia', label: 'Australia', lat: -25.2744, lng: 133.7751 },
  { id: 'Bahrain', label: 'Bahrain', lat: 26.0667, lng: 50.5577 },
  { id: 'Botswana', label: 'Botswana', lat: -22.3285, lng: 24.6849 },
  { id: 'Canada', label: 'Canada', lat: 56.1304, lng: -106.3468 },
  { id: 'Eswatini', label: 'Eswatini', lat: -26.5225, lng: 31.4659 },
  { id: 'India', label: 'India', lat: 20.5937, lng: 78.9629 },
  { id: 'Ireland', label: 'Ireland', lat: 53.4129, lng: -8.2439 },
  { id: 'Malaysia', label: 'Malaysia', lat: 4.2105, lng: 101.9758 },
  { id: 'Mauritius', label: 'Mauritius', lat: -20.3484, lng: 57.5522 },
  { id: 'NewZealand', label: 'New Zealand', lat: -40.9006, lng: 174.886 },
  { id: 'Oman', label: 'Oman', lat: 21.4735, lng: 55.9754 },
  { id: 'Pakistan', label: 'Pakistan', lat: 30.3753, lng: 69.3451 },
  { id: 'Qatar', label: 'Qatar', lat: 25.3548, lng: 51.1839 },
  { id: 'Saudi', label: 'Saudi Arabia', lat: 23.8859, lng: 45.0792 },
  { id: 'Singapore', label: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { id: 'SouthAfrica', label: 'South Africa', lat: -30.5595, lng: 22.9375 },
  { id: 'UAE', label: 'UAE', lat: 23.4241, lng: 53.8478 },
  { id: 'UK', label: 'United Kingdom', lat: 55.3781, lng: -3.436 },
  { id: 'USA', label: 'United States', lat: 37.0902, lng: -95.7129 },
  { id: 'Zambia', label: 'Zambia', lat: -13.1339, lng: 27.8493 },
  { id: 'Zimbabwe', label: 'Zimbabwe', lat: -19.0154, lng: 29.1549 },
];

export const CONTINENT_MAP: Record<string, string> = {
  UK: 'Europe',
  Ireland: 'Europe',

  USA: 'North America',
  Canada: 'North America',

  Bahrain: 'Middle East',
  Oman: 'Middle East',
  Qatar: 'Middle East',
  Saudi: 'Middle East',
  UAE: 'Middle East',

  India: 'Asia',
  Malaysia: 'Asia',
  Singapore: 'Asia',
  Pakistan: 'Asia',

  Botswana: 'Africa',
  Eswatini: 'Africa',
  Mauritius: 'Africa',
  SouthAfrica: 'Africa',
  Zambia: 'Africa',
  Zimbabwe: 'Africa',

  Australia: 'Oceania',
  NewZealand: 'Oceania',
};