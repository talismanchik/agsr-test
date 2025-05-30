import { Box } from '@mui/material';
import { Button, Modal, Form } from '@/shared/ui';
import { useState } from 'react';

interface CreateListModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  isLoading: boolean;
}

export const CreateListModal = ({ open, onClose, onSubmit, isLoading }: CreateListModalProps) => {
  const [formData, setFormData] = useState({ title: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.title) errors.title = 'Название обязательно';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData.title);
    setFormData({ title: '' });
    setFormErrors({});
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Создать новый список"
      actions={null}
    >
      <Form
        fields={[
          { name: 'title', label: 'Название', required: true },
        ]}
        values={formData}
        onChange={handleChange}
        errors={formErrors}
      />
      <Box mt={2} display="flex" gap={2}>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          Создать
        </Button>
        <Button variant="outlined" onClick={onClose}>
          Отмена
        </Button>
      </Box>
    </Modal>
  );
}; 