import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import { useWatchlist } from '../context/WatchlistContext';
import { BG } from '../theme';
import { TOP_BAR_HEIGHT } from '../config';

const HEIGHT = { xs: '64vh', md: '78vh' };

/** Large featured banner at the top of the homepage. */
export default function Hero({ item, loading }) {
  const { isSaved, toggle } = useWatchlist();

  if (loading) return <Skeleton variant="rectangular" sx={{ height: HEIGHT }} />;
  if (!item) return <Box sx={{ height: TOP_BAR_HEIGHT }} />; // keeps rows clear of the fixed top bar

  const saved = isSaved(item.type, item.id);

  return (
    <Box
      component="section"
      aria-label="Featured title"
      sx={{
        position: 'relative',
        minHeight: HEIGHT,
        display: 'flex',
        alignItems: 'flex-end',
        backgroundImage: `url(${item.backdrop})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, ${BG} 3%, rgba(8,9,13,0.25) 55%, rgba(8,9,13,0.55) 100%),
                       linear-gradient(to right, rgba(8,9,13,0.85) 0%, rgba(8,9,13,0) 62%)`,
        }}
      />
      <Box sx={{ position: 'relative', px: { xs: 2, md: 4 }, pb: { xs: 8, md: 12 }, pt: 12, maxWidth: 700 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: 52, sm: 72, md: 96 }, textShadow: '0 4px 24px rgba(0,0,0,0.6)' }}>
          {item.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1.5, color: 'text.secondary', fontWeight: 600 }}>
          {item.rating && (
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'text.primary' }}>
              <StarIcon sx={{ fontSize: 18, color: '#F5B945' }} />
              {item.rating.toFixed(1)}
            </Box>
          )}
          {item.year && <span>{item.year}</span>}
          <span>{item.type === 'tv' ? 'TV series' : 'Movie'}</span>
        </Box>

        {item.overview && (
          <Typography
            sx={{
              mt: 2,
              maxWidth: 560,
              display: '-webkit-box',
              WebkitLineClamp: { xs: 3, md: 4 },
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
            }}
          >
            {item.overview}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 3 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to={`/${item.type}/${item.id}`}
            startIcon={<InfoOutlinedIcon />}
          >
            More info
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="inherit"
            onClick={() => toggle(item)}
            startIcon={saved ? <BookmarkAddedIcon /> : <BookmarkAddOutlinedIcon />}
            sx={{ borderColor: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(8,9,13,0.4)' }}
          >
            {saved ? 'In My Watchlist' : 'Add to My Watchlist'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
