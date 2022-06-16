import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import HeaderTitle from '../components/sections/header-title';
import Footer from '../components/sections/footer';
import About from '../components/sections/about';

const Home: NextPage = () => {
  return (
    <>
      <HeaderTitle />
      <About />
      <Footer />
    </>
  );
};

export default Home;
