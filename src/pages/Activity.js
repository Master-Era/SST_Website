import { useEffect, useState } from "react";
import "./Activity.css";
import { getContentMap, mediaUrl } from "../services/content";
import PageLoader from "../components/PageLoader";

const activityParts = [
  {
    id: "activity-service",
    title: "Activity",
    intro: "Health, education, environment and day-to-day seva activities for society.",
  },
  {
    id: "social-care",
    title: "Social Care",
    intro: "Satsang, youth engagement and pilgrimage activities for spiritual connection.",
  },
];

function ActivitySlider({ activity, images }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setSlide(0);
  }, [activity.id]);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  const next = () => setSlide((current) => (current + 1) % images.length);
  const prev = () => setSlide((current) => (current - 1 + images.length) % images.length);

  return (
    <div className="activity-slider">
      {images.length > 1 && (
        <button className="image-arrow left" type="button" onClick={prev} aria-label="Previous image">&lsaquo;</button>
      )}
      {images.map((image, index) => (
        <a
          className={index === slide ? "active" : ""}
          href="/gallery#activity-gallery"
          key={image}
          aria-label={`Open ${activity.title} gallery`}
        >
          <img src={image} alt={activity.title} />
        </a>
      ))}
      {images.length > 1 && (
        <button className="image-arrow right" type="button" onClick={next} aria-label="Next image">&rsaquo;</button>
      )}
    </div>
  );
}

function Activity() {
  const [adminWebsite, setAdminWebsite] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    getContentMap()
      .then((map) => setAdminWebsite(map["Admin Website Data"] || null))
      .catch(() => setAdminWebsite(null))
      .finally(() => setDataLoaded(true));
  }, []);

  const parts = [
    {
      ...activityParts[0],
      activities: adminWebsite?.activity?.activities || [],
    },
    {
      ...activityParts[1],
      activities: adminWebsite?.activity?.socialCare || [],
    },
  ].filter((part) => part.activities.length > 0);

  if (!dataLoaded) {
    return (
      <main className="activity-page">
        <PageLoader message="Loading..." />
      </main>
    );
  }

  return (
    <main className="activity-page">
      {parts.map((part) => (
        <section className="activity-part" id={part.id} key={part.title}>
          <div className="page-shell">
            <div className="part-heading">
              <h2>{part.title}</h2>
              <p>{part.intro}</p>
            </div>

            <div className="activity-section-list">
              {part.activities.map((activity, index) => (
                <article className="activity-detail-card" id={activity.id} key={activity.id || activity.title || index}>
                  <div className="activity-detail-copy">
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <h2>{activity.title}</h2>
                    <p>{activity.detail || activity.content}</p>
                    <a href="/gallery#activity-gallery">Open Gallery</a>
                  </div>
                  <ActivitySlider activity={activity} images={[mediaUrl(activity.image)].filter(Boolean)} />
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}

export { activityParts };
export default Activity;
