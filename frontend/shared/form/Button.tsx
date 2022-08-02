import clsx from 'clsx';
import React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

function Button({ children, className, isLoading, ...props }: ButtonProps) {
  return (
    <button {...props} className={clsx(className, { loading: isLoading })}>
      {children}
    </button>
  );
}

export default Button;
