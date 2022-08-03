import React, { ReactElement } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

import { NextPageWithLayout } from './_app';
import { TField } from 'types';
import { Fields } from 'shared/form';
import AuthLayout from 'layouts/AuthLayout';
import Button from 'components/auth/Button';
import Link from 'components/auth/Link';
import validate from 'utils/validation';
import Head from 'shared/custom/Head';

const fields: TField[] = [
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
];

const validationSchema = Yup.object().shape({
  email: validate('email'),
  password: validate('password'),
});

const Login: NextPageWithLayout = () => {
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ email: '', password: '' }}
      onSubmit={() => {}}
    >
      <Form className="space-y-4">
        <Head title="Login" description="Login" />
        <Fields fields={fields} />
        <Button>Login</Button>
        <Link href="/register">New Member?</Link>
      </Form>
    </Formik>
  );
};

Login.getLayout = (page: ReactElement) => (
  <AuthLayout heading="Login Now!">{page}</AuthLayout>
);

export default Login;
