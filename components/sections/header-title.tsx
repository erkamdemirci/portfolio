import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledHeaderTitle = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding-top: 80px;

  .hero-content {
    width: 90%;
    max-width: 1200px;
    text-align: center;
    z-index: 1;
  }

  .greeting {
    display: inline-block;
    font-size: 1rem;
    font-weight: 500;
    color: #666;
    margin-bottom: 24px;
    padding: 8px 20px;
    background: #f5f5f5;
    border-radius: 100px;
  }

  .hero-name {
    font-size: 5rem;
    font-weight: 800;
    margin: 0 0 24px 0;
    letter-spacing: -2px;
    line-height: 1.1;
    background: linear-gradient(135deg, #000 0%, #333 50%, #000 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-title {
    font-size: 1.5rem;
    font-weight: 400;
    color: #555;
    margin: 0 0 16px 0;
    line-height: 1.6;

    .highlight {
      color: #000;
      font-weight: 600;
    }
  }

  .hero-subtitle {
    font-size: 1.125rem;
    color: #888;
    margin: 0 0 48px 0;
  }

  .cta-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
  }

  .cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    background: #000;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 100px;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background: #222;
      transform: translateY(-2px);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    svg {
      width: 18px;
      height: 18px;
      transition: transform 0.3s ease;
    }

    &:hover svg {
      transform: translateX(4px);
    }
  }

  .cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 16px 32px;
    background: transparent;
    color: #000;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 100px;
    border: 2px solid #e0e0e0;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: #000;
      background: #f9f9f9;
    }
  }

  .scroll-indicator {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #999;
    font-size: 0.75rem;
    letter-spacing: 2px;
    text-transform: uppercase;

    .mouse {
      width: 24px;
      height: 40px;
      border: 2px solid #ccc;
      border-radius: 12px;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 8px;
        background: #999;
        border-radius: 2px;
        animation: scroll 2s ease-in-out infinite;
      }
    }
  }

  @keyframes scroll {
    0%, 100% {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    50% {
      opacity: 0.5;
      transform: translateX(-50%) translateY(8px);
    }
  }

  .background-blur {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.15;
    pointer-events: none;
  }

  .blur-1 {
    top: -200px;
    right: -200px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .blur-2 {
    bottom: -200px;
    left: -200px;
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  @media screen and (max-width: 992px) {
    min-height: 100dvh;
    padding-top: 70px;

    .hero-name {
      font-size: 3.5rem;
      letter-spacing: -1px;
    }

    .hero-title {
      font-size: 1.25rem;
    }

    .cta-group {
      flex-direction: column;
      width: 100%;
      padding: 0 20px;

      a {
        width: 100%;
        justify-content: center;
      }
    }

    .scroll-indicator {
      display: none;
    }

    .background-blur {
      width: 400px;
      height: 400px;
    }
  }

  @media screen and (max-width: 576px) {
    .greeting {
      font-size: 0.875rem;
      padding: 6px 16px;
    }

    .hero-name {
      font-size: 2.5rem;
    }

    .hero-title {
      font-size: 1.1rem;
    }

    .hero-subtitle {
      font-size: 1rem;
    }

    .cta-primary,
    .cta-secondary {
      padding: 14px 28px;
      font-size: 0.9375rem;
    }
  }
`;

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  })
};

const HeaderTitle: NextPage = () => {
  return (
    <StyledHeaderTitle id="home">
      <div className="background-blur blur-1" />
      <div className="background-blur blur-2" />

      <div className="hero-content">
        <motion.span
          className="greeting"
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Full-Stack Developer
        </motion.span>

        <motion.h1
          className="hero-name"
          custom={0.1}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Erkam Demirci
        </motion.h1>

        <motion.p
          className="hero-title"
          custom={0.2}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          I build <span className="highlight">products</span> that people love to use.
          <br />
          Turning complex ideas into elegant digital experiences.
        </motion.p>

        <motion.p
          className="hero-subtitle"
          custom={0.3}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          Based in Turkey — Available for freelance work worldwide
        </motion.p>

        <motion.div
          className="cta-group"
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <a href="#work" className="cta-primary">
            View My Work
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#footer" className="cta-secondary">
            Get in Touch
          </a>
        </motion.div>
      </div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="mouse" />
        <span>Scroll</span>
      </motion.div>
    </StyledHeaderTitle>
  );
};

export default HeaderTitle;
