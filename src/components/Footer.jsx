import { Box, Link, Typography } from '@mui/material';
import { APP_NAME } from '../config';

export default function Footer() {
  return (
    <Box component="footer" sx={{ px: { xs: 2, md: 4 }, py: 4, borderTop: '1px solid', borderColor: 'divider', color: 'text.secondary' }}>
      <Typography variant="body2" sx={{ maxWidth: 720 }}>
        {APP_NAME} uses the{' '}
        <Link href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" color="inherit" underline="always">
          TMDB
        </Link>{' '}
        API for all movie and TV data and images. This product is not endorsed or certified by TMDB.
      </Typography>
    </Box>
  );
}
