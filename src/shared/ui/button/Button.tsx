'use client';

import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type Props = MuiButtonProps;

const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 16px',
  '&.MuiButton-contained': {
    boxShadow: 'none',
    '&:hover': {
      boxShadow: 'none',
    },
  },
}));

export const Button = ({ children, ...props }: Props) => {
  return <StyledButton {...props}>{children}</StyledButton>;
}; 