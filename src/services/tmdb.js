// All communication with the TMDB REST API lives in this file.
// Components never call fetch() directly; they use the functions exported here.

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const posterUrl = (path, size = 'w342') => (path ? `${IMAGE_BASE}/${size}${path}` : null);
export const backdropUrl = (path, size = 'w1280') => (path ? `${IMAGE_BASE}/${size}${path}` : null);

export const SORT_OPTIONS = [
  { value: 'popular', label: 'Most popular' },
  { value: 'rating', label: 'Highest rated' },
  { value: 'newest', label: 'Newest' },
];

const SORT_FIELDS = {
  popular: { movie: 'popularity.desc', tv: 'popularity.desc' },
  rating: { movie: 'vote_average.desc', tv: 'vote_average.desc' },
  newest: { movie: 'primary_release_date.desc', tv: 'first_air_date.desc' },
};

async function request(path, params = {}) {
  if (!API_KEY) {
    throw new Error('API key missing. Add VITE_TMDB_API_KEY to your .env file and restart the dev server.');
  }

  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value);
  });

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error('Network error. Check your internet connection and try again.');
  }

  if (!response.ok) {
    if (response.status === 401) throw new Error('The API key was rejected. Check VITE_TMDB_API_KEY.');
    if (response.status === 404) throw new Error('That title could not be found.');
    throw new Error(`The movie service returned an error (${response.status}). Please try again.`);
  }
  return response.json();
}

// TMDB uses different field names for movies and TV shows; this gives the UI one shape.
// Missing values become null or an empty string so components can handle them.
function normalize(raw, forcedType) {
  const type = forcedType || raw.media_type;
  const date = raw.release_date || raw.first_air_date || '';
  return {
    id: raw.id,
    type,
    title: raw.title || raw.name || 'Untitled',
    overview: raw.overview || '',
    poster: posterUrl(raw.poster_path),
    backdrop: backdropUrl(raw.backdrop_path),
    year: date ? date.slice(0, 4) : '',
    rating: raw.vote_average ? Number(raw.vote_average) : null, // 0 means "not rated yet"
  };
}

function toList(data, forcedType) {
  const results = (data.results || []).filter(
    (r) => forcedType || r.media_type === 'movie' || r.media_type === 'tv', // drops "person" results
  );
  return {
    items: results.map((r) => normalize(r, forcedType)),
    page: data.page || 1,
    totalPages: Math.min(data.total_pages || 1, 500), // TMDB allows at most 500 pages
    totalResults: data.total_results || 0,
  };
}

export async function getTrending() {
  return toList(await request('/trending/all/week'));
}

/** category: 'popular' | 'top_rated' */
export async function getList(type, category, page = 1) {
  return toList(await request(`/${type}/${category}`, { page }), type);
}

/** Browse by genre and sort order. type: 'movie' | 'tv'. */
export async function discover(type, { genre, sort = 'popular', page = 1 } = {}) {
  const params = { with_genres: genre, sort_by: SORT_FIELDS[sort][type], page };
  if (sort === 'rating') params['vote_count.gte'] = 300; // hide titles with only a handful of votes
  if (sort === 'newest') {
    const today = new Date().toISOString().slice(0, 10);
    params[type === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte'] = today; // skip unreleased titles
  }
  return toList(await request(`/discover/${type}`, params), type);
}

export async function getGenres(type) {
  const data = await request(`/genre/${type}/list`);
  return data.genres || [];
}

export async function search(query, page = 1) {
  return toList(await request('/search/multi', { query, page, include_adult: false }));
}

export async function getDetails(type, id) {
  const raw = await request(`/${type}/${id}`);
  return {
    ...normalize(raw, type),
    tagline: raw.tagline || '',
    genres: (raw.genres || []).map((g) => g.name),
    runtime: type === 'movie' ? raw.runtime || null : raw.episode_run_time?.[0] || null,
    seasons: raw.number_of_seasons || null,
    status: raw.status || '',
    voteCount: raw.vote_count || 0,
  };
}
