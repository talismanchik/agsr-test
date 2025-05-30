import { Box } from '@mui/material';
import { Button, Modal } from './index';

type BaseModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  onSubmit?: () => void;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export const BaseModal = ({
  open,
  onClose,
  title,
  onSubmit,
  submitText = 'Сохранить',
  cancelText = 'Отмена',
  isLoading = false,
  children,
  maxWidth = 'sm',
}: BaseModalProps) => {
  const showActions = Boolean(onSubmit) || Boolean(onClose);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      maxWidth={maxWidth}
      actions={null}
    >
      {children}
      {showActions && (
        <Box mt={2} display="flex" gap={2}>
          {onSubmit && (
            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={isLoading}
            >
              {submitText}
            </Button>
          )}
          <Button variant="outlined" onClick={onClose}>
            {cancelText}
          </Button>
        </Box>
      )}
    </Modal>
  );
}; 