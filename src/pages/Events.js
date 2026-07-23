import { useEffect, useMemo, useState } from "react";
import "./Events.css";
import { getContentMap, mediaUrl } from "../services/content";
import mandirImg from "../assets/images/Madir,.jpg";
import eventImg from "../assets/images/Event..jfif";
import gaushalaImg from "../assets/images/Gaushala.jfif";
import galleryImg from "../assets/images/images.jfif";
import trustImg from "../assets/images/Wo we Are.jpg";

const eventImages = [
  { title: "Utsav Sabha", image: eventImg },
  { title: "Mandir Darshan", image: mandirImg },
  { title: "Seva Gathering", image: galleryImg },
  { title: "Bhakti Program", image: trustImg },
  { title: "Samuhik Seva", image: gaushalaImg },
  { title: "Mahaprasad", image: eventImg },
  { title: "Bal Sanskar", image: galleryImg },
  { title: "Satsang Milan", image: mandirImg },
  { title: "Community Program", image: trustImg },
  { title: "Volunteer Seva", image: gaushalaImg },
  { title: "Festival Memory", image: eventImg },
  { title: "Devotee Darshan", image: mandirImg },
];

function Events() {
  const [adminWebsite, setAdminWebsite] = useState(null);
  useEffect(() => {
    getContentMap().then((map) => setAdminWebsite(map["Admin Website Data"] || null)).catch(() => setAdminWebsite(null));
  }, []);
  const liveEvents = useMemo(() => {
    const saved = adminWebsite?.events?.items || [];
    if (!saved.length) return eventImages;
    return saved.map((item) => ({
      title: item.title || "Event",
      image: mediaUrl(item.image) || eventImg,
      content: item.content || "",
    }));
  }, [adminWebsite]);
  const [selectedEvent, setSelectedEvent] = useState(eventImages[0]);

  useEffect(() => {
    setSelectedEvent(liveEvents[0] || eventImages[0]);
  }, [liveEvents]);

  return (
    <main className="events-page">
      <section className="events-intro page-shell">
        {/* <span>Events</span> */}
        <h1>{selectedEvent.title}</h1>
        <div className="event-divider" aria-hidden="true">
          <span />
        </div>
        <p>
          {adminWebsite?.events?.intro || selectedEvent.content || `Shreeji Samipya Sanstha ma utsav bhakti, seva, satsang ane samajik
          jodaan mate karvama ave che. Mandir darshan, katha-kirtan,
          mahaprasad, bal sanskar, volunteer seva ane community gathering jeva
          programs yojai che, jethi devotees ne ek saath bhakti ane seva no
          anubhav male.`}
        </p>

        <div className="selected-event-name" aria-live="polite">
          Aa image: <strong>{selectedEvent.title}</strong>
        </div>
      </section>

      <section className="events-gallery page-shell" aria-label="Event images">
        <div className="gallery-note">
          <h2>Event Images</h2>
          <p>Badhi images full dekhashe, crop nahi thay. Niche medium size grid ma 3-4 images ek line ma ave che.</p>
        </div>

        <div className="event-image-grid">
          {liveEvents.map((event, index) => (
            <button
              className={`event-image-card float-${(index % 4) + 1} ${selectedEvent.title === event.title ? "active" : ""}`}
              key={`${event.title}-${index}`}
              type="button"
              onClick={() => setSelectedEvent(event)}
              onMouseEnter={() => setSelectedEvent(event)}
            >
              <img src={event.image} alt={event.title} />
              <span>{event.title}</span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Events;
