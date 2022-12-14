import React, { ReactElement } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';

import { NextPageWithLayout } from './_app';
import { TField } from 'types';
import { Fields } from 'shared/form';
import AuthLayout from 'layouts/AuthLayout';
import Button from 'components/auth/Button';
import Link from 'components/auth/Link';
import validate from 'utils/validation';
import Head from 'shared/custom/Head';
import useRegister from 'services/auth/register';
import { useSession } from 'next-auth/react';


const fields: TField[] = [
  {
    isRequired: true,
    type: 'input',
    name: 'name',
    label: 'Name',
    fieldProps: { type: 'text' },
  },
  {
    isRequired: true,
    type: 'input',
    name: 'email',
    label: 'Email',
    fieldProps: { type: 'email' },
  },
  {
    isRequired: true,
    type: 'input',
    name: 'password',
    label: 'Password',
    fieldProps: { type: 'password' },
  },
  {
    isRequired: true,
    type: 'input',
    name: 'passwordConfirmation',
    label: 'Password Confirmation',
    fieldProps: { type: 'password' },
  },
];

const validationSchema = Yup.object().shape({
  name: validate('common'),
  email: validate('email'),
  password: validate('password'),
  passwordConfirmation: validate('password').oneOf(
    [Yup.ref('password')],
    'Passwords must match'
  ),
});

const Register: NextPageWithLayout = () => {
  const { mutate: register, isLoading } = useRegister();
  const { status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') router.replace('/');

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      }}
      onSubmit={(values, { setErrors }) => {
        register(values, {
          onError: (error) => {
            const e = error as AxiosError;
            if (e.response?.status === 422) {
              const data = e.response.data as any;
              setErrors(data.errors);
            }
          },
        });
      }}
    >
      <Form className="space-y-4">
        <Head title="Register" description="Register" />
        <Fields fields={fields} />
        <Button isLoading={isLoading} disabled={isLoading}>
          Register
        </Button>
        <Link href="/login">Have an Account?</Link>
      </Form>
    </Formik>
  );
};

Register.getLayout = (page: ReactElement) => (
  <AuthLayout heading="Register Now!">{page}</AuthLayout>
);

export default Register;
