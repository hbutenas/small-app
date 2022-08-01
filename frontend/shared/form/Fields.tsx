import React from 'react';

import { TField } from 'types';
import Field from './Field';

type FieldsProps = {
  fields: TField[];
};

function Fields({ fields }: FieldsProps) {
  return (
    <>
      {fields.map((field) => (
        <Field key={field.name} {...field} />
      ))}
    </>
  );
}

export default Fields;
