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

  return (
    <div className={cardClass}>
      {images && images.length > 0 && (
        <div className={imageContainerClass}>
          <div className={classes.slideShowContainer}>
            <div
              className={classes.slideShowWrapper}
              style={{
                transform: `translateX(-${currentImageIndex * 100}%)`,
                transition: 'transform 0.5s ease-in-out',
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
      )}
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
