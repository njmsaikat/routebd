const STORAGE_KEY = "routebd:recent-searches";
const MAX_ENTRIES = 5;

export interface RecentSearch {
  from: string;
  to: string;
  searchedAt: number;
}

export function getRecentSearches(): RecentSearch[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentSearch[]) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(from: string, to: string): RecentSearch[] {
  const existing = getRecentSearches().filter(
    (s) => !(s.from.toLowerCase() === from.toLowerCase() && s.to.toLowerCase() === to.toLowerCase())
  );
  const updated = [{ from, to, searchedAt: Date.now() }, ...existing].slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
