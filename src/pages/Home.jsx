import { Box } from '@mui/material';
import Hero from '../components/Hero';
import ContentRow from '../components/ContentRow';
import useFetch from '../hooks/useFetch';
import { discover, getList, getTrending } from '../services/tmdb';
import { ACTION_MOVIE_GENRE } from '../config';

export default function Home() {
  // One request per shelf; each shelf loads and fails independently
  const trending = useFetch(getTrending);
  const popularMovies = useFetch(() => getList('movie', 'popular'));
  const popularTv = useFetch(() => getList('tv', 'popular'));
  const actionMovies = useFetch(() => discover('movie', { genre: ACTION_MOVIE_GENRE }));
  const topRated = useFetch(() => getList('movie', 'top_rated'));

  const featured = trending.data?.items.find((item) => item.backdrop);

  return (
    <Box>
      <Hero item={featured} loading={trending.loading} />
      <Box sx={{ position: 'relative', mt: { xs: -5, md: -9 } }}>
        <ContentRow title="Trending This Week" state={trending} />
        <ContentRow title="Popular Movies" state={popularMovies} />
        <ContentRow title="Popular TV Shows" state={popularTv} />
        <ContentRow title="Action Movies" state={actionMovies} />
        <ContentRow title="Top Rated Movies" state={topRated} />
      </Box>
    </Box>
  );
}
