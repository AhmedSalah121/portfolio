import type { CSSProperties } from 'react';
import Reveal from './reveal';
import classes from './tech-stack.module.css';
import { frontendTechs, backendTechs, tools, aimlTechs } from '../data/tech';

function TechStack() {
  const renderTechSection = (
    techs: { name: string; icon: string }[],
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
                <img src={tech.icon} alt={tech.name} className={classes.techImage} />
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
