import { useEffect, useState } from "react";
import "./Hero.css";

import mandirImg from "../assets/images/Madir,.jpg";
import eventImg from "../assets/images/Event..jfif";
import gaushalaImg from "../assets/images/Gaushala.jfif";
import galleryImg from "../assets/images/images.jfif";
import aboutImg from "../assets/images/Wo we Are.jpg";

const defaultHeroImages = [mandirImg, eventImg, gaushalaImg, galleryImg, aboutImg];

function Hero({ images = defaultHeroImages }) {
  const heroImages = images.length ? images : defaultHeroImages;
  const heroImageKey = heroImages.join("|");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    setIndex(0);
  }, [heroImageKey]);

  return (
    <section className="hero-section">
      <div className="hero-bg">
        {heroImages.map((image, imageIndex) => (
          <div
            key={image}
            className={`hero-slide${imageIndex === index ? " active" : ""}`}
            aria-hidden="true"
          >
            <img className="hero-slide-back" src={image} alt="" />
            <img className="hero-slide-main" src={image} alt="" />
          </div>
        ))}
      </div>
      <div className="hero-overlay"></div>

      <div className="hero-dots" aria-label="Hero image controls">
        {heroImages.map((image, dotIndex) => (
          <button
            key={image}
            className={dotIndex === index ? "active" : ""}
            type="button"
            onClick={() => setIndex(dotIndex)}
            aria-label={`Show hero image ${dotIndex + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
