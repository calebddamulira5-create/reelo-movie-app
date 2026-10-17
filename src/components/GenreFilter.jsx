import { Box, Chip } from '@mui/material';

/** Row of genre chips. value is a genre id (number) or '' for "All". */
export default function GenreFilter({ genres, value, onChange }) {
  const options = [{ id: '', name: 'All' }, ...genres];
  return (
    <Box
      role="group"
      aria-label="Filter by genre"
      sx={{
        display: 'flex',
        gap: 1,
        flexWrap: { xs: 'nowrap', md: 'wrap' },
        overflowX: { xs: 'auto', md: 'visible' },
        pb: { xs: 1, md: 0 },
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {options.map((genre) => {
        const selected = value === genre.id;
        return (
          <Chip
            key={genre.id || 'all'}
            label={genre.name}
            clickable
            onClick={() => onChange(genre.id)}
            color={selected ? 'primary' : 'default'}
            variant={selected ? 'filled' : 'outlined'}
            aria-pressed={selected}
            sx={{ flexShrink: 0, fontWeight: 600 }}
          />
        );
      })}
    </Box>
  );
}
