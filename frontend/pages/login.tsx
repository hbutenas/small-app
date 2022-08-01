import React from 'react';
import { Formik, Form } from 'formik';

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
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse" style={{width: "35%"}}>
          <div className="card w-full max-w flex-shrink-0 bg-base-100 shadow-2xl">
            <div className="card-body">
              <h1 className="text-4xl font-bold">Login now!</h1>
              <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={() => {}}
              >
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
        </div>
      </div>
    </>
  );
}

export default Login;
