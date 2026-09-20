import { useState, useEffect, useRef, useCallback } from 'react';
import type { Experience } from '../data/experience';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import Reveal from './reveal';
import classes from './image-card.module.css';

type ImageCardProps = Experience;

function ImageCard(props: ImageCardProps) {
  const {
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
    mediaType: explicitMediaType,
  } = props;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxClosing, setLightboxClosing] = useState(false);
  const manualInteractionRef = useRef(false);
  const touchStartX = useRef(0);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<number | undefined>(undefined);
  const reducedMotion = useReducedMotion();

  // Determine effective mediaType
  const mediaType =
    explicitMediaType ??
    (images.length === 0
      ? 'none'
      : screenshotType === 'mobile'
        ? 'screenshot-mobile'
        : 'screenshot-desktop');

  const hasImages = images.length > 0;

  const goToSlide = useCallback(
    (index: number, manual = false) => {
      if (isTransitioning && manual) return;
      if (manual) {
        manualInteractionRef.current = true;
        setIsPaused(true);
      }
      setIsTransitioning(true);
      setCurrentImageIndex(index);
      setTimeout(() => {
        setIsTransitioning(false);
        if (manual) {
          manualInteractionRef.current = false;
        }
      }, 500);
    },
    [isTransitioning]
  );

  const goNext = useCallback(
    (manual = false) => {
      const next = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
      goToSlide(next, manual);
    },
    [currentImageIndex, images.length, goToSlide]
  );

  const goPrev = useCallback(
    (manual = false) => {
      const prev = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
      goToSlide(prev, manual);
    },
    [currentImageIndex, images.length, goToSlide]
  );

  const openLightbox = useCallback(
    (index: number) => {
      if (!hasImages) return;
      setCurrentImageIndex(index);
      setIsPaused(true);
      setLightboxOpen(true);
    },
    [hasImages]
  );

  const closeLightbox = useCallback(() => {
    if (lightboxClosing || closeTimerRef.current !== undefined) return;
    setLightboxClosing(true);
    closeTimerRef.current = window.setTimeout(() => {
      setLightboxOpen(false);
      setLightboxClosing(false);
      closeTimerRef.current = undefined;
    }, 300);
  }, [lightboxClosing]);

  useEffect(() => {
    if (
      !autoSlide ||
      images.length <= 1 ||
      mediaType === 'logo' ||
      isPaused ||
      reducedMotion ||
      manualInteractionRef.current ||
      isTransitioning
    ) {
      return;
    }

    const interval = setInterval(() => {
      goNext(false);
    }, slideInterval);

    return () => clearInterval(interval);
  }, [
    autoSlide,
    images.length,
    mediaType,
    slideInterval,
    isPaused,
    reducedMotion,
    isTransitioning,
    goNext,
  ]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    previouslyFocusedRef.current = previousFocus;
    const restoreFocus = () => {
      if (previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
        previouslyFocusedRef.current = null;
      }
    };
    requestAnimationFrame(() => lightboxCloseRef.current?.focus());
    return restoreFocus;
  }, [lightboxOpen]);

  useEffect(() => {
    if (!lightboxOpen || images.length <= 1) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev(true);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, images.length, closeLightbox, goPrev, goNext]);

  useEffect(
    () => () => {
      if (closeTimerRef.current !== undefined) {
        window.clearTimeout(closeTimerRef.current);
      }
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (lightboxOpen || images.length <= 1) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev(true);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext(true);
      else goPrev(true);
    }
  };

  const cardClass =
    layout === 'right'
      ? classes.portfolioImageCardHorizontalReverse
      : classes.portfolioImageCardHorizontal;

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

  const renderSlideshow = () => (
    <div
      className={classes.slideshowControls}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      tabIndex={0}
      role='region'
      aria-label={`${role} screenshot slideshow`}
      aria-roledescription='carousel'
    >
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
              className={
                mediaType === 'screenshot-mobile'
                  ? classes.portfolioCardImageMobile
                  : classes.portfolioCardImage
              }
              alt={`${role} at ${company} - screenshot ${index + 1}`}
              loading='lazy'
              decoding='async'
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <button
            type='button'
            className={`${classes.slideBtn} ${classes.slideBtnPrev}`}
            onClick={() => goPrev(true)}
            aria-label='Previous slide'
          >
            ‹
          </button>
          <button
            type='button'
            className={`${classes.slideBtn} ${classes.slideBtnNext}`}
            onClick={() => goNext(true)}
            aria-label='Next slide'
          >
            ›
          </button>
          <div className={classes.slideDots} role='tablist'>
            {images.map((_, index) => (
              <button
                key={index}
                type='button'
                role='tab'
                className={`${classes.slideDot} ${index === currentImageIndex ? classes.slideDotActive : ''}`}
                onClick={() => goToSlide(index, true)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === currentImageIndex}
              />
            ))}
          </div>
          <div className={classes.srOnly} aria-live='polite'>
            Slide {currentImageIndex + 1} of {images.length}
          </div>
        </>
      )}
    </div>
  );

  const renderLightbox = () => {
    if (!lightboxOpen || !hasImages) return null;
    const image = images[currentImageIndex];
    return (
      <div
        className={`${classes.lightbox} ${lightboxClosing ? classes.lightboxClosing : ''}`}
        role='dialog'
        aria-modal='true'
        aria-label={`${role} - screenshot viewer`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
      >
        <button
          type='button'
          ref={lightboxCloseRef}
          className={classes.lightboxClose}
          onClick={closeLightbox}
          aria-label='Close image viewer'
        >
          ×
        </button>
        <figure
          className={classes.lightboxFigure}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <img
            key={image}
            className={classes.lightboxImage}
            src={image}
            alt={`${role} at ${company} - screenshot ${currentImageIndex + 1}`}
          />
        </figure>
        {images.length > 1 && (
          <>
            <button
              type='button'
              className={`${classes.lightboxBtn} ${classes.lightboxBtnPrev}`}
              onClick={() => goPrev(true)}
              aria-label='Previous image'
            >
              ‹
            </button>
            <button
              type='button'
              className={`${classes.lightboxBtn} ${classes.lightboxBtnNext}`}
              onClick={() => goNext(true)}
              aria-label='Next image'
            >
              ›
            </button>
            <div className={classes.lightboxCounter} aria-live='polite'>
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderLogoPanel = () => {
    const logoSrc = images[0];
    return (
      <div className={classes.logoPanel}>
        {!logoFailed && logoSrc ? (
          <img
            src={logoSrc}
            alt={company}
            className={classes.logoImage}
            loading='lazy'
            decoding='async'
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className={classes.logoMonogram}>{company}</span>
        )}
      </div>
    );
  };

  const renderMediaColumn = () => {
    if (mediaType === 'none' || !hasImages) {
      return (
        <div className={classes.noImagePlaceholder} aria-hidden='true'>
          <span className={classes.noImageIcon}>💼</span>
        </div>
      );
    }

    if (mediaType === 'logo') {
      return renderLogoPanel();
    }

    const containerClass =
      mediaType === 'screenshot-mobile'
        ? classes.portfolioImageContainerMobile
        : classes.portfolioImageContainerHorizontal;

    return <div className={containerClass}>{renderSlideshow()}</div>;
  };

  return (
    <>
      <Reveal>
        <article className={`${cardClass} ${classes.cardSurface}`}>
          {renderMediaColumn()}
          <div
            className={
              mediaType === 'screenshot-mobile'
                ? classes.portfolioContentContainerMobile
                : classes.portfolioContentContainerHorizontal
            }
          >
            {renderContent()}
          </div>
        </article>
      </Reveal>
      {renderLightbox()}
    </>
  );
}

export default ImageCard;
