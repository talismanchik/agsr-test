import { BaseModal } from '@/shared/ui';
import { Form } from '@/shared/ui';
import { useForm } from '@/shared/lib/hooks/useForm';

interface CreateListModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  isLoading: boolean;
}

type FormValues = {
  title: string;
};

const initialValues: FormValues = {
  title: '',
};

const validationRules = {
  title: (value: string) => !value ? 'Название обязательно' : undefined,
};

export const CreateListModal = ({ open, onClose, onSubmit, isLoading }: CreateListModalProps) => {
  const {
    values,
    errors,
    handleChange: formHandleChange,
    handleSubmit,
    reset,
  } = useForm<FormValues>({
    initialValues,
    validationRules,
    onSubmit: (data) => {
      onSubmit(data.title);
      reset();
      onClose();
    },
  });

  const handleChange = (name: string, value: string) => {
    formHandleChange(name as keyof FormValues, value);
  };

  return (
    <BaseModal
      open={open}
      onClose={() => {
        reset();
        onClose();
      }}
      title="Создать новый список"
      onSubmit={handleSubmit}
      submitText="Создать"
      isLoading={isLoading}
    >
      <Form
        fields={[
          { name: 'title', label: 'Название', required: true },
        ]}
        values={values}
        onChange={handleChange}
        errors={errors}
      />
    </BaseModal>
  );
}; 