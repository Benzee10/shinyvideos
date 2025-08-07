
const FAVORITES_KEY = 'video_favorites';

export function getFavorites(): Set<string> {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

export function toggleFavorite(slug: string): boolean {
  const favorites = getFavorites();
  const isNowFavorite = !favorites.has(slug);
  
  if (isNowFavorite) {
    favorites.add(slug);
  } else {
    favorites.delete(slug);
  }
  
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  } catch (error) {
    console.error('Failed to save favorites:', error);
  }
  
  return isNowFavorite;
}

export function isFavorite(slug: string): boolean {
  return getFavorites().has(slug);
}
