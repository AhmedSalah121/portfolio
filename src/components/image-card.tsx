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
    logo,
    dateRange,
    summary,
    achievements,
    technologies,
    images = [],
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
  const isLogoCard = mediaType === 'logo';
  const isScreenshotCard =
    (mediaType === 'screenshot-desktop' || mediaType === 'screenshot-mobile') &&
    hasImages;
  const isMobileScreenshot = mediaType === 'screenshot-mobile';

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

  const isCurrentRole =
    props.isCurrent ??
    (dateRange.toLowerCase().includes('present') || dateRange.toLowerCase().includes('current'));

  const renderCurrentBadge = () => (
    <span className={classes.currentBadge} title='Currently active post'>
      <span className={classes.statusDot} aria-hidden='true' />
      <span>Current</span>
    </span>
  );

  const effectiveLogoSrc = logo ?? (isLogoCard ? images[0] : undefined);
  const showLogoHeader = Boolean(effectiveLogoSrc || isLogoCard);

  const renderLogoPlaceholder = () => {
    if (effectiveLogoSrc && !logoFailed) {
      return (
        <div className={classes.logoPlaceholder}>
          <img
            src={effectiveLogoSrc}
            alt={`${company} logo`}
            className={classes.logoPlaceholderImg}
            onError={() => setLogoFailed(true)}
          />
        </div>
      );
    }

    if (isLogoCard) {
      return (
        <div className={classes.monogramPlaceholder}>
          <span className={classes.logoPlaceholderMonogram}>
            {company.slice(0, 4)}
          </span>
        </div>
      );
    }

    return null;
  };

  const renderContentBody = () => (
    <>
      <div className={classes.experienceHeader}>
        {showLogoHeader && renderLogoPlaceholder()}
        <div className={classes.experienceHeaderInfo}>
          <h3 className={classes.portfolioCardTitle}>{role}</h3>
          <div className={classes.portfolioCardMeta}>
            <span className={classes.metaCompanyDate}>
              {company} · {dateRange}
            </span>
            {isCurrentRole && renderCurrentBadge()}
          </div>
        </div>
      </div>
      {summary && <p className={classes.portfolioCardSummary}>{summary}</p>}
      {achievements && achievements.length > 0 && (
        <ul className={classes.achievementList}>
          {achievements.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      <div className={classes.techChips}>
        {technologies.map((tech, index) => (
          <span key={index} className={classes.chip}>
            {tech}
          </span>
        ))}
      </div>
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
      aria-label={`${role} screenshot gallery`}
      aria-roledescription='carousel'
    >
      <div
        className={`${classes.slideShowContainer} ${
          isMobileScreenshot ? classes.slideShowContainerMobile : ''
        }`}
      >
        <div
          className={`${classes.slideShowWrapper} ${
            isMobileScreenshot ? classes.slideShowWrapperMobile : ''
          }`}
          style={{
            transform: `translateX(-${currentImageIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div key={index} className={classes.slideItem}>
              {isMobileScreenshot ? (
                <div className={classes.mobileDeviceBezel}>
                  <img
                    src={image}
                    className={classes.portfolioCardImageMobile}
                    alt={`${role} at ${company} - exhibit ${index + 1}`}
                    loading='lazy'
                    decoding='async'
                    onClick={() => openLightbox(index)}
                  />
                </div>
              ) : (
                <div className={classes.desktopDeviceFrame}>
                  <img
                    src={image}
                    className={classes.portfolioCardImage}
                    alt={`${role} at ${company} - exhibit ${index + 1}`}
                    loading='lazy'
                    decoding='async'
                    onClick={() => openLightbox(index)}
                  />
                  <span className={classes.enlargeHint}>CLICK TO EXPAND</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <div className={classes.carouselFooterControls}>
          <button
            type='button'
            className={`${classes.slideBtn} ${classes.slideBtnPrev}`}
            onClick={() => goPrev(true)}
            aria-label='Previous slide'
          >
            ‹
          </button>
          <div className={classes.slideDots} role='tablist'>
            {images.map((_, index) => (
              <button
                key={index}
                type='button'
                role='tab'
                className={`${classes.slideDot} ${
                  index === currentImageIndex ? classes.slideDotActive : ''
                }`}
                onClick={() => goToSlide(index, true)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === currentImageIndex}
              />
            ))}
          </div>
          <button
            type='button'
            className={`${classes.slideBtn} ${classes.slideBtnNext}`}
            onClick={() => goNext(true)}
            aria-label='Next slide'
          >
            ›
          </button>
        </div>
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
        aria-label={`${role} - exhibit viewer`}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeLightbox();
        }}
      >
        <button
          type='button'
          ref={lightboxCloseRef}
          className={classes.lightboxClose}
          onClick={closeLightbox}
          aria-label='Close exhibit viewer'
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
            alt={`${role} at ${company} - exhibit ${currentImageIndex + 1}`}
          />
        </figure>
        {images.length > 1 && (
          <>
            <button
              type='button'
              className={`${classes.lightboxBtn} ${classes.lightboxBtnPrev}`}
              onClick={() => goPrev(true)}
              aria-label='Previous exhibit'
            >
              ‹
            </button>
            <button
              type='button'
              className={`${classes.lightboxBtn} ${classes.lightboxBtnNext}`}
              onClick={() => goNext(true)}
              aria-label='Next exhibit'
            >
              ›
            </button>
            <div className={classes.lightboxCounter} aria-live='polite'>
              EXHIBIT {currentImageIndex + 1} OF {images.length}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <>
      <Reveal>
        <article
          className={`${classes.portfolioCard} ${
            !isScreenshotCard
              ? classes.portfolioCardFull
              : layout === 'right'
                ? classes.portfolioCardReverse
                : classes.portfolioCardNormal
          }`}
        >
          <div
            className={
              isScreenshotCard
                ? classes.portfolioContentContainer
                : classes.portfolioContentContainerFull
            }
          >
            {renderContentBody()}
          </div>
          {isScreenshotCard && (
            <div
              className={`${classes.mediaSection} ${
                isMobileScreenshot
                  ? classes.mediaSectionMobile
                  : classes.mediaSectionDesktop
              }`}
            >
              {renderSlideshow()}
            </div>
          )}
        </article>
      </Reveal>
      {renderLightbox()}
    </>
  );
}

export default ImageCard;
