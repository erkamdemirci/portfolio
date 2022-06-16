import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import Image from 'next/image';
import { motion } from 'framer-motion';

const StyledHeaderTitle = styled.section`
  height: calc(100vh - 10rem);
  text-align: center;
  width: 90vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .ed-header-container {
    align-self: center;
    justify-self: center;

    margin-top: -5rem;
  }

  .header-name {
    .ed-shift-line {
      margin: 0;
      overflow: hidden;
    }
    h1 {
      font-size: 5.5rem;
      font-weight: 800;
      margin: 0;
      overflow: hidden;
    }
  }

  .header-desc {
    display: flex;
    flex-direction: column;

    span {
      font-size: 4rem;
      font-weight: 200;
    }

    .based {
      font-weight: 700;
      font-size: 2rem;
      margin-top: 20px;
    }
  }

  .ed-animated {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    margin: 20px auto;
    gap: 10px;
  }

  .ed-animated__text {
    min-height: 40px;
    font-size: 1.5rem;
    font-weight: 200;
    width: fit-content;
    margin: 0 auto;
    padding: 5px 10px;
    color: white;
  }
  .animated-lib__image {
    position: relative;
    height: 4.5rem;
    justify-self: flex-end;
  }

  @media screen and (max-width: 992px) {
    height: calc(100vh - 5rem);

    .header-name {
      h1 {
        font-size: 2.672rem;
        font-weight: 800;
        margin: 0;
      }
    }

    .header-desc {
      display: flex;
      flex-direction: column;
      line-height: 45px;

      span {
        font-size: 2.5rem;
        font-weight: 200;
      }

      .based {
        font-weight: 700;
        font-size: 1.25rem;
        margin-top: 10px;
      }
    }

    .ed-animated__text {
      min-height: 30px;
      font-size: 1.25rem;
      padding: 2.5px 5px;
    }

    .animated-lib__image {
      height: 3.5rem;
    }
  }
`;

const placeholderArr = [
  'React.js            ',
  'Node.js            ',
  'Next.js            ',
  'styled-components            ',
  'Javascript            ',
  'React.js            ',
  'MongoDB            ',
  'Express.js            '
];
const libraryImages = [
  'react.webp',
  'nodejs.png',
  'nextjs.png',
  'styled-components.png',
  'javascript.png',
  'react.webp',
  'mongodb.png',
  'expressjs.png'
];
const libColors = ['#00D8FF', '#333333', '#000', '#FCBC2E', '#F6DF1D', '#00D8FF', '#412E1F', '#000'];
let counter = 0;
let placeholderItem = placeholderArr[counter];

const AnimatedText = ({ ...passedProps }) => {
  const [placeholder, setPlaceholder] = useState('');
  const [libImage, setLibImage] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const intr = setInterval(
      () => {
        setPlaceholder(placeholderItem.slice(0, placeholderIndex));
        if (placeholderIndex + 1 > placeholderItem.length) {
          setPlaceholderIndex(0);
          counter += 1;
          if (counter > placeholderArr.length - 1) counter = 0;

          placeholderItem = placeholderArr[counter];
        } else {
          setPlaceholderIndex(placeholderIndex + 1);
        }
      },
      placeholderIndex === 0 ? 0 : Math.floor(Math.random() * 20 * (25 - libraryImages[counter].length)) + 40
    );
    return () => {
      clearInterval(intr);
    };
  });

  return (
    <div className="ed-animated">
      <motion.div
        className="animated-lib__image"
        key={libraryImages[counter]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75 }}
      >
        <Image src={`/images/${libraryImages[counter]}`} objectFit="contain" layout="fill" alt="" />{' '}
      </motion.div>

      <span style={{ background: `${libColors[counter]}` }} {...passedProps}>
        {placeholder}
      </span>
    </div>
  );
};

const HeaderTitle: NextPage = () => {
  return (
    <StyledHeaderTitle id="home">
      <div className="ed-header-container">
        <div className="header-name">
          <div className="ed-shift-line">
            <h1>Erkam Demirci</h1>
          </div>
        </div>
        <div className="header-info-wrapper">
          <div className="header-desc">
            <span>Freelance</span>
            <span> Full-Stack Web Developer</span>
            <span className="based">Based in Turkey 🇹🇷</span>
          </div>

          <div>
            <AnimatedText className="ed-animated__text" />
          </div>
        </div>
      </div>
    </StyledHeaderTitle>
  );
};

export default HeaderTitle;
