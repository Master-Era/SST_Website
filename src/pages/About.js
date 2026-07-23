import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import "./About.css";
import { getContentMap, mediaUrl } from "../services/content";
import trustImg from "../assets/images/Wo we Are.jpg";
import mandirImg from "../assets/images/Madir,.jpg";
import activityImg from "../assets/images/Event..jfif";
import gaushalaImg from "../assets/images/Gaushala.jfif";
import galleryImg from "../assets/images/images.jfif";
import logoImg from "../assets/images/shreeji-logo.png";

const aboutSections = [
  {
    id: "who-we-are",
    label: "Who We Are",
    title: "Who We Are",
    images: [trustImg, logoImg, mandirImg],
    text:
      "Shreeji Samipya Sanstha is a mandir-centered seva and satsang organization. The trust connects devotees with bhakti, seva, sanskar and community support through disciplined planning.",
    details:
      "The sanstha carries the spirit of samipya: staying close to Bhagwan, Guru, mandir and society. Every activity is planned so devotees, families, youth and volunteers can join with confidence.",
    points: ["Mandir centered seva", "Devotee connection", "Transparent trust work", "Sanskar and satsang"],
  },
  {
    id: "what-we-do",
    label: "What We Do",
    title: "What We Do",
    images: [mandirImg, galleryImg, activityImg],
    text:
      "We organize mandir seva, satsang sabha, utsav seva, gaushala support, child education, health care and social help programs.",
    details:
      "The work is designed so spiritual growth and practical social service both remain together. Event planning, volunteer coordination, beneficiary support and gallery records can be managed clearly.",
    points: ["Mandir seva", "Utsav and sabha", "Education and health", "Volunteer coordination"],
  },
  {
    id: "premises",
    label: "Premises",
    title: "Premises",
    images: [mandirImg, gaushalaImg, trustImg],
    text:
      "Premises section introduces the mandir campus, Hari Tirth Aashram, gaushala, sabha space and seva areas.",
    details:
      "This section can hold future details such as address, mandir timings, facilities, darshan areas, parking guidance and separate gallery albums for every place.",
    points: ["Hari Tirth Aashram", "Mandir campus", "Gaushala", "Sabha and seva spaces"],
  },
];

const guruParampara = [
  // ["gunatitanand-swami", "Gunatitanand Swami", "Aksharbrahma Gunatitanand Swami's life shows firm upasana, simplicity, seva and constant satsang guidance."],
  // ["bhagatji-maharaj", "Bhagatji Maharaj", "Bhagatji Maharaj inspired devotees through dedication, guru-bhakti, humility and living understanding of Akshar-Purushottam."],
  // ["shastriji-maharaj", "Shastriji Maharaj", "Shastriji Maharaj established mandirs with courage, conviction and pure devotion while spreading spiritual clarity."],
  // ["yogiji-maharaj", "Yogiji Maharaj", "Yogiji Maharaj's life radiated joy, youth inspiration, seva, prayer and universal compassion."],
  // ["hari-prasad-swami", "Hari Prasad Swami Maharaj", "Hari Prasad Swami Maharaj guided seekers toward inner discipline, satsang, seva and practical spiritual living."],
  ["guru-swami-maharaj", "Guru Swami Maharaj", "Guru Swami Maharaj's guidance supports niyam, bhakti, vicharan, seva lifestyle and connection with devotees."],
].map(([id, name, text]) => ({ id, name, text }));

function getInitialSection() {
  const hash = window.location.hash.replace("#", "");
  if (hash === "founder") return "founder";
  if (guruParampara.some((guru) => guru.id === hash)) return hash;
  if (aboutSections.some((section) => section.id === hash)) return hash;
  return "who-we-are";
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
      <ImageCarousel images={section.images} title={section.title} />
      <p className="lead">{section.text}</p>
      <p>{section.details}</p>
      <div className="about-tags">
        {section.points.map((point) => (
          <strong key={point}>{point}</strong>
        ))}
      </div>
    </section>
  );
}

function FounderSection({ section }) {
  return (
    <section className="about-reader-section founder-reader" id="founder">
      <h2>{section?.title || "Founder"}</h2>
      <ImageCarousel images={section?.images || [logoImg, trustImg, mandirImg]} title={section?.title || "Founder"} />
      <p className="lead">
        {section?.text || `Bhagawan Swaminarayan ni upasana satsang nu kendr che. Temna siddhant
        thi mandir, niyam, seva, sadachar, sant-samagam ane parivarik sanskar
        ni prerna male che.`}
      </p>
      <p>
        {section?.details || `Founder section ma life, work, vicharan, teachings, seva lifestyle and
        guru parampara ni detailed information add kari shakashe.`}
      </p>
    </section>
  );
}

function GuruSection({ guru }) {
  return (
    <section className="about-reader-section guru-only-section" id={guru.id}>
      <h2>{guru.name}</h2>
      <ImageCarousel images={[trustImg, logoImg]} title={guru.name} />
      <p className="lead">{guru.text}</p>
      <p>
        Aa area ma lifestyle, vicharan, satsang pravachan, seva margdarshan,
        prerna prasango and images detail ma add kari shakashe.
      </p>
    </section>
  );
}

function About() {
  const location = useLocation();
  const [activeId, setActiveId] = useState(getInitialSection);
  const [founderMenuOpen, setFounderMenuOpen] = useState(false);
  const [adminWebsite, setAdminWebsite] = useState(null);
  useEffect(() => {
    getContentMap().then((map) => setAdminWebsite(map["Admin Website Data"] || null)).catch(() => setAdminWebsite(null));
  }, []);
  const liveSections = useMemo(() => adminWebsite?.about?.sections?.length
    ? adminWebsite.about.sections.filter((item) => String(item.title || "").toLowerCase() !== "founder").map((item, index) => ({
        id: (item.title || `section-${index + 1}`).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        label: item.title || `Section ${index + 1}`,
        title: item.title || `Section ${index + 1}`,
        images: [mediaUrl(item.image), trustImg, logoImg].filter(Boolean),
        text: item.content || "",
        details: item.content || "",
        points: [],
      }))
    : aboutSections, [adminWebsite]);
  const liveMenuItems = useMemo(() => [
    ...liveSections.map((section) => ({ id: section.id, label: section.label, type: "section" })),
    { id: "founder", label: "Founder", type: "founder" },
  ], [liveSections]);
  const activeSection = liveSections.find((section) => section.id === activeId);
  const activeGuru = guruParampara.find((guru) => guru.id === activeId);
  const founderSection = useMemo(() => {
    const saved = adminWebsite?.about?.sections?.find((item) => String(item.title || "").toLowerCase() === "founder");
    if (!saved) return null;
    return {
      title: saved.title || "Founder",
      images: [mediaUrl(saved.image), logoImg, trustImg, mandirImg].filter(Boolean),
      text: saved.content || "",
      details: saved.content || "",
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
    if (hash === "founder" || guruParampara.some((guru) => guru.id === hash) || liveSections.some((section) => section.id === hash)) {
      setActiveId(hash);
      setFounderMenuOpen(false);
    }
  }, [location.hash, location.pathname, liveSections]);

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
                {showFounderChildren && (
                  <div className="founder-child-menu">
                    {/* <h3>Trust Founder</h3> */}
                    {guruParampara.map((guru) => (
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
