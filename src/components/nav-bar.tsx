import { useState } from 'react';
import classes from './nav-bar.module.css';

function NavBar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    // Close sidebar after navigation on mobile
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className={classes.navbar}>
        <ul className={classes.links}>
          <a href='#lore' onClick={(e) => handleSmoothScroll(e, 'lore')}>
            Lore
          </a>
          <a href='#techstack' onClick={(e) => handleSmoothScroll(e, 'techstack')}>
            Tech Stack
          </a>
          <a href='#about' onClick={(e) => handleSmoothScroll(e, 'about')}>
            About
          </a>
          <a href='#contact' onClick={(e) => handleSmoothScroll(e, 'contact')}>
            Contact
          </a>
        </ul>
        
        {/* Desktop socials */}
        <div className={classes.socials}>
          <a
            href='https://www.github.com/AhmedSalah121'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={classes.img} src='./github-white.svg' />
          </a>
          <a
            href='https://www.linkedin.com/in/ahmedsalah121/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={classes.img} src='./linkedin.svg' />
          </a>
          <a
            href='https://www.leetcode.com/u/AhmedSalah121/'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img className={classes.img} src='./leetcode.svg' />
          </a>
        </div>

        {/* Mobile hamburger button */}
        <button 
          className={classes.hamburger} 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          <span className={`${classes.hamburgerLine} ${isSidebarOpen ? classes.hamburgerLineOpen : ''}`}></span>
          <span className={`${classes.hamburgerLine} ${isSidebarOpen ? classes.hamburgerLineOpen : ''}`}></span>
          <span className={`${classes.hamburgerLine} ${isSidebarOpen ? classes.hamburgerLineOpen : ''}`}></span>
        </button>
      </header>

      {/* Mobile sidebar */}
      <div className={`${classes.sidebar} ${isSidebarOpen ? classes.sidebarOpen : ''}`}>
        <div className={classes.sidebarContent}>
          <div className={classes.sidebarSocials}>
            <a
              href='https://www.github.com/AhmedSalah121'
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => setIsSidebarOpen(false)}
            >
              <img className={classes.sidebarImg} src='./github-white.svg' />
              <span>GitHub</span>
            </a>
            <a
              href='https://www.linkedin.com/in/ahmedsalah121/'
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => setIsSidebarOpen(false)}
            >
              <img className={classes.sidebarImg} src='./linkedin.svg' />
              <span>LinkedIn</span>
            </a>
            <a
              href='https://www.leetcode.com/u/AhmedSalah121/'
              target='_blank'
              rel='noopener noreferrer'
              onClick={() => setIsSidebarOpen(false)}
            >
              <img className={classes.sidebarImg} src='./leetcode.svg' />
              <span>LeetCode</span>
            </a>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className={classes.overlay} 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}

export default NavBar;
