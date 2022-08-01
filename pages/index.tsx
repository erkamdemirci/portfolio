import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import HeaderTitle from '../components/sections/header-title';
import Footer from '../components/sections/footer';
import Me from '../components/sections/me';
import Portfolio from '../components/sections/portfolio';

const Home: NextPage = () => {
  return (
    <>
      <HeaderTitle />
      <Portfolio />
      <Me />
      <Footer />
    </>
  );
};

export default Home;
