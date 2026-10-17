import { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { AppBar, Box, IconButton, InputAdornment, TextField, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { APP_NAME, TOP_BAR_HEIGHT } from '../config';

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [scrolled, setScrolled] = useState(false);

  // Top bar becomes solid once the page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Live search: go to the results page 500 ms after the user stops typing
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) return undefined;
    const timer = setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(term)}`, { replace: pathname === '/search' });
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const term = query.trim();
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        height: TOP_BAR_HEIGHT,
        justifyContent: 'center',
        background: scrolled ? 'rgba(8,9,13,0.94)' : 'linear-gradient(to bottom, rgba(8,9,13,0.9), rgba(8,9,13,0))',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        transition: 'background 0.3s ease',
        borderBottom: scrolled ? '1px solid' : 'none',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ gap: 1, px: { xs: 1, md: 3 } }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="Open navigation menu"
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          component={RouterLink}
          to="/"
          aria-label={`${APP_NAME} home`}
          sx={{
            fontFamily: '"Bebas Neue", Impact, sans-serif',
            fontSize: { xs: 30, md: 36 },
            letterSpacing: '0.06em',
            color: 'primary.main',
            textDecoration: 'none',
            lineHeight: 1,
            mr: 'auto',
          }}
        >
          {APP_NAME}
        </Typography>

        <Box component="form" role="search" onSubmit={handleSubmit} sx={{ width: { xs: '100%', sm: 340 }, maxWidth: { xs: 220, sm: 340 } }}>
          <TextField
            fullWidth
            size="small"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles"
            slotProps={{
              htmlInput: { 'aria-label': 'Search movies and TV shows', enterKeyHint: 'search' },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: query ? (
                  <InputAdornment position="end">
                    <IconButton size="small" aria-label="Clear search" edge="end" onClick={() => setQuery('')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: { bgcolor: 'rgba(20,22,28,0.85)', borderRadius: 6 },
              },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
