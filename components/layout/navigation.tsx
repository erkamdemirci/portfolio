import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import Link from 'next/link';

const StyledNavigation = styled.header<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: all 0.3s ease;
  background: ${({ scrolled }) => (scrolled ? 'rgba(255, 255, 255, 0.9)' : 'transparent')};
  backdrop-filter: ${({ scrolled }) => (scrolled ? 'blur(20px)' : 'none')};
  border-bottom: ${({ scrolled }) => (scrolled ? '1px solid rgba(0, 0, 0, 0.06)' : 'none')};

  .nav-container {
    width: 90%;
    max-width: 1400px;
    margin: 0 auto;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-logo {
    font-size: 1.25rem;
    font-weight: 700;
    color: #000;
    text-decoration: none;
    letter-spacing: -0.5px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 40px;
  }

  .nav-link {
    font-size: 0.9375rem;
    font-weight: 500;
    color: #555;
    text-decoration: none;
    transition: color 0.2s ease;
    position: relative;

    &:hover {
      color: #000;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: #000;
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }

  .nav-cta {
    display: inline-flex;
    align-items: center;
    padding: 10px 24px;
    background: #000;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 100px;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      background: #222;
      transform: translateY(-2px);
    }
  }

  .mobile-toggle {
    display: none;
    flex-direction: column;
    gap: 6px;
    padding: 8px;
    background: none;
    border: none;
    cursor: pointer;

    span {
      display: block;
      width: 24px;
      height: 2px;
      background: #000;
      transition: all 0.3s ease;
    }

    &.active {
      span:nth-child(1) {
        transform: rotate(45deg) translate(6px, 6px);
      }
      span:nth-child(2) {
        opacity: 0;
      }
      span:nth-child(3) {
        transform: rotate(-45deg) translate(6px, -6px);
      }
    }
  }

  .mobile-menu {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;

    &.active {
      opacity: 1;
      visibility: visible;
    }

    .mobile-link {
      font-size: 2rem;
      font-weight: 600;
      color: #000;
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: #667eea;
      }
    }

    .mobile-cta {
      margin-top: 24px;
      padding: 16px 40px;
      background: #000;
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 100px;
      text-decoration: none;
    }

    .mobile-social {
      display: flex;
      gap: 24px;
      margin-top: 48px;

      a {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border-radius: 50%;
        color: #000;
        transition: all 0.3s ease;

        &:hover {
          background: #000;
          color: #fff;
        }

        svg {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .nav-container {
      height: 70px;
    }

    .nav-links {
      display: none;
    }

    .mobile-toggle {
      display: flex;
      z-index: 101;
    }

    .mobile-menu {
      display: flex;
    }
  }
`;

const Navigation: NextPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <StyledNavigation scrolled={scrolled}>
      <div className="nav-container">
        <Link href="/">
          <a className="nav-logo">ED</a>
        </Link>

        <nav className="nav-links">
          <a href="#work" className="nav-link">Work</a>
          <a href="#about" className="nav-link">About</a>
          <Link href="/about">
            <a className="nav-link">Resume</a>
          </Link>
          <a href="#footer" className="nav-cta">Contact</a>
        </nav>

        <button
          className={`mobile-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
          <a href="#work" className="mobile-link" onClick={closeMenu}>Work</a>
          <a href="#about" className="mobile-link" onClick={closeMenu}>About</a>
          <Link href="/about">
            <a className="mobile-link" onClick={closeMenu}>Resume</a>
          </Link>
          <a href="#footer" className="mobile-cta" onClick={closeMenu}>Contact</a>

          <div className="mobile-social">
            <a
              href="https://www.linkedin.com/in/erkamdemirci"
              target="_blank"
              rel="noopener noreferrer"
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
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </StyledNavigation>
  );
};

export default Navigation;
