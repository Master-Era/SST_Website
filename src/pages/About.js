import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./About.css";
import { getContentMap, mediaUrl } from "../services/content";
import PageLoader from "../components/PageLoader";

function getInitialSection() {
  const hash = window.location.hash.replace("#", "");
  return hash || "who-we-are";
}

function ImageCarousel({ images, title }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [title]);

  useEffect(() => {
    if (images.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="about-carousel">
      {images.map((image, index) => (
        <img className={index === active ? "active" : ""} src={image} alt={`${title} ${index + 1}`} key={`${title}-${index}`} />
      ))}
      {images.length > 1 && (
        <div className="about-carousel-dots">
          {images.map((image, index) => (
            <button
              className={index === active ? "active" : ""}
              type="button"
              aria-label={`Show ${title} image ${index + 1}`}
              onClick={() => setActive(index)}
              key={`${image}-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AboutSection({ section }) {
  return (
    <section className="about-reader-section" id={section.id}>
      <h2>{section.title}</h2>
      {section.images.length > 0 && (
        <ImageCarousel images={section.images} title={section.title} />
      )}
      {section.text && <p className="lead">{section.text}</p>}
      {section.details && <p>{section.details}</p>}
      {section.points.length > 0 && (
        <div className="about-tags">
          {section.points.map((point) => (
            <strong key={point}>{point}</strong>
          ))}
        </div>
      )}
    </section>
  );
}

function FounderSection({ section }) {
  if (!section) {
    return (
      <section className="about-reader-section founder-reader" id="founder">
        <h2>Founder</h2>
        <p className="lead">Founder details have not been added from the admin panel yet.</p>
      </section>
    );
  }

  return (
    <section className="about-reader-section founder-reader" id="founder">
      <h2>{section.title || "Founder"}</h2>
      {section.images.length > 0 && (
        <ImageCarousel images={section.images} title={section.title || "Founder"} />
      )}
      {section.text && <p className="lead">{section.text}</p>}
      {section.details && section.details !== section.text && <p>{section.details}</p>}
    </section>
  );
}

function GuruSection({ guru }) {
  return (
    <section className="about-reader-section guru-only-section" id={guru.id}>
      <h2>{guru.name}</h2>
      {guru.images.length > 0 && (
        <ImageCarousel images={guru.images} title={guru.name} />
      )}
      {guru.text && <p className="lead">{guru.text}</p>}
    </section>
  );
}

function About() {
  const location = useLocation();
  const [activeId, setActiveId] = useState(getInitialSection);
  const [founderMenuOpen, setFounderMenuOpen] = useState(false);
  const [adminWebsite, setAdminWebsite] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  useEffect(() => {
    getContentMap()
      .then((map) => setAdminWebsite(map["Admin Website Data"] || null))
      .catch(() => setAdminWebsite(null))
      .finally(() => setDataLoaded(true));
  }, []);
  const liveSections = useMemo(() => {
    const savedSections = adminWebsite?.about?.sections || [];
    return savedSections
      .filter((item) => String(item.title || "").toLowerCase() !== "founder")
      .filter((item) => item.active !== false)
      .map((item, index) => ({
        id: (item.title || `section-${index + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        label: item.title || `Section ${index + 1}`,
        title: item.title || `Section ${index + 1}`,
        images: [
          mediaUrl(item.image),
          ...((item.images || []).map((image) => mediaUrl(image))),
        ].filter(Boolean),
        text: item.content || "",
        details: "",
        points: [],
      }));
  }, [adminWebsite]);
  const liveGuruParampara = useMemo(() => {
    const saved = adminWebsite?.about?.guruParampara || [];
    return saved
      .filter((item) => item.active !== false)
      .map((item, index) => ({
        id: (item.title || `guru-${index + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        name: item.title || `Guru ${index + 1}`,
        text: item.content || "",
        images: [
          mediaUrl(item.image),
          ...((item.images || []).map((image) => mediaUrl(image))),
        ].filter(Boolean),
      }));
  }, [adminWebsite]);
  const liveMenuItems = useMemo(() => [
    ...liveSections.map((section) => ({ id: section.id, label: section.label, type: "section" })),
    { id: "founder", label: "Founder", type: "founder" },
  ], [liveSections]);
  const activeSection = liveSections.find((section) => section.id === activeId);
  const activeGuru = liveGuruParampara.find((guru) => guru.id === activeId);
  const founderSection = useMemo(() => {
    const saved = adminWebsite?.about?.sections?.find((item) => String(item.title || "").toLowerCase() === "founder");
    if (!saved) return null;
    return {
      title: saved.title || "Founder",
      images: [
        mediaUrl(saved.image),
        ...((saved.images || []).map((image) => mediaUrl(image))),
      ].filter(Boolean),
      text: saved.content || "",
      details: "",
    };
  }, [adminWebsite]);
  const showFounderChildren = activeId === "founder" || founderMenuOpen;

  const selectSection = (id) => {
    setActiveId(id);
    window.history.replaceState(null, "", `/about#${id}`);
  };

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) {
      setActiveId("who-we-are");
      setFounderMenuOpen(false);
      return;
    }
    if (hash === "founder" || liveGuruParampara.some((guru) => guru.id === hash) || liveSections.some((section) => section.id === hash)) {
      setActiveId(hash);
      setFounderMenuOpen(false);
    }
  }, [location.hash, location.pathname, liveSections, liveGuruParampara]);

  if (!dataLoaded) {
    return (
      <main className="about-page">
        <PageLoader message="Loading..." />
      </main>
    );
  }

  return (
    <main className="about-page">
      <section className="about-intro page-shell">
        <span></span>
        {/* <h1>Trust, Seva and Guru Parampara</h1>
        <p>
          Left menu par click karsho to selected section j open thase. Structure
          simple, direct and easy to read che.
        </p> */}
      </section>

      <div className="about-reader-shell page-shell">
        <aside className="about-side-menu">
          {liveMenuItems.map((item) => (
            item.id === "founder" ? (
              <div
                className="founder-menu-group"
                key={item.id}
                onMouseEnter={() => setFounderMenuOpen(true)}
                onMouseLeave={() => setFounderMenuOpen(false)}
              >
                <button
                  className={activeId === item.id ? "active" : ""}
                  type="button"
                  onClick={() => selectSection(item.id)}
                >
                  <span>&rsaquo;</span>
                  {item.label}
                </button>
                {showFounderChildren && liveGuruParampara.length > 0 && (
                  <div className="founder-child-menu">
                    {liveGuruParampara.map((guru) => (
                      <button
                        className={activeId === guru.id ? "active child-active" : "child-link"}
                        type="button"
                        key={guru.id}
                        onClick={() => selectSection(guru.id)}
                      >
                        <span>&rsaquo;</span>
                        {guru.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <button
                className={activeId === item.id ? "active" : ""}
                type="button"
                key={item.id}
                onClick={() => selectSection(item.id)}
              >
                <span>&rsaquo;</span>
                {item.label}
              </button>
            )
          ))}
        </aside>

        <div className="about-reader-content">
          {activeSection && <AboutSection section={activeSection} />}
          {activeId === "founder" && <FounderSection section={founderSection} />}
          {activeGuru && <GuruSection guru={activeGuru} />}
        </div>
      </div>
    </main>
  );
}

export default About;
