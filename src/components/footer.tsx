import { aboutText, educationText } from '../data/contact';
import type { ContactInfo } from '../data/contact';
import Reveal from './reveal';
import classes from './footer.module.css';

type FooterProps = ContactInfo;

function Footer({
  name,
  title,
  phone,
  email,
  location,
  resumeUrl,
  socialLinks,
}: FooterProps) {
  return (
    <footer id='contact' className={classes.footer}>
      <header className='sectionHeader'>
        <h2 className='sectionTitle'>Contact</h2>
        <p className='sectionSubtitle'>Get in touch or connect on social platforms</p>
      </header>
      <div className={classes.footerContainer}>
        <Reveal delay={0}>
          <div className={classes.footerSection}>
            <h3 className={classes.footerTitle}>Contact Info</h3>
          <div className={classes.contactItem}>
            <span className={classes.label}>Name:</span>
            <span>{name}</span>
          </div>
          <div className={classes.contactItem}>
            <span className={classes.label}>Title:</span>
            <span>{title}</span>
          </div>
          <div className={classes.contactItem}>
            <span className={classes.label}>Phone:</span>
            <a href={`tel:${phone?.replace(/\s/g, '')}`} className={classes.link}>
              {phone}
            </a>
          </div>
          <div className={classes.contactItem}>
            <span className={classes.label}>Email:</span>
            <a href={`mailto:${email}`} className={classes.link}>
              {email}
            </a>
          </div>
          <div className={classes.contactItem}>
            <span className={classes.label}>Location:</span>
            <span>{location}</span>
          </div>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className={classes.footerSection}>
            <h3 className={classes.footerTitle}>Connect With Me</h3>
          <div className={classes.socialLinks}>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target='_blank'
                rel='noopener noreferrer'
                className={classes.socialLink}
              >
                Download Resume
              </a>
            )}
            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target='_blank'
                rel='noopener noreferrer'
                className={classes.socialLink}
              >
                LinkedIn
              </a>
            )}
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target='_blank'
                rel='noopener noreferrer'
                className={classes.socialLink}
              >
                GitHub
              </a>
            )}
            {socialLinks.leetcode && (
              <a
                href={socialLinks.leetcode}
                target='_blank'
                rel='noopener noreferrer'
                className={classes.socialLink}
              >
                Leetcode
              </a>
            )}
          </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div id='about' className={classes.footerSection}>
            <h3 className={classes.footerTitle}>About</h3>
            <p className={classes.aboutText}>{aboutText}</p>
          </div>
        </Reveal>
        <Reveal delay={180}>
          <div className={classes.footerSection}>
            <h3 className={classes.footerTitle}>Extra</h3>
            <p className={classes.aboutText}>{educationText}</p>
          </div>
        </Reveal>
      </div>

      <div className={classes.footerBottom}>
        <p>
          &copy; {new Date().getFullYear()} {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
