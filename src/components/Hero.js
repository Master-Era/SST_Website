import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./HeroSection.css";

/*
  Local fallback slide.

  API content load થાય ત્યાં સુધી આ image તરત દેખાશે.
  આ image projectમાં હોવી જરૂરી છે:

  public/images/hero/mandir-1.jpg
*/

const fallbackSlides = [
  {
    id: "fallback-hero-1",
    type: "image",
    mediaUrl: "/images/hero/mandir-1.jpg",
    altText: "Shreeji Samipya Trust Mandir",
    active: true,
  },
];

const getMediaType = (slide) => {
  if (slide?.type) {
    return String(slide.type).toLowerCase();
  }

  if (slide?.mediaType) {
    return String(slide.mediaType).toLowerCase();
  }

  const mediaUrl =
    slide?.mediaUrl ||
    slide?.media_url ||
    slide?.videoUrl ||
    slide?.video_url ||
    slide?.image ||
    slide?.image_url ||
    slide?.src ||
    "";

  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];

  const isVideo = videoExtensions.some((extension) =>
    String(mediaUrl).toLowerCase().includes(extension)
  );

  return isVideo ? "video" : "image";
};

const getMediaUrl = (slide) => {
  return (
    slide?.mediaUrl ||
    slide?.media_url ||
    slide?.videoUrl ||
    slide?.video_url ||
    slide?.image ||
    slide?.image_url ||
    slide?.src ||
    ""
  );
};

const getPosterUrl = (slide) => {
  return (
    slide?.posterUrl ||
    slide?.poster_url ||
    slide?.thumbnail ||
    slide?.thumbnail_url ||
    ""
  );
};

const isSlideActive = (slide) => {
  if (
    slide?.is_active === undefined &&
    slide?.isActive === undefined &&
    slide?.active === undefined
  ) {
    return true;
  }

  return Boolean(
    slide?.is_active ??
      slide?.isActive ??
      slide?.active
  );
};

