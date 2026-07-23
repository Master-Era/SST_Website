import "./Home.css";
import { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero";
import { getContentMap, mediaUrl } from "../services/content";
import aboutImg from "../assets/images/Wo we Are.jpg";
import activityImg from "../assets/images/Gaushala.jfif";
import eventImg from "../assets/images/Event..jfif";
import mandirImg from "../assets/images/Madir,.jpg";
import galleryImg from "../assets/images/images.jfif";
import logoImg from "../assets/images/shreeji-logo.png";

const trustCards = [
  {
    title: "Who We Are",
    href: "/about#who-we-are",
    image: aboutImg,
    text: "Shreeji Samipya Trust is a mandir-centered NGO working for satsang, seva and community upliftment.",
  },
  {
    title: "What Are We Doing",
    href: "/about#what-we-do",
    image: mandirImg,
    text: "We organize mandir seva, devotee connection, gurukul support and social welfare activities.",
  },
  {
    title: "Activity",
    href: "/activity",
    image: activityImg,
    text: "Gaushala, Anna Dan, Vastra Dan, Satsang Sabha and Utsav seva are managed section-wise.",
  },
  {
    title: "Donation",
    href: "/donation",
    image: galleryImg,
    text: "Donation support helps Gaushala, Mandir Seva, Gurukul Seva, Utsav and community programs.",
  },
];

const events = [
  ["Dharmik Utsav", eventImg, "Festival seva, mandir decoration and bhakti gatherings."],
  ["Social Seva", mandirImg, "Community support programs planned with volunteers."],
  ["Satsang Sabha", galleryImg, "Weekly satsang, youth guidance and devotee connection."],
];

const activityCards = [
  {
    title: "Blood Donation",
    href: "/activity",
    image: eventImg,
    text: "Blood donation camp connects volunteers and donors for lifesaving seva. The activity is organized with discipline and community support.",
  },
  {
    title: "Health Care",
    href: "/activity",
    image: mandirImg,
    text: "Health care provides basic checkups, awareness and guidance for families. It brings practical care close to devotees and local people.",
  },
  {
    title: "Educate Child",
    href: "/activity",
    image: galleryImg,
    text: "Child education support helps with learning materials, guidance and sanskar. The goal is to serve children with dignity and care.",
  },
];

function Home() {
  const [contentMap, setContentMap] = useState({});

  useEffect(() => {
    getContentMap().then(setContentMap).catch(() => setContentMap({}));
  }, []);

  const heroImages = useMemo(() => {
    const adminHero = contentMap["Admin Website Data"]?.home?.hero || [];
    const adminImages = adminHero.map((item) => mediaUrl(item.image)).filter(Boolean);
    if (adminImages.length) return adminImages;
    const imageText = contentMap["Home - Hero Images"]?.imageUrls || contentMap["Home - Hero Images"]?.imageUrl || "";
    const images = String(imageText)
      .split(/\n|,/)
      .map((item) => mediaUrl(item.trim()))
      .filter(Boolean);
    return images;
  }, [contentMap]);

  const dynamicTrustCards = useMemo(() => {
    const adminSections = contentMap["Admin Website Data"]?.home?.sections || [];
    if (adminSections.length) {
      return adminSections
        .filter((item) => item.active !== false)
        .map((item, index) => ({
          title: item.title || `Section ${index + 1}`,
          href: trustCards[index]?.href || "/about",
          text: item.content || "",
          image: mediaUrl(item.image) || trustCards[index % trustCards.length]?.image || aboutImg,
        }));
    }
    return trustCards.map((card) => {
      const saved = contentMap[`Home - ${card.title}`] || {};
      return {
        ...card,
        title: saved.title || card.title,
        text: saved.description || card.text,
        image: mediaUrl(saved.imageUrl) || card.image,
      };
    });
  }, [contentMap]);

  const dynamicActivityCards = useMemo(() => {
    const adminActivities = contentMap["Admin Website Data"]?.activity?.activities || [];
    if (adminActivities.length) {
      return adminActivities
        .filter((item) => item.active !== false)
        .map((item, index) => ({
          title: item.title || `Activity ${index + 1}`,
          href: "/activity",
          text: item.content || "",
          image: mediaUrl(item.image) || activityCards[index % activityCards.length]?.image || eventImg,
        }));
    }
    return activityCards.map((card) => {
      const saved = contentMap[`Home Activity - ${card.title}`] || {};
      return {
        ...card,
        title: saved.title || card.title,
        text: saved.description || card.text,
        image: mediaUrl(saved.imageUrl) || card.image,
      };
    });
  }, [contentMap]);

  const founderContent = contentMap["Admin Website Data"]?.home?.founder || contentMap["Home - Founder Image"] || {};

  return (
    <main className="home-page">
      <Hero images={heroImages} />

      <section className="home-trust-section">
        <div className="page-shell">
          <div className="section-heading">
            <h1>Shreeji Samipya Trust</h1>
            <p>Clear information blocks for who we are, what we do, activities and donation support.</p>
          </div>

          <div className="trust-card-grid">
            {dynamicTrustCards.map((card) => (
              <article className="trust-card" key={card.title}>
                <div className="trust-card-media">
                  <img src={card.image} alt={card.title} />
                </div>
                <div>
                  <h2>{card.title}</h2>
                  <p>{card.text}</p>
                  <a href={card.href}>View More</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-activity-section">
        <div className="page-shell">
          <div className="section-heading">
            <h2>Activity</h2>
            <p>Focused seva cards with direct connection to the matching activity details.</p>
          </div>

          <div className="home-activity-grid">
            {dynamicActivityCards.map((card) => (
              <article className="home-activity-card" key={card.title}>
                <div className="activity-card-image">
                  <img src={card.image} alt={card.title} />
                </div>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <a href={card.href}>View More</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-events-section">
        <div className="page-shell">
          <div className="section-heading light">
            <h2>Events</h2>
            <p>Mandir events, social care gatherings and satsang memories in a clean visual flow.</p>
          </div>
          <div className="round-event-grid">
            {events.map(([title, image, text]) => (
              <article className="round-event-card" key={title}>
                <img src={image} alt={title} />
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a href="/events">View More</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="founders-section">
        <div className="page-shell">
          <div className="section-heading">
            <h2>Founders</h2>
            <p>Open the founder introduction and Guru Parampara details from the About page.</p>
          </div>
          <a className="founder-single-card" href="/about#founder">
            <img src={mediaUrl(founderContent.image || founderContent.imageUrl) || logoImg} alt={founderContent.title || "Guruhari Guidance"} />
            <span>Founder Guidance</span>
            <strong>{founderContent.title || "Guruhari Guidance"}</strong>
          </a>
        </div>
      </section>
    </main>
  );
}

export default Home;
