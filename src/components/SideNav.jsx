import { NavLink } from 'react-router-dom';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MovieOutlinedIcon from '@mui/icons-material/MovieOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useWatchlist } from '../context/WatchlistContext';
import { APP_NAME, NAV_WIDTH, TOP_BAR_HEIGHT } from '../config';

const LINKS = [
  { label: 'Home', to: '/', icon: <HomeOutlinedIcon />, end: true },
  { label: 'Movies', to: '/movies', icon: <MovieOutlinedIcon /> },
  { label: 'TV Shows', to: '/tv', icon: <LiveTvOutlinedIcon /> },
  { label: 'My Watchlist', to: '/watchlist', icon: <BookmarkBorderIcon />, showCount: true },
];

/** Icon rail on desktop, slide-out drawer on tablet and mobile. */
export default function SideNav({ open, onClose }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { items } = useWatchlist();

  if (isDesktop) {
    return (
      <Drawer
        variant="permanent"
        open
        sx={{
          width: NAV_WIDTH,
          '& .MuiDrawer-paper': {
            width: NAV_WIDTH,
            top: TOP_BAR_HEIGHT,
            height: `calc(100% - ${TOP_BAR_HEIGHT}px)`,
            bgcolor: 'transparent',
            borderRight: '1px solid',
            borderColor: 'divider',
            alignItems: 'center',
            pt: 2,
          },
        }}
      >
        <Box component="nav" aria-label="Main navigation">
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {LINKS.map((link) => (
              <ListItemButton
                key={link.to}
                component={NavLink}
                to={link.to}
                end={link.end}
                sx={{
                  flexDirection: 'column',
                  gap: 0.5,
                  width: NAV_WIDTH - 16,
                  borderRadius: 2,
                  py: 1.25,
                  color: 'text.secondary',
                  '&.active': { color: 'primary.main', bgcolor: 'rgba(229,56,79,0.12)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 0, color: 'inherit', position: 'relative' }}>
                  {link.icon}
                  {link.showCount && items.length > 0 && (
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        top: -6,
                        right: -10,
                        minWidth: 16,
                        height: 16,
                        px: 0.5,
                        borderRadius: 8,
                        bgcolor: 'primary.main',
                        color: 'common.white',
                        fontSize: 11,
                        fontWeight: 700,
                        lineHeight: '16px',
                        textAlign: 'center',
                      }}
                    >
                      {items.length}
                    </Box>
                  )}
                </ListItemIcon>
                <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12, textAlign: 'center', lineHeight: 1.2 }}>
                  {link.label}
                </Typography>
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: 270, bgcolor: 'background.default', backgroundImage: 'none' } }}
    >
      <Toolbar sx={{ height: TOP_BAR_HEIGHT }}>
        <Typography sx={{ fontFamily: '"Bebas Neue", Impact, sans-serif', fontSize: 32, letterSpacing: '0.06em', color: 'primary.main' }}>
          {APP_NAME}
        </Typography>
      </Toolbar>
      <Box component="nav" aria-label="Main navigation">
        <List sx={{ px: 1 }}>
          {LINKS.map((link) => (
            <ListItemButton
              key={link.to}
              component={NavLink}
              to={link.to}
              end={link.end}
              onClick={onClose}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                py: 1.5,
                color: 'text.secondary',
                '&.active': { color: 'primary.main', bgcolor: 'rgba(229,56,79,0.12)' },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{link.icon}</ListItemIcon>
              <ListItemText
                primary={link.showCount && items.length > 0 ? `${link.label} (${items.length})` : link.label}
                slotProps={{ primary: { sx: { fontWeight: 600 } } }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
