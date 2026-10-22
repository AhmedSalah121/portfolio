import classes from './announcement-banner.module.css';

interface AnnouncementItem {
  id: string;
  tag: string;
  title: string;
  badge?: {
    text: string;
    variant: 'yellow' | 'accent';
  };
}

const announcements: AnnouncementItem[] = [
  {
    id: 'role',
    tag: 'ROLE',
    title: 'Full Stack Software Engineer',
  },
  {
    id: 'stack',
    tag: 'TECH',
    title: 'React · TypeScript · Node.js · PostgreSQL',
  },
  {
    id: 'mission',
    tag: 'FOCUS',
    title: 'Building Scalable, High-Performance Web Applications',
  },
  {
    id: 'craft',
    tag: 'CRAFT',
    title: 'Paying Meticulous Attention to Details & UX',
  },
  {
    id: 'status',
    tag: 'STATUS',
    title: 'Open to New Opportunities',
    badge: {
      text: 'AVAILABLE FOR HIRE',
      variant: 'yellow',
    },
  },
];

function AnnouncementBanner() {
  const renderItem = (item: AnnouncementItem, index: number, isDuplicate = false) => (
    <div
      key={`${item.id}-${isDuplicate ? 'dup' : 'orig'}-${index}`}
      className={classes.announcementItem}
    >
      <span className={classes.categoryTag}>[{item.tag}]</span>
      <span className={classes.itemText}>{item.title}</span>
      {item.badge && (
        <span
          className={`${classes.statusBadge} ${
            item.badge.variant === 'yellow'
              ? classes.badgeYellow
              : classes.badgeAccent
          }`}
        >
          <span className={classes.statusDot} aria-hidden='true' />
          {item.badge.text}
        </span>
      )}
      <span className={classes.delimiter} aria-hidden='true'>
        ✦
      </span>
    </div>
  );

  return (
    <div
      className={classes.bannerContainer}
      role='region'
      aria-label='Career highlights and announcements'
    >
      <div className={classes.leadBadge}>
        <span className={classes.pulseBeacon} aria-hidden='true'>
          <span className={classes.beaconCore} />
          <span className={classes.beaconRing} />
        </span>
        <span className={classes.badgeLabel}>DISPATCH</span>
        <span className={classes.badgeSlash} aria-hidden='true'>
          //
        </span>
      </div>

      <div className={classes.tickerWindow}>
        <div className={classes.tickerTrack}>
          {announcements.map((item, idx) => renderItem(item, idx, false))}
        </div>
        {/* Duplicate track for seamless infinite marquee loop */}
        <div className={classes.tickerTrack} aria-hidden='true'>
          {announcements.map((item, idx) => renderItem(item, idx, true))}
        </div>
      </div>
    </div>
  );
}

export default AnnouncementBanner;
