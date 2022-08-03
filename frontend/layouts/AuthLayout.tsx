import React from 'react';

type AuthLayoutProps = {
  heading: string;
  children: React.ReactNode;
};

function AuthLayout({ heading, children }: AuthLayoutProps) {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="card w-full bg-base-100 shadow-2xl">
          <div className="card-body">
            <h1 className="text-4xl font-bold">{heading}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
