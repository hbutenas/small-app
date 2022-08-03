import * as Yup from 'yup';

const validationErrors = {
  required: 'This field is required.',
  min: 'This field must be at least :1 characters long.',
  max: 'This field  must be less than :1 characters long.',
  email: 'This field must be a valid email.',
  matches: 'This field is not valid.',
  invalidCredentials: 'These credentials do not match our records.',
};

export const validationError = (
  rule: keyof typeof validationErrors,
  ...props: Array<string | number>
) => {
  const errorMessage = validationErrors[rule];
  return props.reduce(
    (acc: string, prop, index) => acc.replace(`:${index + 1}`, prop.toString()),
    errorMessage
  );
};

const emailValidationRule = () =>
  Yup.string()
    .email(validationError('email'))
    .required(validationError('required'))
    .min(3, validationError('min', 3))
    .max(255, validationError('max', 255));

const commonValidationRule = () =>
  Yup.string()
    .required(validationError('required'))
    .min(3, validationError('min', 3))
    .max(255, validationError('max', 255));

const passwordValidationRule = () =>
  Yup.string()
    .required(validationError('required'))
    .min(8, validationError('min', 8))
    .max(255, validationError('max', 255));

const availableValidations = {
  common: commonValidationRule,
  email: emailValidationRule,
  password: passwordValidationRule,
};

const validate = (validationRule: keyof typeof availableValidations) =>
  availableValidations[validationRule]();

export default validate;
