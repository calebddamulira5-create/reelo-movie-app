import { Box, Typography } from '@mui/material';
import { TOP_BAR_HEIGHT } from '../config';

/** Standard spacing and heading for every page except Home and Details. */
export default function PageContainer({ title, subtitle, actions, children }) {
  return (
    <Box sx={{ px: { xs: 2, md: 4 }, pt: `${TOP_BAR_HEIGHT + 24}px`, pb: 8 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontSize: { xs: 40, md: 56 } }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions}
      </Box>
      {children}
    </Box>
  );
}
