import { useState, useEffect } from 'react';
import classes from './image-card.module.css';

interface ImageCardProps {
  images: string[];
  title: string;
  description: string;
  layout?: 'left' | 'right';
  autoSlide?: boolean;
  slideInterval?: number;
  screenshotType?: 'mobile' | 'desktop';
}

function ImageCard({
  images,
  title,
  description,
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

  const noImageClass =
    layout === 'right'
      ? classes.noImageCardReverse
      : classes.noImageCard;

  if (!hasImages) {
    return (
      <div className={noImageClass}>
        <div className={classes.noImagePlaceholder} aria-hidden='true'>
          <span className={classes.noImageIcon}>💼</span>
        </div>
        <div className={classes.noImageContent}>
          {title && <h3 className={classes.portfolioCardTitle}>{title}</h3>}
          {description && (
            <p className={classes.portfolioCardDescription}>{description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
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
                alt={`${title} - Image ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={contentContainerClass}>
        {title && <h3 className={classes.portfolioCardTitle}>{title}</h3>}
        {description && (
          <p className={classes.portfolioCardDescription}>{description}</p>
        )}
      </div>
    </div>
  );
}

export default ImageCard;
