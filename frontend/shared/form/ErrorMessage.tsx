import React from 'react';
import { ErrorMessage as FormikErrorMessage } from 'formik';

type ErrorMessageProps = {
  name: string;
};

function ErrorMessage({ name }: ErrorMessageProps) {
  return (
    <FormikErrorMessage
      name={name}
      className="mt-1 text-sm text-danger-700 dark:text-danger-500"
      component="p"
    />
  );
}

export default ErrorMessage;
