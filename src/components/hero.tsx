import { contactInfo } from '../data/contact';
import classes from './hero.module.css';

function Hero() {
  return (
    <section id='hero' className={classes.hero}>
      <div className={classes.heroContent}>
        <h1 className={classes.heroTitle}>{contactInfo.name}</h1>
        <p className={classes.heroRole}>{contactInfo.title}</p>
        <p className={classes.heroStatement}>
          Backend engineer building scalable APIs and full-stack products — from
          table reservation systems to ML-powered sentiment analysis.
        </p>
        <div className={classes.heroCtas}>
          <a
            href={contactInfo.resumeUrl}
            target='_blank'
            rel='noopener noreferrer'
            className={classes.ctaPrimary}
          >
            Download Resume
          </a>
          <a href='#contact' className={classes.ctaSecondary}>
            Get in touch
          </a>
        </div>
      </div>
      <a href='#lore' className={classes.scrollIndicator} aria-label='Scroll to experience'>
        <span className={classes.scrollChevron}></span>
      </a>
    </section>
  );
}

export default Hero;
