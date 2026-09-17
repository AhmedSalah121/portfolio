import { useEffect, useRef, useState } from 'react';
import classes from './nav-bar.module.css';

const NAV_LINKS = [
  { href: '#lore', label: 'Lore' },
  { href: '#techstack', label: 'Tech Stack' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
] as const;

function NavBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const scrollPositionRef = useRef(0);

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

  return (
    <>
      <header className={classes.navbar}>
        <ul className={classes.links}>
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
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
          className={classes.hamburger}
          onClick={toggleSidebar}
          aria-label='Toggle menu'
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
      </header>

      <div
        className={`${classes.sidebar} ${isSidebarOpen ? classes.sidebarOpen : ''}`}
      >
        <div className={classes.sidebarContent}>
          <nav className={classes.sidebarNav}>
            {NAV_LINKS.map(({ href, label }) => (
              <a key={href} href={href} onClick={closeSidebar}>
                {label}
              </a>
            ))}
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
