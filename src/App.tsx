import NavBar from './components/nav-bar';
import Hero from './components/hero';
import AnnouncementBanner from './components/announcement-banner';
import BackToTop from './components/back-to-top';
import classes from './App.module.css';
import Footer from './components/footer';
import ImageCard from './components/image-card';
import TechStack from './components/tech-stack';
import Reveal from './components/reveal';
import TerminalEasterEgg from './components/terminal-easter-egg';
import { experiences } from './data/experience';
import { contactInfo } from './data/contact';

function App() {
  return (
    <>
      <div id='nav-scroll-sentinel' aria-hidden='true' />
      <NavBar />
      <main className={`${classes.main} container`}>
        <Hero />

        <section id='experience' className={classes.section}>
          <header className='sectionHeader'>
            <h2 className='sectionTitle'>Experience</h2>
            <p className='sectionSubtitle'>
              Projects and roles that shaped my engineering journey
            </p>
          </header>
          {experiences.map((exp, index) => (
            <div key={exp.company + exp.dateRange}>
              <ImageCard {...exp} />
              {index < experiences.length - 1 && (
                <div className={classes.cardSeparator}></div>
              )}
            </div>
          ))}
        </section>

        <section id='techstack' className={classes.section}>
          <TechStack />
        </section>

        <Reveal>
          <AnnouncementBanner />
        </Reveal>

        <Footer {...contactInfo} />
      </main>
      <BackToTop />
      <TerminalEasterEgg />
    </>
  );
}

export default App;
