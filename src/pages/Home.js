import "./Home.css";
import { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero";
import PageLoader from "../components/PageLoader";
import { getContentMap, mediaUrl } from "../services/content";
import aboutImg from "../assets/images/Wo we Are.jpg";
import activityImg from "../assets/images/Gaushala.jfif";
import eventImg from "../assets/images/Event..jfif";
import mandirImg from "../assets/images/Madir,.jpg";
import galleryImg from "../assets/images/images.jfif";

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
  /*
    contentMap starts as `null` (not `{}`) so we can tell the difference
    between "still loading from the server" and "loaded, but admin has not
    added anything yet". While it is `null` we do not render the hero or
    card sections at all, so the site never shows the old/default image
    for a moment and then swaps to the admin image - it only ever shows
    the admin content, once, after it has actually arrived.
  */
  const [contentMap, setContentMap] = useState(null);

  useEffect(() => {
    let isMounted = true;

    getContentMap()
      .then((data) => {
        if (isMounted) setContentMap(data || {});
      })
      .catch(() => {
        if (isMounted) setContentMap({});
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isLoading = contentMap === null;
  const safeContentMap = contentMap || {};

  const heroSlides = useMemo(() => {
    const adminHero = safeContentMap["Admin Website Data"]?.home?.hero || [];
    const adminSlides = adminHero
      .filter((item) => item.active !== false)
      .map((item) => ({
        ...item,
        image: mediaUrl(item.image || item.poster),
        videoUrl: mediaUrl(item.videoUrl || item.video),
      }))
      .filter((item) => item.image || item.videoUrl);
    if (adminSlides.length) return adminSlides;

    const imageText = safeContentMap["Home - Hero Images"]?.imageUrls || safeContentMap["Home - Hero Images"]?.imageUrl || "";
    return String(imageText)
      .split(/\n|,/)
      .map((item, index) => ({ id: `legacy-${index}`, image: mediaUrl(item.trim()), active: true }))
      .filter((item) => item.image);
  }, [safeContentMap]);

  const dynamicTrustCards = useMemo(() => {
    const adminSections = safeContentMap["Admin Website Data"]?.home?.sections || [];
    if (adminSections.length) {
      return adminSections
        .filter((item) => item.active !== false)
        .map((item, index) => ({
          title: item.title || `Section ${index + 1}`,
          href: trustCards[index]?.href || "/about",
          text: item.content || "",
          image: mediaUrl(item.image),
        }))
        .filter((card) => card.image || card.text);
    }

    // Legacy per-card admin keys ("Home - Who We Are", etc). A card only
    // shows up here if the admin panel has actually saved something for
    // it - the hardcoded title/image/text above is used only to know
    // which admin key to look up, never as a value shown on the site.
    return trustCards
      .map((card) => {
        const saved = safeContentMap[`Home - ${card.title}`];
        if (!saved) return null;
        return {
          title: saved.title || card.title,
          href: card.href,
          text: saved.description || "",
          image: mediaUrl(saved.imageUrl),
        };
      })
      .filter(Boolean);
  }, [safeContentMap]);

  const dynamicActivityCards = useMemo(() => {
    const adminActivities = safeContentMap["Admin Website Data"]?.activity?.activities || [];
    if (adminActivities.length) {
      return adminActivities
        .filter((item) => item.active !== false)
        .map((item, index) => ({
          title: item.title || `Activity ${index + 1}`,
          href: "/activity",
          text: item.content || "",
          image: mediaUrl(item.image),
        }))
        .filter((card) => card.image || card.text);
    }

    return activityCards
      .map((card) => {
        const saved = safeContentMap[`Home Activity - ${card.title}`];
        if (!saved) return null;
        return {
          title: saved.title || card.title,
          href: card.href,
          text: saved.description || "",
          image: mediaUrl(saved.imageUrl),
        };
      })
      .filter(Boolean);
  }, [safeContentMap]);

  const founderContent = safeContentMap["Admin Website Data"]?.home?.founder || safeContentMap["Home - Founder Image"] || {};
  const founderImage = mediaUrl(founderContent.image || founderContent.imageUrl);

  if (isLoading) {
    return (
      <main className="home-page">
        <PageLoader message="Loading Shreeji Samipya Trust..." />
      </main>
    );
  }

  return (
    <main className="home-page">
      <Hero slides={heroSlides} />

      {dynamicTrustCards.length > 0 && (
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
      )}

      {dynamicActivityCards.length > 0 && (
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
      )}

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

      {founderImage && (
        <section className="founders-section">
          <div className="page-shell">
            <div className="section-heading">
              <h2>Founders</h2>
              <p>Open the founder introduction and Guru Parampara details from the About page.</p>
            </div>
            <a className="founder-single-card" href="/about#founder">
              <img src={founderImage} alt={founderContent.title || "Guru Parampara"} />

              <strong>{founderContent.title || "Guru Parampara"}</strong>
            </a>
          </div>
        </section>
      )}
    </main>
  );
}

export default Home;
