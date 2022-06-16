import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

const StyledHi = styled.section`
  transition-duration: 500ms;
  height: calc(100vh - 10rem);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .ed-tagline-container {
    width: 90%;
  }

  h1 {
    font-size: 5.5rem;
    margin: 0;
  }

  h4 {
    font-size: 2rem;
    font-weight: 600;
  }

  @media screen and (max-width: 992px) {
    height: calc(100dvh - 5rem);
    h1 {
      font-size: 2.5rem;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 50px 0;
    h1 {
      font-size: 2.15rem;
    }

    h4 {
      font-size: 1rem;
      letter-spacing: -0.5px;
    }
  }
`;

const Hi: NextPage = () => {
  return (
    <StyledHi id="me">
      <div className="ed-tagline-container">
        <h1>
          Hi, hello and
          <br />
          welcome stranger
        </h1>
        <h4>
          I&apos;m Erkam Demirci, a full-stack web developer <br />& ui designer working in Bursa, Turkey.
          <br /> I create websites, brand identities,
          <br /> packaging, and everything in-between.
          <br /> I&apos;m passionate about building & designing
          <br /> delightful experiences with the combination
          <br /> of business, marketing and UI/UX
          <br /> design to make customers and users
          <br /> satisfied when they&apos;re using products
          <br /> and services online.
        </h4>
      </div>
    </StyledHi>
  );
};

export default Hi;
