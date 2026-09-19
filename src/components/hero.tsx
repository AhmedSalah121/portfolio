import { useEffect } from 'react';
import { contactInfo } from '../data/contact';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import Reveal from './reveal';
import Starfield from './starfield';
import classes from './hero.module.css';

function Hero() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const isMobile = window.matchMedia('(max-width: 767.98px)').matches;
    if (isMobile) return;

    const blob1Ref = document.getElementById('hero-blob-1');
    const blob2Ref = document.getElementById('hero-blob-2');
    if (!blob1Ref && !blob2Ref) return;

    let ticking = false;

    const updateParallax = () => {
      const scrollY = window.scrollY;
      if (blob1Ref) {
        blob1Ref.style.transform = `translateY(${scrollY * 0.2}px)`;
      }
      if (blob2Ref) {
        blob2Ref.style.transform = `translateY(${scrollY * 0.15}px)`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reducedMotion]);

  return (
    <section id='hero' className={classes.hero}>
      <Starfield />
      <div className={classes.heroParallax} aria-hidden='true'>
        <div
          id='hero-blob-1'
          className={`${classes.parallaxBlob} ${classes.parallaxBlob1}`}
        />
        <div
          id='hero-blob-2'
          className={`${classes.parallaxBlob} ${classes.parallaxBlob2}`}
        />
      </div>

      <div className={classes.heroContent}>
        <Reveal delay={0}>
          <h1 className={classes.heroTitle}>{contactInfo.name}</h1>
        </Reveal>
        <Reveal delay={60}>
          <p className={classes.heroRole}>{contactInfo.title}</p>
        </Reveal>
        <Reveal delay={120}>
          <p className={classes.heroStatement}>
            Backend engineer building scalable APIs and full-stack products — from
            table reservation systems to ML-powered sentiment analysis.
          </p>
        </Reveal>
        <Reveal delay={180}>
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
