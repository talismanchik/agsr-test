import { useState, useCallback } from 'react';

type ValidationRules<T> = {
  [K in keyof T]?: (value: T[K]) => string | undefined;
};

type UseFormOptions<T> = {
  initialValues: T;
  validationRules?: ValidationRules<T>;
  onSubmit: (values: T) => void;
};

export const useForm = <T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = useCallback((name: keyof T, value: T[keyof T]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((key) => {
      const fieldKey = key as keyof T;
      const validateField = validationRules[fieldKey];
      if (validateField) {
        const error = validateField(values[fieldKey]);
        if (error) {
          newErrors[fieldKey] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (validate()) {
      onSubmit(values);
    }
  }, [validate, onSubmit, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset,
    validate,
    setValues,
  };
}; 