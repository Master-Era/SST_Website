import { useEffect, useState } from "react";
import "./Activity.css";
import { getContentMap, mediaUrl } from "../services/content";
import PageLoader from "../components/PageLoader";
import mandirImg from "../assets/images/Madir,.jpg";
import eventImg from "../assets/images/Event..jfif";
import gaushalaImg from "../assets/images/Gaushala.jfif";
import galleryImg from "../assets/images/images.jfif";
import trustImg from "../assets/images/Wo we Are.jpg";

const slideImages = [eventImg, mandirImg, gaushalaImg, galleryImg, trustImg];

const activityParts = [
  {
    id: "activity-service",
    title: "Activity",
    intro: "Health, education, environment and day-to-day seva activities for society.",
    activities: [
      {
        id: "blood-donation",
        title: "Blood Donation",
        detail:
          "Blood donation camps connect donors, volunteers and medical teams for lifesaving seva. The trust can organize donor registration, awareness, camp schedule and follow-up support.",
      },
      {
        id: "health-care",
        title: "Health Care",
        detail:
          "Health care activity includes checkup camps, awareness sessions, basic medicine guidance and referral support for families who need timely care.",
      },
      {
        id: "educate-child",
        title: "Educate Child",
        detail:
          "Child education support helps students with study material, guidance, values and encouragement so children can grow with knowledge and sanskar.",
      },
      {
        id: "social-help-relief",
        title: "Social Help / Relief",
        detail:
          "Social relief work supports people during difficult times through essentials, coordination, volunteer help and compassionate follow-up.",
      },
      {
        id: "food-distribute",
        title: "Food Distribute",
        detail:
          "Food distribution seva provides prasadi and meals for devotees, visitors and needy families with cleanliness, dignity and devotion.",
      },
      {
        id: "environment-care",
        title: "Environment Care",
        detail:
          "Environment care includes cleanliness drives, awareness, campus maintenance and responsible community participation.",
      },
    ],
  },
  {
    id: "social-care",
    title: "Social Care",
    intro: "Satsang, youth engagement and pilgrimage activities for spiritual connection.",
    activities: [
      {
        id: "weekly-sabha",
        title: "Weekly Sabha",
        detail:
          "Weekly sabha brings devotees together for katha, kirtan, dhun, discussion and seva planning in a disciplined satsang atmosphere.",
      },
      {
        id: "youth-activity",
        title: "Youth Activity",
        detail:
          "Youth activities build leadership, discipline, seva bhav and spiritual confidence through group programs and learning sessions.",
      },
      {
        id: "tirth-yatra",
        title: "Tirth Yatra",
        detail:
          "Tirth yatra connects devotees with sacred places, history, darshan and group satsang, managed with planning and care.",
      },
    ],
  },
];

function ActivitySlider({ activity, images }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    setSlide(0);
  }, [activity.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const next = () => setSlide((current) => (current + 1) % images.length);
  const prev = () => setSlide((current) => (current - 1 + images.length) % images.length);

  return (
    <div className="activity-slider">
      <button className="image-arrow left" type="button" onClick={prev} aria-label="Previous image">&lsaquo;</button>
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
      <button className="image-arrow right" type="button" onClick={next} aria-label="Next image">&rsaquo;</button>
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
      activities: adminWebsite?.activity?.activities?.length ? adminWebsite.activity.activities : activityParts[0].activities,
    },
    {
      ...activityParts[1],
      activities: adminWebsite?.activity?.socialCare?.length ? adminWebsite.activity.socialCare : activityParts[1].activities,
    },
  ];

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
                <article className="activity-detail-card" id={activity.id} key={activity.id}>
                  <div className="activity-detail-copy">
                    <small>{String(index + 1).padStart(2, "0")}</small>
                    <h2>{activity.title}</h2>
                    <p>{activity.detail}</p>
                    <a href="/gallery#activity-gallery">Open Gallery</a>
                  </div>
                  <ActivitySlider activity={activity} images={[mediaUrl(activity.image), ...slideImages.slice(0, 4)].filter(Boolean)} />
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
