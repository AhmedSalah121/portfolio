import { useState, useEffect } from 'react';
import type { Experience } from '../data/experience';
import classes from './image-card.module.css';

type ImageCardProps = Experience;

function ImageCard({
  role,
  company,
  dateRange,
  summary,
  achievements,
  technologies,
  fullDescription,
  images,
  layout = 'left',
  autoSlide = true,
  slideInterval = 4000,
  screenshotType = 'desktop',
}: ImageCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = images.length > 0;

  useEffect(() => {
    if (autoSlide && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prevIndex =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, slideInterval);

      return () => clearInterval(interval);
    }
  }, [autoSlide, images.length, slideInterval]);

  const cardClass =
    layout === 'right'
      ? classes.portfolioImageCardHorizontalReverse
      : classes.portfolioImageCardHorizontal;

  const imageContainerClass =
    screenshotType === 'mobile'
      ? classes.portfolioImageContainerMobile
      : classes.portfolioImageContainerHorizontal;

  const imageClass =
    screenshotType === 'mobile'
      ? classes.portfolioCardImageMobile
      : classes.portfolioCardImage;

  const contentContainerClass =
    screenshotType === 'mobile'
      ? classes.portfolioContentContainerMobile
      : classes.portfolioContentContainerHorizontal;

  const renderContent = () => (
    <>
      <h3 className={classes.portfolioCardTitle}>{role}</h3>
      <p className={classes.portfolioCardMeta}>
        {company} · {dateRange}
      </p>
      <p className={classes.portfolioCardSummary}>{summary}</p>
      <ul className={classes.achievementList}>
        {achievements.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <div className={classes.techChips}>
        {technologies.map((tech, index) => (
          <span key={index} className={classes.chip}>
            {tech}
          </span>
        ))}
      </div>
      <details className={classes.readMore}>
        <summary>Read more</summary>
        <p className={classes.fullDescription}>{fullDescription}</p>
      </details>
    </>
  );

  if (!hasImages) {
    const noImageClass =
      layout === 'right' ? classes.noImageCardReverse : classes.noImageCard;

    return (
      <article className={`${noImageClass} ${classes.cardSurface}`}>
        <div className={classes.noImagePlaceholder} aria-hidden='true'>
          <span className={classes.noImageIcon}>💼</span>
        </div>
        <div className={classes.noImageContent}>{renderContent()}</div>
      </article>
    );
  }

  return (
    <article className={`${cardClass} ${classes.cardSurface}`}>
      <div className={imageContainerClass}>
        <div className={classes.slideShowContainer}>
          <div
            className={classes.slideShowWrapper}
            style={{
              transform: `translateX(-${currentImageIndex * 100}%)`,
            }}
          >
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                className={imageClass}
                alt={`${role} at ${company} - screenshot ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={contentContainerClass}>{renderContent()}</div>
    </article>
  );
}

export default ImageCard;
