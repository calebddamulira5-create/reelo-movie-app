import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'reelo.watchlist.v1';
const WatchlistContext = createContext(null);

function loadSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return []; // corrupted data or storage blocked: start with an empty list
  }
}

export function WatchlistProvider({ children }) {
  const [items, setItems] = useState(loadSaved);

  // Save to localStorage every time the list changes, so it survives a page refresh.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or unavailable: the list still works for this session */
    }
  }, [items]);

  const isSaved = useCallback(
    (type, id) => items.some((i) => i.type === type && i.id === id),
    [items],
  );

  // Adds the item if it is not saved yet, otherwise removes it.
  const toggle = useCallback((item) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.type === item.type && i.id === item.id);
      if (exists) return prev.filter((i) => !(i.type === item.type && i.id === item.id));
      const { id, type, title, poster, backdrop, year, rating, overview } = item;
      return [{ id, type, title, poster, backdrop, year, rating, overview }, ...prev];
    });
  }, []);

  const value = useMemo(() => ({ items, isSaved, toggle }), [items, isSaved, toggle]);
  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext);
  if (!ctx) throw new Error('useWatchlist must be used inside <WatchlistProvider>');
  return ctx;
}
