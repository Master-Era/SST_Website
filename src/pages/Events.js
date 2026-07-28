import { useEffect, useMemo, useState } from "react";
import "./Events.css";
import { getContentMap, mediaUrl } from "../services/content";
import PageLoader from "../components/PageLoader";

function Events() {
  const [adminWebsite, setAdminWebsite] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    getContentMap()
      .then((map) => setAdminWebsite(map["Admin Website Data"] || null))
      .catch(() => setAdminWebsite(null))
      .finally(() => setDataLoaded(true));
  }, []);
  const liveEvents = useMemo(() => {
    const saved = adminWebsite?.events?.items || [];
    return saved
      .filter((item) => item.active !== false)
      .map((item) => ({
        title: item.title || "Event",
        image: mediaUrl(item.image),
        content: item.content || "",
      }))
      .filter((item) => item.image);
  }, [adminWebsite]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setSelectedEvent(liveEvents[0] || null);
  }, [liveEvents]);

  if (!dataLoaded) {
    return (
      <main className="events-page">
        <PageLoader message="Loading..." />
      </main>
    );
  }

  return (
    <main className="events-page">
      {selectedEvent && (
        <section className="events-intro page-shell">
          {/* <h1>{selectedEvent.title}</h1> */}
          <div className="event-divider" aria-hidden="true">
            <span />
          </div>
          {(adminWebsite?.events?.intro || selectedEvent.content) && (
            <p>{adminWebsite?.events?.intro || selectedEvent.content}</p>
          )}
        </section>
      )}

      {liveEvents.length > 0 && (
        <section className="events-gallery page-shell" aria-label="Event images">
          <div className="gallery-note">
            {/* <h2>Event Images</h2> */}
          </div>

          <div className="event-image-grid">
            {liveEvents.map((event, index) => (
              <button
                className={`event-image-card float-${(index % 4) + 1} ${selectedEvent?.title === event.title ? "active" : ""}`}
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
      )}
    </main>
  );
}

export default Events;
