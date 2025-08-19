import classes from './nav-bar.module.css';

function NavBar() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
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
    </header>
  );
}

export default NavBar;
