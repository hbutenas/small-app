import React from 'react';
import { Formik, Form } from 'formik';

import Illustration from 'assets/svg/login.svg';
import { Fields } from 'shared/form';
import { TField } from 'types';
import Link from 'next/link';

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

function Login() {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-6 space-y-4 md:grid-cols-2">
      <div className="flex items-center justify-center bg-base-300 p-4">
        <Illustration className="max-w-md" />
      </div>
      <div className="container flex flex-col space-y-4 pb-4">
        <h1 className="text-3xl font-bold md:text-4xl">
          Login to your Account<span className="text-primary">.</span>
        </h1>
        <Formik initialValues={{ email: '', password: '' }} onSubmit={() => {}}>
          <Form className="space-y-4">
            <Fields fields={fields} />
            <button
              type="submit"
              className="btn btn-primary btn-block text-lg normal-case"
            >
              Login
            </button>
            <Link href="/forgot-password">
              <a className="link block">Forgot your password?</a>
            </Link>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Login;
