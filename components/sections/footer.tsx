import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledFooter = styled.footer`
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(180deg, #000 0%, #0a0a0a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 120px 24px;
  position: relative;
  overflow: hidden;

  .footer-content {
    width: 100%;
    max-width: 800px;
    text-align: center;
    z-index: 1;
  }

  .cta-label {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #666;
    margin-bottom: 24px;
  }

  .cta-heading {
    font-size: 3.5rem;
    font-weight: 700;
    margin: 0 0 24px 0;
    line-height: 1.2;
    background: linear-gradient(135deg, #fff 0%, #ccc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cta-subtext {
    font-size: 1.25rem;
    color: #888;
    margin: 0 0 48px 0;
    line-height: 1.6;
  }

  .email-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
    text-decoration: none;
    padding: 20px 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 100px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-bottom: 64px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
    }

    svg {
      width: 24px;
      height: 24px;
    }
  }

  .social-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    margin-bottom: 48px;
  }

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    color: #fff;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-4px);
    }

    svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }
  }

  .footer-bottom {
    text-align: center;
    padding-top: 48px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    width: 100%;
    max-width: 800px;
  }

  .copyright {
    font-size: 0.875rem;
    color: #666;

    a {
      color: #888;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #fff;
      }
    }
  }

  .background-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    filter: blur(150px);
    opacity: 0.1;
    pointer-events: none;
  }

  .glow-footer {
    bottom: -300px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  @media screen and (max-width: 992px) {
    padding: 80px 24px;

    .cta-heading {
      font-size: 2.5rem;
    }

    .cta-subtext {
      font-size: 1.1rem;
    }

    .email-link {
      font-size: 1.25rem;
      padding: 16px 32px;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 60px 20px;
    min-height: auto;

    .cta-label {
      font-size: 0.75rem;
    }

    .cta-heading {
      font-size: 2rem;
    }

    .cta-subtext {
      font-size: 1rem;
      margin-bottom: 32px;
    }

    .email-link {
      font-size: 1rem;
      padding: 14px 28px;
      margin-bottom: 48px;
      width: 100%;
      justify-content: center;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .social-links {
      gap: 16px;
    }

    .social-link {
      width: 48px;
      height: 48px;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .footer-bottom {
      padding-top: 32px;
    }
  }
`;

const Footer: NextPage = () => {
  return (
    <StyledFooter id="footer">
      <div className="background-glow glow-footer" />

      <motion.div
        className="footer-content"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="cta-label">Get in Touch</p>

        <h2 className="cta-heading">
          Let&apos;s build something great together
        </h2>

        <p className="cta-subtext">
          Have a project in mind? I&apos;d love to hear about it.
          <br />
          Drop me a message and let&apos;s create something amazing.
        </p>

        <a href="mailto:hello@erkamdemirci.com" className="email-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          hello@erkamdemirci.com
        </a>

        <div className="social-links">
          <a
            href="https://www.linkedin.com/in/erkamdemirci"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
          <a
            href="https://github.com/erkamdemirci"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="GitHub"
          >
            <svg viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            href="https://erkamdemirci.notion.site/Erkam-Demirci-ace3e69684604e8ab97071c304ebcb6d"
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Resume"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </a>
        </div>
      </motion.div>

      <div className="footer-bottom">
        <p className="copyright">
          © {new Date().getFullYear()} Erkam Demirci. All rights reserved.
        </p>
      </div>
    </StyledFooter>
  );
};

export default Footer;
