import { Box, Skeleton } from '@mui/material';
import MovieCard from './MovieCard';

const gridSx = {
  display: 'grid',
  gap: { xs: 1.5, sm: 2.5 },
  gridTemplateColumns: {
    xs: 'repeat(auto-fill, minmax(104px, 1fr))',
    sm: 'repeat(auto-fill, minmax(150px, 1fr))',
    md: 'repeat(auto-fill, minmax(172px, 1fr))',
  },
};

export default function MovieGrid({ items }) {
  return (
    <Box sx={gridSx}>
      {items.map((item) => (
        <MovieCard key={`${item.type}-${item.id}`} item={item} />
      ))}
    </Box>
  );
}

export function GridSkeleton({ count = 18 }) {
  return (
    <Box sx={gridSx} aria-busy="true" aria-label="Loading titles">
      {Array.from({ length: count }, (_, i) => (
        <Box key={i} sx={{ aspectRatio: '2 / 3' }}>
          <Skeleton variant="rounded" width="100%" height="100%" />
        </Box>
      ))}
    </Box>
  );
}
