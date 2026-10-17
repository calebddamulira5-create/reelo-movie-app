# Reelo: Movie Discovery Web App

Reelo is a responsive movie and TV discovery application inspired by streaming platforms. Users can browse trending and popular titles, search by name, filter by genre, open a details page for any title, and keep a personal watchlist that survives page refreshes.

Built for the Web and Mobile Application Development practical assignment.

- **Live app:** _add your Vercel or Netlify link here_
- **API used:** [TMDB (The Movie Database) API v3](https://developer.themoviedb.org/docs)

## Features

| Area | What it does |
|---|---|
| Homepage | Featured banner plus five shelves: Trending This Week, Popular Movies, Popular TV Shows, Action Movies, Top Rated Movies |
| Navigation | React Router pages: Home, Movies, TV Shows, My Watchlist, Search, and Details. Side rail on desktop, slide-out drawer on mobile |
| Live data | Every title, poster, rating, genre and description comes from the TMDB API. Nothing is hardcoded |
| Search | Live search from the top bar (results appear after typing stops). Loading, no-match and error states included |
| Details | Poster, title, overview, release year, rating, genres, runtime or seasons |
| Filtering | Genre chips on the Movies and TV Shows pages, plus sorting (most popular, highest rated, newest) and a Load more button |
| Watchlist | Add and remove from any poster or details page. Saved in `localStorage` |
| Resilience | Skeleton loaders, empty states, retry buttons on errors, fallback for missing posters, missing fields handled |
| Responsive | Poster grid and shelves adapt to desktop, tablet and phone. No horizontal page overflow |

## Technologies

React 19 (JSX) · Vite · Material UI · React Router · Fetch API · React Hooks (`useState`, `useEffect`, `useRef`, `useContext`, custom `useFetch`) · localStorage

## Run locally

Requires [Node.js](https://nodejs.org) 18 or newer.

1. Clone the repository and open the folder in a terminal.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Get a free API key: create an account at [themoviedb.org](https://www.themoviedb.org), then open **Settings → API** and copy the **API Key (v3 auth)**.
4. Create your environment file from the template and paste the key into it.
   ```bash
   # macOS / Linux
   cp .env.example .env
   # Windows (Command Prompt or PowerShell)
   copy .env.example .env
   ```
   ```
   VITE_TMDB_API_KEY=your_real_key_here
   ```
5. Start the dev server and open the address it prints (usually http://localhost:5173):
   ```bash
   npm run dev
   ```

Other commands: `npm run build` (production build into `dist/`), `npm run preview` (serve the build locally).

## Project structure

```
src/
  main.jsx                 App entry: theme, router, watchlist provider
  App.jsx                  Route definitions
  theme.js                 Material UI dark theme and fonts
  config.js                App name and layout constants
  services/tmdb.js         All TMDB requests; converts API data into one shape
  hooks/useFetch.js        Reusable loading / error / data hook
  context/WatchlistContext.jsx   Watchlist state saved to localStorage
  components/              Navbar, SideNav, Layout, Hero, ContentRow, MovieCard,
                           MovieGrid, GenreFilter, PageContainer, StateMessage, Footer
  pages/                   Home, BrowsePage (Movies and TV Shows), Search,
                           Watchlist, Details, NotFound
```

## How it works

- **Data flow:** pages call functions from `services/tmdb.js`, usually through the `useFetch` hook, which tracks loading, error and data state. Components only receive ready-to-display data.
- **Search:** the top bar updates the URL (`/search?q=...`) after a short pause in typing. The Search page reads that query and requests `/search/multi` from TMDB, keeping only movies and TV shows.
- **Filtering:** the Movies and TV Shows pages share one `BrowsePage` component. The selected genre and sort order are sent to TMDB's `/discover` endpoint.
- **Watchlist:** a React context holds the saved titles and writes them to `localStorage` whenever they change. They are read back when the app starts.
- **Mobile layout:** below the `md` breakpoint the side rail is replaced by a drawer opened from the menu button, and the poster grid uses smaller columns.

## Deployment

The project includes `vercel.json` and `public/_redirects` so page refreshes on routes such as `/movies` work on Vercel and Netlify. Add `VITE_TMDB_API_KEY` as an environment variable in the hosting dashboard before deploying.

## API key note

The `.env` file is listed in `.gitignore` and is never committed; only `.env.example` with a placeholder is. TMDB's v3 key is designed for client-side apps, so it is still visible in browser network requests once the app is deployed.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB. All movie and TV data and images are provided by [TMDB](https://www.themoviedb.org). Fonts: Bebas Neue and Figtree from Google Fonts.

## Screenshots

_Add at least two screenshots here: the homepage and a movie or TV details page._

```
docs/homepage.png
docs/details.png
```
