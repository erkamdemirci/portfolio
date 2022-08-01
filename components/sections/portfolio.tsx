import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import Image from 'next/image';

const StyledPortfolio = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid black;

  .ed-tagline-container {
    width: 90%;
  }

  .portfolio-item {
    border-bottom: 1px solid lightgray;
    width: fit-content;
    padding-bottom: 20px;
  }

  .portfolio-item:last-child {
    border-bottom: none;
  }

  h1 {
    font-size: 3.5rem;
    margin: 0;
    padding: 0;
  }

  h3 > a {
    color: gray;
    font-weight: 800;
  }

  .image-container {
    display: flex;
    flex-direction: row;
    gap: 10px;

    .animated-lib__image {
      position: relative;
      height: 3rem;
      width: 3rem;
      display: flex;
      margin-top: 20px;

      img {
        width: 100px;
        height: 100px;
      }
    }
  }

  @media screen and (max-width: 992px) {
    h1 {
      font-size: 2.5rem;
    }
  }

  @media screen and (max-width: 576px) {
    height: inherit;
    padding: 50px 0;
    h1 {
      font-size: 1rem;
    }
  }

  @media screen and (max-width: 992px) {
    height: calc(100dvh - 5rem);

    .animated-lib__image {
      height: 3.5rem;
    }
  }
`;

const libraryImages = [
  'react.webp',
  'nodejs.png',
  'nextjs.png',
  'styled-components.png',
  'javascript.png',
  'react.webp',
  'mongodb.png',
  'expressjs.png',
  'tailwind.png',
  'typescript.png'
];

const Portfolio: NextPage = () => {
  return (
    <StyledPortfolio id="me">
      <div className="ed-tagline-container">
        <h1>Projects</h1>
        <div className="portfolio-item">
          <h3>
            <Image src={`/images/link.png`} width={15} height={15} alt="" />{' '}
            <a href="https://www.tarifinefis.com" rel="noreferrer" target="_blank">
              tarifinefis.com
            </a>{' '}
            - Recipes Website, FullStack
          </h3>
          <span>React / Next.js, Node.js / Express, MongoDB</span>
          <div className="image-container">
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[0]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[1]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[7]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[3]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[6]}`} objectFit="contain" layout="fill" alt="" />
            </div>
          </div>
        </div>
        <div className="portfolio-item">
          <h3>
            <Image src={`/images/link.png`} width={15} height={15} alt="" />{' '}
            <a href="https://www.stabit.ae" rel="noreferrer" target="_blank">
              Stabit
            </a>{' '}
            - Crypto Exchange, Frontend
          </h3>
          <span>React / Next.js, Tailwind, Typescript</span>
          <div className="image-container">
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[0]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[8]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[9]}`} objectFit="contain" layout="fill" alt="" />
            </div>
          </div>
        </div>
        <div className="portfolio-item">
          <h3>
            <Image src={`/images/link.png`} width={15} height={15} alt="" />{' '}
            <a href="https://eventsproject.vercel.app/" rel="noreferrer" target="_blank">
              Events App
            </a>{' '}
            - Challenge, Fullstack
          </h3>
          <span>React / Next.js, Tailwind, Node.js / Express, MongoDB</span>
          <div className="image-container">
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[0]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[8]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[1]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[7]}`} objectFit="contain" layout="fill" alt="" />
            </div>
            <div className="animated-lib__image">
              <Image src={`/images/${libraryImages[6]}`} objectFit="contain" layout="fill" alt="" />
            </div>
          </div>
        </div>
      </div>
    </StyledPortfolio>
  );
};

export default Portfolio;
