import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RefreshIcon from '@mui/icons-material/Refresh';

function Message({ icon, title, message, children, compact, role }) {
  return (
    <Box
      role={role}
      sx={{
        textAlign: 'center',
        mx: 'auto',
        maxWidth: 480,
        py: compact ? 3 : 8,
        px: 2,
        color: 'text.secondary',
      }}
    >
      <Box sx={{ color: 'text.secondary', mb: 1, '& svg': { fontSize: compact ? 32 : 48 } }}>{icon}</Box>
      <Typography variant={compact ? 'subtitle1' : 'h6'} component="p" color="text.primary" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {message && (
        <Typography variant="body2" sx={{ mt: 0.5 }}>
          {message}
        </Typography>
      )}
      {children && <Box sx={{ mt: 2 }}>{children}</Box>}
    </Box>
  );
}

export function ErrorState({ message, onRetry, compact = false }) {
  return (
    <Message role="alert" compact={compact} icon={<ErrorOutlineIcon />} title="Something went wrong" message={message}>
      {onRetry && (
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={onRetry}>
          Try again
        </Button>
      )}
    </Message>
  );
}

export function EmptyState({ title, message, actionLabel, to, icon = <SearchOffIcon /> }) {
  return (
    <Message role="status" icon={icon} title={title} message={message}>
      {actionLabel && to && (
        <Button variant="contained" component={RouterLink} to={to}>
          {actionLabel}
        </Button>
      )}
    </Message>
  );
}
