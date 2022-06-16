import React, { useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

import Image from 'next/image';
import Link from 'next/link';

import { useRouter } from 'next/router';

const StyledNavigation = styled.header`
  z-index: 100;
  .container {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
  }

  .nav-logo {
    position: relative;
    height: 3.5rem;
    aspect-ratio: 2/1;
  }

  .social-icons {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 15px;

    a {
      :hover {
        svg {
          fill: hsl(8, 95%, 57%);
        }
      }
    }
  }

  .menu-icon {
    color: black;
    display: none;
  }

  nav {
    height: 100%;
    display: flex;
    ul > li {
      display: flex;
      align-items: center;
      font-weight: 600;
      a {
        cursor: pointer;
      }
      :hover {
        color: hsl(8, 95%, 57%);
      }
    }
  }

  .ed-navbar-inner {
    width: 100%;
    height: 10rem;
    display: flex;
    align-items: center;
    padding: 0 30px;

    > * {
      flex: 1;
    }

    .ed-nav-default {
      ul {
        display: flex;
        gap: 30px;
      }

      ul > li.active {
        color: hsl(8, 95%, 57%);

        a > span {
          position: relative;
        }
        a > span:after {
          position: absolute;
          bottom: -1rem;
          left: calc(50% - 2.5px);
          width: 5px;
          height: 5px;
          content: '';
          border-radius: 50%;
          background-color: red;
        }
      }

      ul > li {
        text-transform: uppercase;
        font-size: 1rem;
      }
    }
  }

  .ed-side-menu {
    display: none;
  }

  @media screen and (max-width: 992px) {
    .ed-side-menu {
      display: inline;
    }
  }

  @media screen and (max-width: 576px) {
    .nav-logo {
      height: 2.25rem;
      aspect-ratio: 2/1;
    }

    .ed-navbar-inner {
      padding: 0 5px;
      justify-content: space-between;

      > * {
        flex: none;
      }
    }
  }

  @media screen and (max-width: 992px) {
    .ed-navbar-inner {
      height: 5rem;
    }

    .menu-icon {
      display: inline-block;
    }

    .ed-nav-default {
      display: none;
    }

    .social-icons {
      display: flex;
      justify-content: flex-start;
      svg {
        width: 35px;
        height: 35px;
      }
    }

    .ed-side-menu {
      z-index: 100;
      background-color: white;
      border-left: 1px solid lightgray;
      position: fixed;
      top: 0;
      right: 0;
      display: flex;
      overflow: auto;
      height: 100%;
      width: 100%;
      max-width: 30rem;
      padding: 2.125rem 2.0625rem 1.125rem 1.6625rem;
      display: flex;
      flex-direction: column;
      gap: 40px;
      transform: translateX(100%);
      transition-duration: 200ms;

      .social-icons {
        svg {
          width: 40px;
          height: 40px;
        }
      }

      .ed-side-menu__navigation {
        flex-grow: 1;
        nav {
          display: flex;
          flex-direction: column;
          justify-content: center;

          ul > li.active {
            color: hsl(8, 95%, 57%);
          }

          ul > li {
            padding: 15px 0;
            font-size: 1.75rem;
          }
        }
      }

      .ed-side-menu__header {
        display: flex;
        align-items: center;

        .langs {
          display: flex;
          flex-grow: 1;
          gap: 25px;
          font-size: 0.875rem;
          text-transform: uppercase;
        }
      }

      .ed-side-menu__footer {
        font-size: 0.875rem;
        color: hsl(0, 0%, 60%);

        span  {
          color: black;
        }
      }
    }

    .ed-side-menu.show {
      transform: translateX(0);
    }
  }
`;

const Navigation: NextPage = () => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  function handleSideMenu(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    setShowMenu(!showMenu);
  }

  function navMenuClickHandler() {
    setShowMenu(!showMenu);
  }

  return (
    <StyledNavigation>
      <div className="container">
        <div className="ed-navbar-inner">
          <nav className="ed-nav-default">
            <ul>
              <li>
                <Link href="/about">
                  <a onClick={navMenuClickHandler}>About</a>
                </Link>
              </li>
              <li>
                <Link href="https://erkamdemirci.notion.site/Erkam-Demirci-ace3e69684604e8ab97071c304ebcb6d">
                  <a onClick={navMenuClickHandler}>Resume</a>
                </Link>
              </li>
            </ul>
          </nav>
          <button onClick={handleSideMenu} className="menu-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: '35px', width: '35px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <div
            style={{
              transform: `${showMenu ? 'translateX(0%)' : 'translateX(100%)'}`
            }}
            className={`ed-side-menu ${showMenu && 'show'}`}
          >
            <div className="ed-side-menu__header">
              {/* <div className="langs">
                <a>EN</a>
                <a>TR</a>
              </div> */}
              <div className="langs" />
              <button onClick={handleSideMenu} className="menu-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: '30px', width: '30px' }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="ed-side-menu__navigation">
              <nav>
                <ul>
                  <li>
                    <Link href="/about">
                      <a onClick={navMenuClickHandler}>About</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="https://erkamdemirci.notion.site/Erkam-Demirci-ace3e69684604e8ab97071c304ebcb6d">
                      <a onClick={navMenuClickHandler}>Resume</a>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="ed-side-menu__footer">
              <div className="social-icons">
                <a href="https://www.linkedin.com/in/erkamdemirci">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
                    <path d="M 7.5 5 C 6.132813 5 5 6.132813 5 7.5 L 5 24.5 C 5 25.867188 6.132813 27 7.5 27 L 24.5 27 C 25.867188 27 27 25.867188 27 24.5 L 27 7.5 C 27 6.132813 25.867188 5 24.5 5 Z M 7.5 7 L 24.5 7 C 24.785156 7 25 7.214844 25 7.5 L 25 24.5 C 25 24.785156 24.785156 25 24.5 25 L 7.5 25 C 7.214844 25 7 24.785156 7 24.5 L 7 7.5 C 7 7.214844 7.214844 7 7.5 7 Z M 10.4375 8.71875 C 9.488281 8.71875 8.71875 9.488281 8.71875 10.4375 C 8.71875 11.386719 9.488281 12.15625 10.4375 12.15625 C 11.386719 12.15625 12.15625 11.386719 12.15625 10.4375 C 12.15625 9.488281 11.386719 8.71875 10.4375 8.71875 Z M 19.46875 13.28125 C 18.035156 13.28125 17.082031 14.066406 16.6875 14.8125 L 16.625 14.8125 L 16.625 13.5 L 13.8125 13.5 L 13.8125 23 L 16.75 23 L 16.75 18.3125 C 16.75 17.074219 16.996094 15.875 18.53125 15.875 C 20.042969 15.875 20.0625 17.273438 20.0625 18.375 L 20.0625 23 L 23 23 L 23 17.78125 C 23 15.226563 22.457031 13.28125 19.46875 13.28125 Z M 9 13.5 L 9 23 L 11.96875 23 L 11.96875 13.5 Z"></path>
                  </svg>
                </a>
                <a href="https://github.com/erkamdemirci">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 48 48">
                    <path d="M 24 4 C 12.972066 4 4 12.972074 4 24 C 4 35.027926 12.972066 44 24 44 C 35.027934 44 44 35.027926 44 24 C 44 12.972074 35.027934 4 24 4 z M 24 7 C 33.406615 7 41 14.593391 41 24 C 41 31.66536 35.956939 38.122519 29 40.251953 L 29 35.136719 C 29 33.226635 27.899316 31.588619 26.308594 30.773438 A 10 8 0 0 0 32.4375 18.720703 C 32.881044 17.355414 33.376523 14.960672 32.199219 13.076172 C 29.929345 13.076172 28.464667 14.632086 27.765625 15.599609 A 10 8 0 0 0 24 15 A 10 8 0 0 0 20.230469 15.59375 C 19.529731 14.625773 18.066226 13.076172 15.800781 13.076172 C 14.449711 15.238817 15.28492 17.564557 15.732422 18.513672 A 10 8 0 0 0 21.681641 30.779297 C 20.3755 31.452483 19.397283 32.674042 19.097656 34.15625 L 17.783203 34.15625 C 16.486203 34.15625 15.98225 33.629234 15.28125 32.740234 C 14.58925 31.851234 13.845172 31.253859 12.951172 31.005859 C 12.469172 30.954859 12.144453 31.321484 12.564453 31.646484 C 13.983453 32.612484 14.081391 34.193516 14.650391 35.228516 C 15.168391 36.160516 16.229687 37 17.429688 37 L 19 37 L 19 40.251953 C 12.043061 38.122519 7 31.66536 7 24 C 7 14.593391 14.593385 7 24 7 z"></path>
                  </svg>
                </a>
              </div>
              <span>hello@erkamdemirci.com</span>
              <p>
                © 2022 - All Rights Reserved.
                <br />
                Development by <span className="">Erkam Demirci</span>.
              </p>
            </div>
          </div>
          <Link href="/">
            <a className="nav-logo">
              <Image src={'/images/ed2.png'} layout={'fill'} objectFit={'contain'} alt="erkamdemirci.com | Freelance Full-Stack Web Developer" />
            </a>
          </Link>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/erkamdemirci">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 32 32">
                <path d="M 7.5 5 C 6.132813 5 5 6.132813 5 7.5 L 5 24.5 C 5 25.867188 6.132813 27 7.5 27 L 24.5 27 C 25.867188 27 27 25.867188 27 24.5 L 27 7.5 C 27 6.132813 25.867188 5 24.5 5 Z M 7.5 7 L 24.5 7 C 24.785156 7 25 7.214844 25 7.5 L 25 24.5 C 25 24.785156 24.785156 25 24.5 25 L 7.5 25 C 7.214844 25 7 24.785156 7 24.5 L 7 7.5 C 7 7.214844 7.214844 7 7.5 7 Z M 10.4375 8.71875 C 9.488281 8.71875 8.71875 9.488281 8.71875 10.4375 C 8.71875 11.386719 9.488281 12.15625 10.4375 12.15625 C 11.386719 12.15625 12.15625 11.386719 12.15625 10.4375 C 12.15625 9.488281 11.386719 8.71875 10.4375 8.71875 Z M 19.46875 13.28125 C 18.035156 13.28125 17.082031 14.066406 16.6875 14.8125 L 16.625 14.8125 L 16.625 13.5 L 13.8125 13.5 L 13.8125 23 L 16.75 23 L 16.75 18.3125 C 16.75 17.074219 16.996094 15.875 18.53125 15.875 C 20.042969 15.875 20.0625 17.273438 20.0625 18.375 L 20.0625 23 L 23 23 L 23 17.78125 C 23 15.226563 22.457031 13.28125 19.46875 13.28125 Z M 9 13.5 L 9 23 L 11.96875 23 L 11.96875 13.5 Z"></path>
              </svg>
            </a>
            <a href="https://github.com/erkamdemirci">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 48 48">
                <path d="M 24 4 C 12.972066 4 4 12.972074 4 24 C 4 35.027926 12.972066 44 24 44 C 35.027934 44 44 35.027926 44 24 C 44 12.972074 35.027934 4 24 4 z M 24 7 C 33.406615 7 41 14.593391 41 24 C 41 31.66536 35.956939 38.122519 29 40.251953 L 29 35.136719 C 29 33.226635 27.899316 31.588619 26.308594 30.773438 A 10 8 0 0 0 32.4375 18.720703 C 32.881044 17.355414 33.376523 14.960672 32.199219 13.076172 C 29.929345 13.076172 28.464667 14.632086 27.765625 15.599609 A 10 8 0 0 0 24 15 A 10 8 0 0 0 20.230469 15.59375 C 19.529731 14.625773 18.066226 13.076172 15.800781 13.076172 C 14.449711 15.238817 15.28492 17.564557 15.732422 18.513672 A 10 8 0 0 0 21.681641 30.779297 C 20.3755 31.452483 19.397283 32.674042 19.097656 34.15625 L 17.783203 34.15625 C 16.486203 34.15625 15.98225 33.629234 15.28125 32.740234 C 14.58925 31.851234 13.845172 31.253859 12.951172 31.005859 C 12.469172 30.954859 12.144453 31.321484 12.564453 31.646484 C 13.983453 32.612484 14.081391 34.193516 14.650391 35.228516 C 15.168391 36.160516 16.229687 37 17.429688 37 L 19 37 L 19 40.251953 C 12.043061 38.122519 7 31.66536 7 24 C 7 14.593391 14.593385 7 24 7 z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </StyledNavigation>
  );
};

export default Navigation;
