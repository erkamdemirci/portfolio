import type { NextPage } from 'next';
import React from 'react';
import Navigation from './navigation';

interface Props {
  children: React.ReactNode;
}

const Layout: NextPage<Props> = (props) => {
  return (
    <>
      <Navigation />
      <main>{props.children}</main>
    </>
  );
};

export default Layout;
