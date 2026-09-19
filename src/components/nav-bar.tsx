import { useEffect, useRef, useState } from 'react';
import { useScrollProgress } from '../hooks/use-scroll-progress';
import classes from './nav-bar.module.css';

const NAV_LINKS = [
  { href: '#experience', id: 'experience', label: 'Experience' },
  { href: '#techstack', id: 'techstack', label: 'Tech Stack' },
  { href: '#contact', id: 'contact', label: 'Contact' },
] as const;

const SECTION_IDS = NAV_LINKS.map(link => link.id);

function NavBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('experience');
  const scrollPositionRef = useRef(0);
  const scrollProgress = useScrollProgress();
  const supportsScrollTimeline =
    typeof CSS !== 'undefined' &&
    CSS.supports('animation-timeline: scroll()');

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = scrollPositionRef.current;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isSidebarOpen]);

  useEffect(() => {
    const sentinel = document.getElementById('nav-scroll-sentinel');
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrolled(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-40px 0px 0px 0px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map(id => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: [0.15, 0.3, 0.5], rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const renderNavLink = (link: (typeof NAV_LINKS)[number], mobile = false) => {
    const isActive = activeSection === link.id;
    const linkClass = mobile
      ? `${classes.sidebarNavLink} ${isActive ? classes.navLinkActive : ''}`
      : `${classes.navLink} ${isActive ? classes.navLinkActive : ''}`;

    return (
      <a
        key={link.href}
        href={link.href}
        className={linkClass}
        aria-current={isActive ? 'true' : undefined}
        onClick={mobile ? closeSidebar : undefined}
      >
        {link.label}
        {!mobile && isActive && (
          <span className={classes.navIndicator} aria-hidden='true' />
        )}
      </a>
    );
  };

  return (
    <>
      <header
        className={`${classes.navbar} ${isScrolled ? classes.navbarScrolled : ''}`}
      >
        <a href="#hero" className={classes.brand} aria-label="Home">
          AS<span>.</span>
        </a>
        <ul className={classes.links}>
          {NAV_LINKS.map(link => (
            <li key={link.href}>{renderNavLink(link)}</li>
          ))}
        </ul>

        <div className={classes.socials}>
          <a
            href='https://www.github.com/AhmedSalah121'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={classes.img} src='./github-white.svg' alt='GitHub' />
          </a>
          <a
            href='https://www.linkedin.com/in/ahmedsalah121/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={classes.img} src='./linkedin.svg' alt='LinkedIn' />
          </a>
          <a
            href='https://www.leetcode.com/u/AhmedSalah121/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={classes.img} src='./leetcode.svg' alt='LeetCode' />
          </a>
        </div>

        <button
          type='button'
          className={classes.hamburger}
          onClick={toggleSidebar}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen}
          aria-controls='mobile-sidebar'
        >
          <span
            className={`${classes.hamburgerLine} ${isSidebarOpen ? classes.hamburgerLineOpen : ''}`}
          ></span>
          <span
            className={`${classes.hamburgerLine} ${isSidebarOpen ? classes.hamburgerLineOpen : ''}`}
          ></span>
          <span
            className={`${classes.hamburgerLine} ${isSidebarOpen ? classes.hamburgerLineOpen : ''}`}
          ></span>
        </button>

        <div
          className={`${classes.progressBar} ${supportsScrollTimeline ? classes.progressBarNative : ''}`}
          style={
            supportsScrollTimeline
              ? undefined
              : { transform: `scaleX(${scrollProgress})` }
          }
          aria-hidden='true'
        />
      </header>

      <div
        id='mobile-sidebar'
        className={`${classes.sidebar} ${isSidebarOpen ? classes.sidebarOpen : ''}`}
        aria-hidden={!isSidebarOpen}
      >
        <div className={classes.sidebarContent}>
          <nav className={classes.sidebarNav}>
            {NAV_LINKS.map(link => renderNavLink(link, true))}
          </nav>
          <div className={classes.sidebarSocials}>
            <a
              href='https://www.github.com/AhmedSalah121'
              target='_blank'
              rel='noopener noreferrer'
              onClick={closeSidebar}
            >
              <img className={classes.sidebarImg} src='./github-white.svg' alt='GitHub' />
              <span>GitHub</span>
            </a>
            <a
              href='https://www.linkedin.com/in/ahmedsalah121/'
              target='_blank'
              rel='noopener noreferrer'
              onClick={closeSidebar}
            >
              <img className={classes.sidebarImg} src='./linkedin.svg' alt='LinkedIn' />
              <span>LinkedIn</span>
            </a>
            <a
              href='https://www.leetcode.com/u/AhmedSalah121/'
              target='_blank'
              rel='noopener noreferrer'
              onClick={closeSidebar}
            >
              <img className={classes.sidebarImg} src='./leetcode.svg' alt='LeetCode' />
              <span>LeetCode</span>
            </a>
          </div>
        </div>
      </div>

      {isSidebarOpen && (
        <div className={classes.overlay} onClick={closeSidebar}></div>
      )}
    </>
  );
}

export default NavBar;
