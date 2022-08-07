import React, { ReactElement } from 'react';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useSession, signIn } from 'next-auth/react';

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
  const { status } = useSession();
  const router = useRouter();
  const { error } = router.query;

  if (status === 'authenticated') router.replace('/');

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={{ email: '', password: '' }}
      onSubmit={(values, { setErrors }) => {
        signIn('credentials', values);
      }}
    >
      <Form className="space-y-4">
        <Head title="Login" description="Login" />
        <Fields fields={fields} />
        <Button
          isLoading={status === 'loading'}
          disabled={status === 'loading'}
        >
          Login
        </Button>
        <Link href="/register">New Member?</Link>
        {error && (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>These Credentials doesn&apos;t match our records.</span>
            </div>
          </div>
        )}
      </Form>
    </Formik>
  );
};

Login.getLayout = (page: ReactElement) => (
  <AuthLayout heading="Login Now!">{page}</AuthLayout>
);

export default Login;
