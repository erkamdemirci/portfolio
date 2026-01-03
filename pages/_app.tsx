import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import Layout from '../components/layout/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0" />

        <title>erkamdemirci.com | Freelance Full-Stack Web Developer</title>
        {/* <meta
            name="description"
            content="Türkiye'nin en kullanıcı dostu yemek tarifleri sitesi. Kullanım ve okuma kolaylığı sağlıyor, birbirinden lezzetli tarifler ile yemek maceralarını sosyalleştiriyoruz."
          /> */}
        <meta property="og:title" content="erkamdemirci.com | Freelance Full-Stack Web Developer" />
        {/* <meta
            property="og:description"
            content="Türkiye'nin en kullanıcı dostu yemek tarifleri sitesi. Kullanım ve okuma kolaylığı sağlıyor, birbirinden lezzetli tarifler ile yemek maceralarını sosyalleştiriyoruz."
          /> */}
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </Layout>
  );
}

export default MyApp;
