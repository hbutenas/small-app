import React from 'react';
import NextHead from 'next/head';

type HeadProps = {
  description: string;
  title?: string;
  children?: React.ReactNode;
};

const makeTitle = (title?: string) =>
  title ? `${title} - Small App` : 'Small App';

function Head({ title, description, children }: HeadProps) {
  return (
    <NextHead>
      <title>{makeTitle(title)}</title>
      <meta name="description" content={description} />
      {children}
    </NextHead>
  );
}

export default Head;
