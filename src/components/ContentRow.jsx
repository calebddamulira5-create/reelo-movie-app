import { useRef } from 'react';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieCard from './MovieCard';
import { ErrorState } from './StateMessage';

const CARD_WIDTH = { xs: 118, sm: 146, md: 168 };
const PAGE_PADDING = { xs: 2, md: 4 };

const arrowSx = (side) => ({
  display: { xs: 'none', md: 'flex' },
  position: 'absolute',
  top: '38%',
  [side]: 8,
  zIndex: 2,
  bgcolor: 'rgba(8,9,13,0.85)',
  color: 'common.white',
  opacity: 0,
  transition: 'opacity 0.2s',
  '&:hover': { bgcolor: 'rgba(8,9,13,1)' },
  '&:focus-visible': { opacity: 1 },
});

/** One horizontally scrolling shelf of posters. `state` is the object returned by useFetch. */
export default function ContentRow({ title, state }) {
  const scroller = useRef(null);
  const { data, loading, error, retry } = state;
  const items = data?.items ?? [];

  const scrollBy = (direction) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <Box component="section" aria-label={title} sx={{ mb: { xs: 2, md: 4 } }}>
      <Typography variant="h5" component="h2" sx={{ px: PAGE_PADDING, mb: 0.5 }}>
        {title}
      </Typography>

      {error ? (
        <ErrorState compact message={error} onRetry={retry} />
      ) : (
        <Box sx={{ position: 'relative', '&:hover .row-arrow': { opacity: 1 } }}>
          <IconButton className="row-arrow" aria-label={`Scroll ${title} left`} onClick={() => scrollBy(-1)} sx={arrowSx('left')}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton className="row-arrow" aria-label={`Scroll ${title} right`} onClick={() => scrollBy(1)} sx={arrowSx('right')}>
            <ChevronRightIcon />
          </IconButton>

          <Box
            ref={scroller}
            sx={{
              display: 'flex',
              gap: { xs: 1.5, md: 2 },
              overflowX: 'auto',
              px: PAGE_PADDING,
              py: 2, // room for the hover scale effect
              scrollSnapType: 'x proximity',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {loading
              ? Array.from({ length: 10 }, (_, i) => (
                  <Box key={i} sx={{ flex: '0 0 auto', width: CARD_WIDTH, aspectRatio: '2 / 3' }}>
                    <Skeleton variant="rounded" width="100%" height="100%" />
                  </Box>
                ))
              : items.map((item) => (
                  <Box key={`${item.type}-${item.id}`} sx={{ flex: '0 0 auto', width: CARD_WIDTH, scrollSnapAlign: 'start' }}>
                    <MovieCard item={item} />
                  </Box>
                ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
