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

const Register: NextPageWithLayout = () => {
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ email: '', password: '' }}
      onSubmit={() => {}}
    >
      <Form className="space-y-4">
        <Head title="Register" description="Register" />
        <Fields fields={fields} />
        <Button>Register</Button>
        <Link href="/login">Have an Account?</Link>
      </Form>
    </Formik>
  );
};

Register.getLayout = (page: ReactElement) => (
  <AuthLayout heading="Register Now!">{page}</AuthLayout>
);

export default Register;
