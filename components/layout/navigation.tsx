import React, { useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

import Image from 'next/image';
import { useRouter } from 'next/router';

const StyledNavigation = styled.header`
  .container {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
  }

  nav {
    height: 100%;
    display: flex;
    ul > li {
      display: flex;
      align-items: center;
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
        font-family: 'CerebriSansSemiBold';
        text-transform: uppercase;
        font-size: 1rem;
      }
    }
  }

  .logo__long {
    text-align: center;
    display: inline-block;
  }
  .logo__short {
    text-align: end;
    display: none;
  }

  .social-icons {
    text-align: end;
  }

  .menu-icon {
    display: none;
  }

  @media screen and (min-width: 992px) {
    .ed-side-menu {
      display: none;
    }
  }

  @media screen and (max-width: 576px) {
    .logo__long {
      display: none;
    }
    .logo__short {
      display: inline-block;
    }

    .social-icons {
      display: none;
    }
  }
  @media screen and (max-width: 992px) {
    .ed-navbar-inner {
      height: 6rem;
    }

    .menu-icon {
      display: inline-block;
    }

    .ed-nav-default {
      display: none;
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
      padding: 3.125rem 2.0625rem 3.125rem 4.0625rem;
      display: flex;
      flex-direction: column;
      gap: 40px;
      transform: translateX(100%);
      transition-duration: 300ms;

      .ed-side-menu__navigation {
        flex-grow: 1;
        nav {
          display: flex;
          flex-direction: column;

          ul > li.active {
            color: hsl(8, 95%, 57%);
          }

          ul > li {
            padding: 15px 0;
            font-size: 1.55rem;
            font-family: 'CerebriSansBold';
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
          font-family: 'CerebriSansMedium';
        }
      }

      .ed-side-menu__footer {
        font-size: 0.875rem;
        color: hsl(0, 0%, 60%);
        font-family: 'CerebriSansLight';
        span  {
          font-family: 'CerebriSansRegular';
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

  return (
    <StyledNavigation>
      <div className="container">
        <div className="ed-navbar-inner">
          <nav className="ed-nav-default">
            <ul>
              <li className={`nav__link ${router.pathname == '/' ? 'active' : ''}`}>
                <a>
                  <span>Home</span>
                </a>
              </li>
              <li className={`nav__link ${router.pathname == '/portfolio' ? 'active' : ''}`}>
                <a>
                  <span>Portfolio</span>
                </a>
              </li>
              <li className={`nav__link ${router.pathname == '/blog' ? 'active' : ''}`}>
                <a>
                  <span>Blog</span>
                </a>
              </li>
              <li className={`nav__link ${router.pathname == '/pages' ? 'active' : ''}`}>
                <a>
                  <span>Pages</span>
                </a>
              </li>
            </ul>
          </nav>
          <button onClick={handleSideMenu} className="menu-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              style={{ height: '30px', width: '30px' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          <div className={`ed-side-menu ${showMenu && 'show'}`}>
            <div className="ed-side-menu__header">
              <div className="langs">
                <a>EN</a>
                <a>TR</a>
              </div>
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
                  <li className={`nav__link ${router.pathname == '/' ? 'active' : ''}`}>
                    <a>
                      <span>Home</span>
                    </a>
                  </li>
                  <li className={`nav__link ${router.pathname == '/portfolio' ? 'active' : ''}`}>
                    <a>
                      <span>Portfolio</span>
                    </a>
                  </li>
                  <li className={`nav__link ${router.pathname == '/blog' ? 'active' : ''}`}>
                    <a>
                      <span>Blog</span>
                    </a>
                  </li>
                  <li className={`nav__link ${router.pathname == '/pages' ? 'active' : ''}`}>
                    <a>
                      <span>Pages</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="ed-side-menu__footer">
              © 2022 - All Rights Reserved.
              <br />
              Development by <span className="">Erkam Demirci</span>.
            </div>
          </div>
          <div className="logo__short">
            <Image src={'/images/ed-short.png'} width={50} height={50} objectFit={'contain'} alt="" />
          </div>{' '}
          <div className="logo__long">
            <Image src={'/images/ed-long.png'} width={200} height={200} objectFit={'contain'} alt="" />
          </div>
          <div className="social-icons">SOCIAL</div>
        </div>
      </div>
    </StyledNavigation>
  );
};

export default Navigation;