const HeroSection = ({
  slides = [],
  imageDuration = 6000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] =
    useState(false);

  const videoRefs = useRef([]);
  const imageTimerRef = useRef(null);

  /*
    API slides available હોય તો તે use થશે.
    API load પહેલાં અથવા empty data હોય તો fallback image દેખાશે.
  */

  const activeSlides = useMemo(() => {
    const sourceSlides =
      Array.isArray(slides) && slides.length > 0
        ? slides
        : fallbackSlides;

    const validSlides = sourceSlides.filter((slide) => {
      const mediaUrl = getMediaUrl(slide);

      return Boolean(mediaUrl) && isSlideActive(slide);
    });

    if (validSlides.length > 0) {
      return validSlides;
    }

    return fallbackSlides;
  }, [slides]);

  const totalSlides = activeSlides.length;

  const goToSlide = useCallback(
    (index) => {
      if (totalSlides === 0) {
        return;
      }

      const nextIndex =
        (index + totalSlides) % totalSlides;

      setCurrentSlide(nextIndex);
      setIsManuallyPaused(false);
    },
    [totalSlides]
  );

  const goToNextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const goToPreviousSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  /*
    API data બદલાય ત્યારે current slide valid rangeમાં રાખે છે.
  */

  useEffect(() => {
    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
    }
  }, [currentSlide, totalSlides]);

  /*
    Current slide change થાય ત્યારે:

    - inactive videos pause થશે
    - active video play થશે
    - active image માટે timer start થશે
  */

  useEffect(() => {
    if (totalSlides === 0) {
      return undefined;
    }

    window.clearTimeout(imageTimerRef.current);

    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }

      if (index !== currentSlide) {
        video.pause();

        try {
          video.currentTime = 0;
        } catch (error) {
          console.warn(
            "Video reset could not be completed:",
            error
          );
        }
      }
    });

    const currentItem = activeSlides[currentSlide];
    const currentType = getMediaType(currentItem);

    if (currentType === "video") {
      const currentVideo =
        videoRefs.current[currentSlide];

      if (currentVideo) {
        try {
          currentVideo.currentTime = 0;
        } catch (error) {
          console.warn(
            "Video start position could not be reset:",
            error
          );
        }

        if (!isManuallyPaused) {
          const playPromise = currentVideo.play();

          if (
            playPromise &&
            typeof playPromise.catch === "function"
          ) {
            playPromise.catch((error) => {
              console.warn(
                "Video autoplay was blocked:",
                error
              );
            });
          }
        }
      }
    } else if (!isManuallyPaused) {
      imageTimerRef.current = window.setTimeout(() => {
        goToNextSlide();
      }, imageDuration);
    }

    return () => {
      window.clearTimeout(imageTimerRef.current);
    };
  }, [
    activeSlides,
    currentSlide,
    totalSlides,
    imageDuration,
    goToNextSlide,
    isManuallyPaused,
  ]);

  /*
    Browser tab hidden થાય ત્યારે active video pause થશે.
    Tab visible થાય ત્યારે active video ફરી play થશે.
  */

  useEffect(() => {
    const handleVisibilityChange = () => {
      const activeVideo =
        videoRefs.current[currentSlide];

      if (document.hidden) {
        activeVideo?.pause();
        return;
      }

      const currentItem = activeSlides[currentSlide];

      if (
        activeVideo &&
        getMediaType(currentItem) === "video" &&
        !isManuallyPaused
      ) {
        activeVideo.play().catch(() => {});
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    activeSlides,
    currentSlide,
    isManuallyPaused,
  ]);

  const handleVideoEnded = () => {
    goToNextSlide();
  };

  const handleVideoError = () => {
    console.error("Hero video could not be loaded.");
    goToNextSlide();
  };

  const handleImageError = (event) => {
    const imageElement = event.currentTarget;

    imageElement.onerror = null;

    if (
      imageElement.src.includes(
        "/images/hero/mandir-1.jpg"
      )
    ) {
      return;
    }

    imageElement.src =
      "/images/hero/mandir-1.jpg";
  };

  const togglePlayPause = () => {
    if (totalSlides === 0) {
      return;
    }

    const currentItem = activeSlides[currentSlide];
    const currentType = getMediaType(currentItem);

    if (currentType === "video") {
      const currentVideo =
        videoRefs.current[currentSlide];

      if (!currentVideo) {
        return;
      }

      if (currentVideo.paused) {
        currentVideo
          .play()
          .then(() => {
            setIsManuallyPaused(false);
          })
          .catch(() => {});
      } else {
        currentVideo.pause();
        setIsManuallyPaused(true);
      }

      return;
    }

    setIsManuallyPaused((previousValue) => {
      return !previousValue;
    });
  };

  const currentMediaType = getMediaType(
    activeSlides[currentSlide]
  );

  return (
    <section
      className="hero-section"
      aria-label="Website hero media slider"
    >
      <div className="hero-bg">
        {activeSlides.map((slide, index) => {
          const mediaType = getMediaType(slide);
          const mediaUrl =
            getMediaUrl(slide) ||
            "/images/hero/mandir-1.jpg";

          const posterUrl = getPosterUrl(slide);
          const isActive = index === currentSlide;

          return (
            <div
              key={
                slide.id ||
                `${mediaUrl}-${index}`
              }
              className={`hero-slide ${
                isActive ? "active" : ""
              }`}
              aria-hidden={!isActive}
            >
              {mediaType === "video" ? (
                <video
                  ref={(element) => {
                    videoRefs.current[index] = element;
                  }}
                  className="hero-media hero-video"
                  src={mediaUrl}
                  poster={
                    posterUrl ||
                    "/images/hero/mandir-1.jpg"
                  }
                  muted
                  playsInline
                  preload={
                    isActive ? "auto" : "metadata"
                  }
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  onClick={togglePlayPause}
                  aria-label={
                    slide.altText ||
                    slide.alt_text ||
                    slide.title ||
                    "Hero video"
                  }
                />
              ) : (
                <img
                  className="hero-media hero-image"
                  src={mediaUrl}
                  alt={
                    slide.altText ||
                    slide.alt_text ||
                    slide.title ||
                    "Shreeji Samipya Trust Mandir"
                  }
                  loading={
                    index === 0 ? "eager" : "lazy"
                  }
                  fetchPriority={
                    index === 0 ? "high" : "auto"
                  }
                  decoding="async"
                  draggable="false"
                  onError={handleImageError}
                />
              )}

              <div className="hero-media-shade" />
            </div>
          );
        })}

        {totalSlides > 1 && (
          <>
            <button
              type="button"
              className="hero-arrow hero-prev"
              onClick={goToPreviousSlide}
              aria-label="Previous slide"
            >
              &#10094;
            </button>

            <button
              type="button"
              className="hero-arrow hero-next"
              onClick={goToNextSlide}
              aria-label="Next slide"
            >
              &#10095;
            </button>
          </>
        )}

        {currentMediaType === "video" && (
          <div className="hero-video-label">
            Video
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;