import { FieldAttributes } from 'formik';

export interface IInput
  extends FieldAttributes<any>,
    React.InputHTMLAttributes<HTMLInputElement> {}

export interface ISelect
  extends React.HtmlHTMLAttributes<HTMLSelectElement>,
    FieldAttributes<any> {
  options?: ISelectedOption[];
}

export interface ISelectedOption<T = string> {
  value: T;
  label: string;
}

export interface IField {
  name: string;
  label: string;
  isRequired: boolean;
  type: string;
  fieldProps?: unknown;
}

export interface IInputField extends IField {
  type: 'input';
  fieldProps: IInput;
}

export interface ISelectField<T = string> extends IField {
  type: 'select';
  fieldProps: ISelect & {
    options: ISelectedOption<T>[];
  };
}
