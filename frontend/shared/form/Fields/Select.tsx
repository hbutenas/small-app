import React from 'react';
import { Field } from 'formik';
import clsx from 'clsx';

import { ISelect } from 'interfaces';

interface SelectProps extends ISelect {
  hasError: boolean;
}

function Select({ hasError, options, ...props }: SelectProps) {
  return (
    <Field
      {...props}
      as="select"
      className={clsx('w-full', {
        'border-danger-700 dark:border-danger-500': hasError,
      })}
    >
      <option value="">Select an option</option>
      {options?.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Field>
  );
}

export default Select;
