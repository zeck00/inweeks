import type { CountryLifeExpectancy } from '../types';

export function searchCountries(
  countries: CountryLifeExpectancy[],
  query: string
): CountryLifeExpectancy[] {
  const q = query.toLowerCase().trim();
  if (!q) return countries;

  return countries
    .filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase() === q
    )
    .sort((a, b) => {
      const aStartsWith = a.name.toLowerCase().startsWith(q);
      const bStartsWith = b.name.toLowerCase().startsWith(q);
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.name.localeCompare(b.name);
    });
}
