import React from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledPortfolio = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);

  .section-header {
    text-align: center;
    margin-bottom: 80px;

    .label {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: #666;
      margin-bottom: 16px;
    }

    h2 {
      font-size: 3.5rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #000 0%, #333 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .projects-grid {
    width: 90%;
    max-width: 1400px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
  }

  .project-card {
    position: relative;
    background: #fff;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.06);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
      border-color: transparent;

      .project-visual {
        transform: scale(1.02);
      }

      .arrow-icon {
        transform: translate(4px, -4px);
        opacity: 1;
      }
    }
  }

  .project-visual {
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .project-visual.linkden {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .project-visual.enginist {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  .project-logo {
    font-size: 3rem;
    font-weight: 800;
    color: white;
    letter-spacing: -1px;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .project-content {
    padding: 32px;
  }

  .project-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .project-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    color: #000;
  }

  .arrow-icon {
    width: 24px;
    height: 24px;
    opacity: 0.5;
    transition: all 0.3s ease;
  }

  .project-description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #555;
    margin-bottom: 24px;
  }

  .project-meta {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .tech-tag {
    display: inline-flex;
    align-items: center;
    padding: 8px 16px;
    background: #f5f5f5;
    border-radius: 100px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
    transition: all 0.2s ease;

    &:hover {
      background: #eee;
    }
  }

  .role-tag {
    font-size: 0.875rem;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  @media screen and (max-width: 992px) {
    padding: 80px 0;

    .section-header {
      margin-bottom: 60px;

      h2 {
        font-size: 2.5rem;
      }
    }

    .projects-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .project-visual {
      height: 280px;
    }

    .project-logo {
      font-size: 2.5rem;
    }
  }

  @media screen and (max-width: 576px) {
    padding: 60px 0;

    .section-header {
      margin-bottom: 40px;

      .label {
        font-size: 0.75rem;
      }

      h2 {
        font-size: 2rem;
      }
    }

    .projects-grid {
      width: 95%;
    }

    .project-visual {
      height: 200px;
    }

    .project-logo {
      font-size: 2rem;
    }

    .project-content {
      padding: 24px;
    }

    .project-title {
      font-size: 1.5rem;
    }

    .project-description {
      font-size: 1rem;
    }
  }
`;

const projects = [
  {
    id: 'linkden',
    name: 'LinkDen',
    url: 'https://linkden.co',
    description: 'The modern documentation platform that unifies search, save, and organize — all in one place. Streamline your knowledge management workflow.',
    visualClass: 'linkden',
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js'],
    role: 'Full-Stack'
  },
  {
    id: 'enginist',
    name: 'Enginist',
    url: 'https://enginist.co',
    description: 'Professional engineering calculations made easy. Standards-compliant calculators for electrical, HVAC, mechanical, and structural engineering. Free and no login required.',
    visualClass: 'enginist',
    tech: ['Next.js', 'React', 'TypeScript', 'Node.js'],
    role: 'Full-Stack'
  }
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1]
    }
  })
};

const Portfolio: NextPage = () => {
  return (
    <StyledPortfolio id="work">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="label">Selected Work</p>
        <h2>Featured Projects</h2>
      </motion.div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.a
            key={project.id}
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card"
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={cardVariants}
          >
            <div className={`project-visual ${project.visualClass}`}>
              <span className="project-logo">{project.name}</span>
            </div>

            <div className="project-content">
              <div className="project-header">
                <h3 className="project-title">{project.name}</h3>
                <svg
                  className="arrow-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>

              <p className="project-description">{project.description}</p>

              <div className="project-meta">
                {project.tech.map((tech) => (
                  <span key={tech} className="tech-tag">{tech}</span>
                ))}
                <span className="role-tag">{project.role}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </StyledPortfolio>
  );
};

export default Portfolio;
