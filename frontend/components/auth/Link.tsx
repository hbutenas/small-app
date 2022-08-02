import React from 'react';
import NextLink from 'next/link';

type LinkProps = {
  href: string;
  children: React.ReactNode;
};

function Link({ href, children }: LinkProps) {
  return (
    <NextLink href={href}>
      <a className="link block">{children}</a>
    </NextLink>
  );
}

export default Link;
