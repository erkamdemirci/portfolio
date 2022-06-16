import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

const StyledAbout = styled.section`
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid black;

  .ed-tagline-container {
    width: 90%;
  }

  h1 {
    font-size: 3.5rem;
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
`;

const About: NextPage = () => {
  return (
    <StyledAbout id="me">
      <div className="ed-tagline-container">
        <h1>
          Design, strategy, management, <br />
          creative direction, & development are <br />
          my specialities, and I have had nearly a <br />
          decade honing in my skills. In all my <br />
          projects, I find that efficient work-
          <br />
          flows, excellent communication skills
          <br />
          and a dose of self-discipline are key -<br />a strong work ethic has driven my
          <br />
          success in a myriad of specialties.
        </h1>
      </div>
    </StyledAbout>
  );
};

export default About;
