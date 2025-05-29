'use client';

import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Typography, DialogProps } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

type Props = Omit<DialogProps, 'onClose'> & {
  title: string;
  actions?: React.ReactNode;
  onClose: () => void;
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
}));

export const Modal: React.FC<Props> = ({ title, children, actions, onClose, ...props }) => {
  return (
    <StyledDialog 
      {...props} 
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          onClose();
        }
      }}
    >
      <StyledDialogTitle>
        <Typography variant="h6">{title}</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </StyledDialog>
  );
}; 