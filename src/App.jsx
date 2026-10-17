import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import BrowsePage from './pages/BrowsePage';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Details from './pages/Details';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="movies" element={<BrowsePage key="movie" type="movie" title="Movies" />} />
        <Route path="tv" element={<BrowsePage key="tv" type="tv" title="TV Shows" />} />
        <Route path="watchlist" element={<Watchlist />} />
        <Route path="search" element={<Search />} />
        <Route path=":type/:id" element={<Details />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
