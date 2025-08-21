import classes from './announcement-banner.module.css';

function AnnouncementBanner() {
const announcements = [
    "• Full Stack Software Engineer",
    "• Experienced in React, TypeScript, Node.js and Postgresql",
    "• Building scalable, high-performance web applications",
    "• Paying attention to details",
    "• Open to new opportunities",
];

  return (
    <div className={classes.bannerContainer}>
      <div className={classes.bannerContent}>
        <div className={classes.scrollingText}>
          {announcements.map((text, index) => (
            <span key={index} className={classes.textItem}>
              {text}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {announcements.map((text, index) => (
            <span key={`duplicate-${index}`} className={classes.textItem}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementBanner;
