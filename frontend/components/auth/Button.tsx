import React from 'react';
import MainButton, { ButtonProps } from 'shared/form/Button';

function Button({ children, ...props }: ButtonProps) {
  return (
    <MainButton
      {...props}
      type="submit"
      className="btn btn-primary btn-block text-lg normal-case"
    >
      {children}
    </MainButton>
  );
}

export default Button;
