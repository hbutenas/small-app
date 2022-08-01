import React from 'react';
import { useFormikContext } from 'formik';
import get from 'lodash/get';

import { TField } from 'types';
import Label from './Label';
import ErrorMessage from './ErrorMessage';
import Input from './Fields/Input';
import Select from './Fields/Select';

function Field({ name, label, isRequired, type, fieldProps }: TField) {
  const { errors, touched } = useFormikContext<{ [key: string]: string }>();
  const hasError: boolean =
    (get(touched, name) && get(errors, name) !== undefined) || false;

  return (
    <div className="w-full space-y-2">
      <Label isRequired={isRequired} htmlFor={name}>
        {label}
      </Label>
      {type === 'input' && (
        <Input {...fieldProps} name={name} id={name} hasError={hasError} />
      )}
      {type === 'select' && (
        <Select {...fieldProps} name={name} id={name} hasError={hasError} />
      )}
      <ErrorMessage name={name} />
    </div>
  );
}

export default Field;
