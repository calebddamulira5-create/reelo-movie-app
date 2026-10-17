import { createTheme } from '@mui/material/styles';

export const BG = '#08090D';
export const ACCENT = '#E5384F';

const display = {
  fontFamily: '"Bebas Neue", Impact, "Arial Narrow", sans-serif',
  fontWeight: 400,
  letterSpacing: '0.02em',
  lineHeight: 1,
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: ACCENT },
    background: { default: BG, paper: '#14161C' },
    text: { primary: '#F5F5F7', secondary: '#A3A6B0' },
    divider: 'rgba(255,255,255,0.1)',
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Figtree", "Segoe UI", Roboto, Arial, sans-serif',
    h1: display,
    h2: display,
    h3: display,
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: BG },
        '*::-webkit-scrollbar': { width: 10, height: 10 },
        '*::-webkit-scrollbar-thumb': { backgroundColor: '#2A2D36', borderRadius: 8 },
        '*::-webkit-scrollbar-track': { backgroundColor: BG },
        '@media (prefers-reduced-motion: reduce)': {
          '*': { transitionDuration: '0.01ms !important', scrollBehavior: 'auto !important' },
        },
      },
    },
  },
});

export default theme;
