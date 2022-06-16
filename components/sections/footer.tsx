import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

const StyledFooter = styled.section`
  height: 100vh;
  width: 100%;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem;
  gap: 0.5rem;

  .email {
    font-size: 4rem;
    font-weight: 700;
  }

  a {
    margin-right: 20px;
    text-decoration: underline;
  }

  @media screen and (max-width: 992px) {
    padding: 3rem;
    .email {
      font-size: 2.75rem;
      font-weight: 700;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 1rem;
    .email {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
`;

const Footer: NextPage = () => {
  return (
    <StyledFooter id="footer">
      <span>Let&apos;s talk about your project.</span>
      <span className="email">hello@erkamdemirci.com</span>
      <div>
        <a>LinkedIn</a>
        <a>Github</a>
      </div>
    </StyledFooter>
  );
};

export default Footer;
