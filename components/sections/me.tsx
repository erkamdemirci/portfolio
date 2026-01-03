import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledAbout = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
  background: #000;
  position: relative;
  overflow: hidden;

  .about-container {
    width: 90%;
    max-width: 1000px;
    position: relative;
    z-index: 1;
  }

  .section-label {
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #666;
    margin-bottom: 32px;
  }

  .about-text {
    font-size: 2.75rem;
    font-weight: 500;
    line-height: 1.4;
    color: #fff;
    margin: 0;

    .accent {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .accent-2 {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .skills-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 80px;
  }

  .skill-item {
    text-align: center;
    padding: 32px 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-4px);
    }

    .skill-icon {
      font-size: 2rem;
      margin-bottom: 12px;
    }

    .skill-name {
      font-size: 1rem;
      font-weight: 600;
      color: #fff;
      margin-bottom: 4px;
    }

    .skill-desc {
      font-size: 0.875rem;
      color: #888;
    }
  }

  .background-glow {
    position: absolute;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    filter: blur(150px);
    opacity: 0.08;
    pointer-events: none;
  }

  .glow-1 {
    top: -400px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  @media screen and (max-width: 992px) {
    padding: 80px 0;

    .about-text {
      font-size: 2rem;
    }

    .skills-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-top: 60px;
    }

    .skill-item {
      padding: 24px 12px;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 60px 0;

    .section-label {
      font-size: 0.75rem;
      margin-bottom: 24px;
    }

    .about-text {
      font-size: 1.5rem;
      line-height: 1.5;
    }

    .skills-grid {
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 48px;
    }

    .skill-item {
      padding: 20px 12px;

      .skill-icon {
        font-size: 1.5rem;
      }

      .skill-name {
        font-size: 0.875rem;
      }

      .skill-desc {
        font-size: 0.75rem;
      }
    }
  }
`;

const skills = [
  { icon: '🎨', name: 'Design', desc: 'UI/UX' },
  { icon: '⚡', name: 'Frontend', desc: 'React, Next.js' },
  { icon: '🔧', name: 'Backend', desc: 'Node.js, APIs' },
  { icon: '🚀', name: 'Deploy', desc: 'Cloud, DevOps' }
];

const About: NextPage = () => {
  return (
    <StyledAbout id="about">
      <div className="background-glow glow-1" />

      <motion.div
        className="about-container"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="section-label">About Me</p>

        <h2 className="about-text">
          I&apos;m a developer who loves building <span className="accent">products from scratch</span>.
          From concept to deployment, I handle the full stack — crafting
          <span className="accent-2"> user experiences</span> that are both beautiful and functional.
        </h2>

        <div className="skills-grid">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="skill-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="skill-icon">{skill.icon}</div>
              <div className="skill-name">{skill.name}</div>
              <div className="skill-desc">{skill.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </StyledAbout>
  );
};

export default About;
