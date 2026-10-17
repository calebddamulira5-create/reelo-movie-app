import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, Skeleton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import { ErrorState } from '../components/StateMessage';
import useFetch from '../hooks/useFetch';
import { getDetails } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import { BG } from '../theme';
import { APP_NAME, TOP_BAR_HEIGHT } from '../config';

const formatRuntime = (minutes) => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
};

export default function Details() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggle } = useWatchlist();

  const { data: item, loading, error, retry } = useFetch(
    () => (type === 'movie' || type === 'tv' ? getDetails(type, id) : Promise.reject(new Error('That page does not exist.'))),
    [type, id],
  );

  useEffect(() => {
    if (item) document.title = `${item.title} | ${APP_NAME}`;
    return () => {
      document.title = APP_NAME;
    };
  }, [item]);

  const padding = { px: { xs: 2, md: 4 }, pt: { xs: `${TOP_BAR_HEIGHT + 16}px`, md: `${TOP_BAR_HEIGHT + 48}px` }, pb: 8 };

  if (loading) {
    return (
      <Box sx={{ ...padding, display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' } }} aria-busy="true">
        <Skeleton variant="rounded" sx={{ width: { xs: 200, md: 300 }, aspectRatio: '2 / 3', height: 'auto', flexShrink: 0 }} />
        <Box sx={{ flex: 1, width: '100%' }}>
          <Skeleton variant="text" sx={{ fontSize: 48, width: '60%' }} />
          <Skeleton variant="text" width="35%" />
          <Skeleton variant="text" />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={padding}>
        <ErrorState message={error} onRetry={retry} />
        <Box sx={{ textAlign: 'center' }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Go back
          </Button>
        </Box>
      </Box>
    );
  }

  const saved = isSaved(item.type, item.id);
  const facts = [
    item.year,
    formatRuntime(item.runtime),
    item.seasons ? `${item.seasons} ${item.seasons === 1 ? 'season' : 'seasons'}` : '',
    item.type === 'tv' ? 'TV series' : 'Movie',
    item.status,
  ].filter(Boolean);

  return (
    <Box sx={{ position: 'relative' }}>
      {item.backdrop && (
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: { xs: 360, md: 560 },
            backgroundImage: `url(${item.backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(to top, ${BG} 4%, rgba(8,9,13,0.6) 70%, rgba(8,9,13,0.8))`,
            },
          }}
        />
      )}

      <Box
        sx={{
          ...padding,
          position: 'relative',
          display: 'flex',
          gap: { xs: 3, md: 5 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Box
          sx={{
            width: { xs: 200, md: 300 },
            flexShrink: 0,
            aspectRatio: '2 / 3',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }}
        >
          {item.poster ? (
            <Box component="img" src={item.poster.replace('/w342/', '/w500/')} alt={`${item.title} poster`} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
              <MovieOutlinedIcon sx={{ fontSize: 56 }} />
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Button startIcon={<ArrowBackIcon />} color="inherit" onClick={() => navigate(-1)} sx={{ mb: 1, ml: -1 }}>
            Back
          </Button>

          <Typography variant="h1" component="h1" sx={{ fontSize: { xs: 44, md: 72 } }}>
            {item.title}
          </Typography>
          {item.tagline && (
            <Typography sx={{ mt: 1, fontStyle: 'italic' }} color="text.secondary">
              {item.tagline}
            </Typography>
          )}

          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mt: 2, color: 'text.secondary', fontWeight: 600 }}>
            {item.rating ? (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, color: 'text.primary' }}>
                <StarIcon sx={{ color: '#F5B945' }} />
                {item.rating.toFixed(1)}
                <Typography component="span" variant="body2" color="text.secondary">
                  ({item.voteCount.toLocaleString()} votes)
                </Typography>
              </Box>
            ) : (
              <span>Not rated yet</span>
            )}
            {facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </Box>

          {item.genres.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }} aria-label="Genres">
              {item.genres.map((genre) => (
                <Chip key={genre} label={genre} variant="outlined" />
              ))}
            </Box>
          )}

          <Typography variant="h6" component="h2" sx={{ mt: 4, mb: 1 }}>
            Overview
          </Typography>
          <Typography sx={{ maxWidth: '68ch', lineHeight: 1.7 }}>
            {item.overview || 'No overview is available for this title yet.'}
          </Typography>

          <Button
            variant={saved ? 'outlined' : 'contained'}
            size="large"
            onClick={() => toggle(item)}
            startIcon={saved ? <BookmarkAddedIcon /> : <BookmarkAddOutlinedIcon />}
            sx={{ mt: 4 }}
          >
            {saved ? 'Remove from My Watchlist' : 'Add to My Watchlist'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
