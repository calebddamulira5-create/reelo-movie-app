import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, MenuItem, TextField } from '@mui/material';
import PageContainer from '../components/PageContainer';
import GenreFilter from '../components/GenreFilter';
import MovieGrid, { GridSkeleton } from '../components/MovieGrid';
import { EmptyState, ErrorState } from '../components/StateMessage';
import useFetch from '../hooks/useFetch';
import { SORT_OPTIONS, discover, getGenres } from '../services/tmdb';

/** Shared page for Movies (type="movie") and TV Shows (type="tv"). */
export default function BrowsePage({ type, title }) {
  const [genre, setGenre] = useState('');
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const genres = useFetch(() => getGenres(type), [type]);

  // Load a page of results whenever the filter, sort order or page changes
  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    discover(type, { genre, sort, page })
      .then((result) => {
        if (cancelled) return;
        setItems((prev) => (page === 1 ? result.items : [...prev, ...result.items]));
        setTotalPages(result.totalPages);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [type, genre, sort, page, attempt]);

  const changeGenre = (value) => {
    setGenre(value);
    setPage(1);
    setItems([]);
  };

  const changeSort = (value) => {
    setSort(value);
    setPage(1);
    setItems([]);
  };

  const filters = (
    <TextField select size="small" label="Sort by" value={sort} onChange={(e) => changeSort(e.target.value)} sx={{ minWidth: 170 }}>
      {SORT_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );

  return (
    <PageContainer title={title} actions={filters}>
      {genres.data && (
        <Box sx={{ mb: 3 }}>
          <GenreFilter genres={genres.data} value={genre} onChange={changeGenre} />
        </Box>
      )}

      {status === 'error' && <ErrorState message={error} onRetry={() => setAttempt((n) => n + 1)} />}
      {status === 'loading' && items.length === 0 && <GridSkeleton />}
      {status === 'ready' && items.length === 0 && (
        <EmptyState title="Nothing matches this filter" message="Try another genre or sort order." />
      )}

      {items.length > 0 && <MovieGrid items={items} />}

      {items.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          {status === 'loading' ? (
            <CircularProgress aria-label="Loading more titles" />
          ) : (
            page < totalPages && (
              <Button variant="outlined" size="large" onClick={() => setPage((p) => p + 1)}>
                Load more
              </Button>
            )
          )}
        </Box>
      )}
    </PageContainer>
  );
}
