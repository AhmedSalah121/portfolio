import classes from './footer.module.css';

interface FooterProps {
  name?: string;
  title?: string;
  phone?: string;
  email?: string;
  location?: string;
  resumeUrl?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    leetcode?: string;
  };
}

function Footer({
  name,
  title,
  phone,
  email,
  location,
  resumeUrl,
  socialLinks = {},
}: FooterProps) {
  return (
    <footer id="contact" className={classes.footer}>
      <div className={classes.footerContainer}>
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
            <a href={`tel:${phone}`} className={classes.link}>
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

        <div className={classes.footerSection}>
          <h3 className={classes.footerTitle}>About</h3>
          <p className={classes.aboutText}>
            Passionate Backend Software Engineer who is taking a big footstep into
            being a Fullstack Software Engineer. Always eager to take on new challenges.
          </p>
        </div>
        <div className={classes.footerSection}>
          <h3 className={classes.footerTitle}>Extra</h3>
          <p className={classes.aboutText}>
            Graduated from Faculty of Science - Computer Science Department
            January - 2025
          </p>
        </div>
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
