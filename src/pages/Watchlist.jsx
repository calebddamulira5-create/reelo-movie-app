import PageContainer from '../components/PageContainer';
import MovieGrid from '../components/MovieGrid';
import { EmptyState } from '../components/StateMessage';
import { useWatchlist } from '../context/WatchlistContext';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

export default function Watchlist() {
  const { items } = useWatchlist();

  return (
    <PageContainer title="My Watchlist" subtitle={items.length > 0 ? `${items.length} saved ${items.length === 1 ? 'title' : 'titles'}` : undefined}>
      {items.length === 0 ? (
        <EmptyState
          icon={<BookmarkBorderIcon />}
          title="Your watchlist is empty"
          message="Select the bookmark on any poster to save it here."
          actionLabel="Browse movies"
          to="/movies"
        />
      ) : (
        <MovieGrid items={items} />
      )}
    </PageContainer>
  );
}
