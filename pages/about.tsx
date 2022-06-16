import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import Hi from '../components/sections/hi';
import Footer from '../components/sections/footer';

const About: NextPage = () => {
  return (
    <>
      <Hi />
      <Footer />
    </>
  );
};

export default About;
