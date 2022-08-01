import React from 'react';

type LabelProps = {
  children: React.ReactNode;
  htmlFor: string;
  isRequired?: boolean;
};

function Label({ children, htmlFor, isRequired = false }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-medium text-base-content">
      {children} {isRequired && <span className="text-error">*</span>}
    </label>
  );
}

export default Label;
