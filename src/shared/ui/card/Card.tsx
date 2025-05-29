'use client';

import { Card as MuiCard, CardProps as MuiCardProps, CardContent, CardHeader, CardActions } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface CardProps extends MuiCardProps {
  title?: string;
  actions?: React.ReactNode;
}

const StyledCard = styled(MuiCard)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
}));

export const Card = ({ title, children, actions, ...props }: CardProps) => {
  return (
    <StyledCard {...props}>
      {title && <CardHeader title={title} />}
      <CardContent>{children}</CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </StyledCard>
  );
}; 