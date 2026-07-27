import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import "./HeroSection.css";

/*
  Temporary demo data.

  Admin/API માંથી data આવતો હોય તો આ array remove કરીને
  props અથવા API data use કરી શકો છો.

  type:
  - "image"
  - "video"
*/

const defaultSlides = [
  {
    id: 1,
    type: "image",
    mediaUrl: "/images/hero/mandir-1.jpg",
    altText: "Shreeji Samipya Trust Mandir",
  },
  {
    id: 2,
    type: "video",
    mediaUrl: "/videos/mandir-video.mp4",
    posterUrl: "/images/hero/video-poster.jpg",
    altText: "Mandir Video",
  },
  {
    id: 3,
    type: "image",
    mediaUrl: "/images/hero/mandir-2.jpg",
    altText: "Temple View",
  },
];

const getMediaType = (slide) => {
  if (slide?.type) {
    return slide.type.toLowerCase();
  }

  const mediaUrl =
    slide?.mediaUrl ||
    slide?.media_url ||
    slide?.videoUrl ||
    slide?.video_url ||
    slide?.image ||
    slide?.image_url ||
    "";

  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];

  const isVideo = videoExtensions.some((extension) =>
    mediaUrl.toLowerCase().includes(extension)
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

const HeroSection = ({
  slides = defaultSlides,
  imageDuration = 6000,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);

  const videoRefs = useRef([]);
  const imageTimerRef = useRef(null);

  const activeSlides = Array.isArray(slides)
    ? slides.filter((slide) => {
        const mediaUrl = getMediaUrl(slide);

        const isActive =
          slide?.is_active === undefined &&
          slide?.isActive === undefined &&
          slide?.active === undefined
            ? true
            : Boolean(
                slide?.is_active ??
                  slide?.isActive ??
                  slide?.active
              );

        return mediaUrl && isActive;
      })
    : [];

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
    Current slide change થાય ત્યારે:

    - બધા inactive videos pause થશે
    - active video beginning થી play થશે
    - active image માટે timer start થશે
  */

  useEffect(() => {
    if (totalSlides === 0) {
      return undefined;
    }

    if (currentSlide >= totalSlides) {
      setCurrentSlide(0);
      return undefined;
    }

    window.clearTimeout(imageTimerRef.current);

    videoRefs.current.forEach((video, index) => {
      if (!video) {
        return;
      }

      if (index !== currentSlide) {
        video.pause();
        video.currentTime = 0;
      }
    });

    const currentItem = activeSlides[currentSlide];
    const currentType = getMediaType(currentItem);

    if (currentType === "video") {
      const currentVideo =
        videoRefs.current[currentSlide];

      if (currentVideo) {
        currentVideo.currentTime = 0;

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
    Browser tab hidden થાય ત્યારે video pause થશે.

    User પાછો tab પર આવે ત્યારે active video ફરી play થશે.
  */

  useEffect(() => {
    const handleVisibilityChange = () => {
      const activeVideo =
        videoRefs.current[currentSlide];

      if (document.hidden) {
        activeVideo?.pause();
        return;
      }

      if (
        activeVideo &&
        getMediaType(activeSlides[currentSlide]) ===
          "video" &&
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

  if (!activeSlides.length) {
    return null;
}

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
          const mediaUrl = getMediaUrl(slide);
          const posterUrl = getPosterUrl(slide);

          const isActive = index === currentSlide;

          return (
            <div
              key={slide.id || `${mediaUrl}-${index}`}
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
                  poster={posterUrl || undefined}
                  muted
                  playsInline
                  preload={isActive ? "auto" : "metadata"}
                  onEnded={handleVideoEnded}
                  onError={handleVideoError}
                  onClick={togglePlayPause}
                  aria-label={
                    slide.altText ||
                    slide.alt_text ||
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
                    "Hero image"
                  }
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={
                    index === 0 ? "high" : "auto"
                  }
                  draggable="false"
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