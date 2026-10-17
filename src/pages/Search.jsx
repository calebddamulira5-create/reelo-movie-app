import { useSearchParams } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import MovieGrid, { GridSkeleton } from '../components/MovieGrid';
import { EmptyState, ErrorState } from '../components/StateMessage';
import useFetch from '../hooks/useFetch';
import { search } from '../services/tmdb';
import SearchIcon from '@mui/icons-material/Search';

export default function Search() {
  const [params] = useSearchParams();
  const query = (params.get('q') || '').trim();

  const { data, loading, error, retry } = useFetch(
    () => (query ? search(query) : Promise.resolve({ items: [], totalResults: 0 })),
    [query],
  );

  const items = data?.items ?? [];
  const title = query ? `Results for “${query}”` : 'Search';
  const subtitle = !loading && !error && query && items.length > 0 ? `${data.totalResults} matches. Showing the top ${items.length}.` : undefined;

  return (
    <PageContainer title={title} subtitle={subtitle}>
      {!query && (
        <EmptyState icon={<SearchIcon />} title="Search for a title" message="Type a movie or TV show name in the search bar above." />
      )}
      {query && loading && <GridSkeleton count={12} />}
      {query && error && <ErrorState message={error} onRetry={retry} />}
      {query && !loading && !error && items.length === 0 && (
        <EmptyState
          title={`No matches for “${query}”`}
          message="Check the spelling or try a different title."
          actionLabel="Browse movies"
          to="/movies"
        />
      )}
      {query && !loading && !error && items.length > 0 && <MovieGrid items={items} />}
    </PageContainer>
  );
}
