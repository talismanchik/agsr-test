'use client';

import { Box, TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
  },
}));

export interface FormFieldProps extends Omit<TextFieldProps, 'variant'> {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}

export interface FormProps {
  fields: FormFieldProps[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  errors?: Record<string, string>;
}

export const FormField = ({ name, label, type = 'text', required = false, ...props }: FormFieldProps) => {
  return (
    <StyledTextField
      fullWidth
      variant="outlined"
      name={name}
      label={label}
      type={type}
      required={required}
      {...props}
    />
  );
};

export const Form = ({ fields, values, onChange, errors = {} }: FormProps) => {
  return (
    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {fields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          value={values[field.name] || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          error={!!errors[field.name]}
          helperText={errors[field.name]}
        />
      ))}
    </Box>
  );
}; 