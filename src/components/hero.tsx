import { contactInfo } from '../data/contact';
import Reveal from './reveal';
import classes from './hero.module.css';

function Hero() {
  return (
    <section id='hero' className={classes.hero}>
      <div className={classes.heroContent}>
        <Reveal delay={40}>
          <h1 className={classes.heroTitle}>
            <span className={classes.titleName}>{contactInfo.name}</span>
            <span className={classes.highlightContainer}>
              <mark className={classes.highlighter}>Software Engineer</mark>
            </span>
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <div className={classes.heroCtas}>
            <a
              href={contactInfo.resumeUrl}
              target='_blank'
              rel='noopener noreferrer'
              className={classes.ctaPrimary}
            >
              ▸ Download Resume
            </a>
            <a href='#contact' className={classes.ctaSecondary}>
              ✉ Get in touch
            </a>
          </div>
        </Reveal>
      </div>

      <a
        href='#experience'
        className={classes.scrollIndicator}
        aria-label='Scroll to experience'
      >
        <span className={classes.scrollChevron}></span>
      </a>
    </section>
  );
}

export default Hero;
