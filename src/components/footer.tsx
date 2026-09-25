import { aboutText, educationText } from '../data/contact';
import type { ContactInfo } from '../data/contact';
import Reveal from './reveal';
import classes from './footer.module.css';

type FooterProps = ContactInfo;

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M2 12h20" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 6 12 13 2 6" />
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function IconPhone() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8l-1.4 1.4a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 1.8-.6l3 .5A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

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
    <footer className={classes.footer}>
      <div className={classes.footerContainer}>
        <Reveal delay={0}>
          <div className={classes.footerSection}>
            <h3 className={classes.footerTitle}>Contact Info</h3>
          <div className={classes.contactItem}>
            <span className={classes.icon} aria-hidden="true"><IconUser /></span>
            <span>{name}</span>
          </div>
          <div className={classes.contactItem}>
            <span className={classes.icon} aria-hidden="true"><IconBriefcase /></span>
            <span>{title}</span>
          </div>
          <div className={classes.contactItem}>
            <span className={classes.icon} aria-hidden="true"><IconPhone /></span>
            <a href={`tel:${phone?.replace(/\s/g, '')}`} className={classes.link}>
              {phone}
            </a>
          </div>
          <div className={classes.contactItem}>
            <span className={classes.icon} aria-hidden="true"><IconMail /></span>
            <a href={`mailto:${email}`} className={classes.link}>
              {email}
            </a>
          </div>
          <div className={classes.contactItem}>
            <span className={classes.icon} aria-hidden="true"><IconMapPin /></span>
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
        <div className={classes.terminalTriggerWrapper}>
          <span className={classes.konamiHint} title="Interactive Terminal Easter Egg">
            💻 Terminal: Press <code>~</code> or <code>↑↑↓↓←→←→BA</code>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
