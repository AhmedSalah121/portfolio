import type { CSSProperties } from 'react';
import Reveal from './reveal';
import classes from './tech-stack.module.css';

interface TechItem {
  name: string;
  icon: string;
}

interface TechStackProps {
  title?: string;
}

const frontendTechs: TechItem[] = [
  {
    name: 'React',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  },
  {
    name: 'TypeScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  },
  {
    name: 'JavaScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  },
  {
    name: 'HTML5',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  },
  {
    name: 'CSS3',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  },
  {
    name: 'Material UI',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg',
  },
];

const backendTechs: TechItem[] = [
  {
    name: 'Node.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  },
  {
    name: 'Express',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  },
  {
    name: 'NestJS',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
  },
  {
    name: 'Firebase',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  },
  {
    name: 'PostgreSQL',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  },
  {
    name: 'Docker',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  },
];

const tools: TechItem[] = [
  {
    name: 'Git',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  },
  {
    name: 'VS Code',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  },
  {
    name: 'IntelliJ IDEA',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/intellij/intellij-original.svg',
  },
  {
    name: 'Figma',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  },
  {
    name: 'Linux',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  },
  {
    name: 'Vercel',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
  },
];

const aimlTechs: TechItem[] = [
  {
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  },
  {
    name: 'PyTorch',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
  },
  {
    name: 'TensorFlow',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
  },
  {
    name: 'Keras',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/keras/keras-original.svg',
  },
  {
    name: 'Scikit-learn',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg',
  },
  {
    name: 'Pandas',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
  },
  {
    name: 'NumPy',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
  },
  {
    name: 'Streamlit',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg',
  },
];

function TechStack({ title = 'Tech Stack' }: TechStackProps) {
  const renderTechSection = (
    techs: TechItem[],
    sectionTitle: string,
    sectionIndex: number
  ) => (
    <Reveal delay={sectionIndex * 60}>
      <div className={classes.techSection}>
        <h3 className={classes.sectionTitle}>{sectionTitle}</h3>
        <div className={classes.techGrid}>
          {techs.map((tech, index) => (
            <div
              key={index}
              className={classes.techCard}
              style={{ '--stagger-index': index } as CSSProperties}
            >
              <div className={classes.techIcon}>
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className={classes.techImage}
                />
              </div>
              <div className={classes.techInfo}>
                <h4 className={classes.techName}>{tech.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );

  return (
    <div className={classes.techStack}>
      <header className='sectionHeader'>
        <h2 className='sectionTitle'>{title}</h2>
        <p className='sectionSubtitle'>
          Languages, frameworks, and tools I work with daily
        </p>
      </header>

      <div className={classes.techSections}>
        {renderTechSection(frontendTechs, 'Frontend', 0)}
        {renderTechSection(backendTechs, 'Backend', 1)}
        {renderTechSection(tools, 'Tools', 2)}
        {renderTechSection(aimlTechs, 'AI & Machine Learning', 3)}
      </div>
    </div>
  );
}

export default TechStack;
