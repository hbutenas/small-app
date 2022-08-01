import React from 'react';
import { Field } from 'formik';

import { IInput } from 'interfaces';
import clsx from 'clsx';

interface InputProps extends IInput {
  hasError?: boolean;
}

function Input({ hasError, className = '', ...props }: InputProps) {
  return (
    <Field
      {...props}
      className={clsx(
        'w-full',
        { 'border-danger-700 dark:border-danger-500': hasError },
        className
      )}
    />
  );
}

export default Input;
