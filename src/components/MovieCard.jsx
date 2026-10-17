import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Chip, IconButton, Tooltip, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import { useWatchlist } from '../context/WatchlistContext';

export default function MovieCard({ item }) {
  const { isSaved, toggle } = useWatchlist();
  const [imageFailed, setImageFailed] = useState(false);
  const saved = isSaved(item.type, item.id);
  const label = saved ? `Remove ${item.title} from My Watchlist` : `Add ${item.title} to My Watchlist`;
  const showPoster = item.poster && !imageFailed;

  return (
    <Box
      sx={{
        position: 'relative',
        '&:hover .poster, &:focus-within .poster': {
          transform: 'scale(1.05)',
          boxShadow: '0 14px 30px rgba(0,0,0,0.65)',
          borderColor: 'rgba(255,255,255,0.35)',
        },
      }}
    >
      <Box
        component={RouterLink}
        to={`/${item.type}/${item.id}`}
        aria-label={`View details for ${item.title}`}
        sx={{ display: 'block', color: 'inherit', textDecoration: 'none', outlineOffset: 4 }}
      >
        <Box
          className="poster"
          sx={{
            position: 'relative',
            aspectRatio: '2 / 3',
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
          }}
        >
          {showPoster ? (
            <Box
              component="img"
              src={item.poster}
              alt={`${item.title} poster`}
              loading="lazy"
              onError={() => setImageFailed(true)}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : (
            // Shown when TMDB has no poster for this title
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                p: 1.5,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <MovieOutlinedIcon />
              <Typography variant="caption" sx={{ lineHeight: 1.3 }}>
                {item.title}
              </Typography>
            </Box>
          )}
          {item.type === 'tv' && (
            <Chip
              label="TV"
              size="small"
              sx={{
                position: 'absolute',
                left: 6,
                top: 6,
                height: 20,
                fontSize: 11,
                fontWeight: 700,
                bgcolor: 'rgba(8,9,13,0.78)',
              }}
            />
          )}
        </Box>

        <Typography variant="body2" noWrap sx={{ mt: 1, fontWeight: 600 }}>
          {item.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <span>{item.year || 'TBA'}</span>
          {item.rating && (
            <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
              <StarIcon sx={{ fontSize: 14, color: '#F5B945' }} />
              {item.rating.toFixed(1)}
            </Box>
          )}
        </Typography>
      </Box>

      {/* Sits beside the link (not inside it) so the markup stays valid and the click never opens the details page */}
      <Tooltip title={saved ? 'Remove from My Watchlist' : 'Add to My Watchlist'}>
        <IconButton
          size="small"
          aria-label={label}
          aria-pressed={saved}
          onClick={() => toggle(item)}
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            color: saved ? 'primary.main' : 'common.white',
            bgcolor: 'rgba(8,9,13,0.72)',
            '&:hover': { bgcolor: 'rgba(8,9,13,0.92)' },
          }}
        >
          {saved ? <BookmarkAddedIcon fontSize="small" /> : <BookmarkAddOutlinedIcon fontSize="small" />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
