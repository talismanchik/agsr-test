'use client';

import { Box, TextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  select?: boolean;
  children?: React.ReactNode;
};

type Props = {
  fields: Field[];
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
  errors?: Record<string, string>;
};

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
  },
}));

const FormField: React.FC<Field & { 
  value: string;
  error?: boolean;
  helperText?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ select, children, ...props }) => {
  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      select={select}
      {...props}
    >
      {select && children}
    </StyledTextField>
  );
};

export const Form: React.FC<Props> = ({ fields, values, onChange, errors = {} }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 1 }}>
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