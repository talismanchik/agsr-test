'use client';

import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardHeader, CardActions, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

type Props = MuiCardProps & {
  title?: React.ReactNode;
  actions?: React.ReactNode;
};

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}));

export const Card: React.FC<Props> = ({ title, children, actions, ...props }) => {
  return (
    <StyledCard {...props}>
      {title && (
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
      )}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </StyledCard>
  );
}; 