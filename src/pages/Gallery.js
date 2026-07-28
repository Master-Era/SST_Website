import { useEffect, useMemo, useRef, useState } from "react";
import "./Gallery.css";
import mandirImg from "../assets/images/Madir,.jpg";
import eventImg from "../assets/images/Event..jfif";
import gaushalaImg from "../assets/images/Gaushala.jfif";
import galleryImg from "../assets/images/images.jfif";
import trustImg from "../assets/images/Wo we Are.jpg";
import logoImg from "../assets/images/shreeji-logo.png";
import { getContentMap, mediaUrl } from "../services/content";
import PageLoader from "../components/PageLoader";

const albumSource = [
  {
    id: "premises",
    title: "Premises",
    description: "Mandir campus, Hari Tirth Aashram and place-wise image folders.",
    cover: mandirImg,
    images: [mandirImg, galleryImg, trustImg, eventImg, gaushalaImg],
  },
  {
    id: "events",
    title: "Events",
    description: "Utsav, sabha, national day and mandir event photo collection.",
    cover: eventImg,
    images: [eventImg, mandirImg, galleryImg, trustImg, gaushalaImg],
  },
  {
    id: "activity",
    title: "Activity",
    description: "Seva, health care, education, food distribution and social care images.",
    cover: galleryImg,
    images: [galleryImg, eventImg, mandirImg, gaushalaImg, trustImg],
  },
  {
    id: "vicharan",
    title: "Vicharan",
    description: "Guruhari vicharan, satsang visits and devotee connection memories.",
    cover: trustImg,
    images: [trustImg, logoImg, mandirImg, eventImg, galleryImg],
  },
  {
    id: "gaushala",
    title: "Gaushala",
    description: "Cow care, fodder seva, daily seva and gaushala activity images.",
    cover: gaushalaImg,
    images: [gaushalaImg, mandirImg, eventImg, galleryImg, trustImg],
  },
  {
    id: "bhagawan-swaminarayan",
    title: "Bhagawan Swaminarayan",
    description: "Darshan, murti, mandir decoration and bhakti image collection.",
    cover: logoImg,
    images: [logoImg, mandirImg, trustImg, eventImg, galleryImg],
  },
  {
    id: "guruhari-guruswami",
    title: "Guru Hari Guru Swami Maharaj",
    description: "Guruhari darshan, blessings, sabha and seva guidance images.",
    cover: trustImg,
    images: [trustImg, logoImg, mandirImg, galleryImg, eventImg],
  },
];

const albums = albumSource.map((album) => ({
  ...album,
  count: 20,
  items: Array.from({ length: 20 }, (_, index) => {
    const image = album.images[index % album.images.length];
    const month = String((index % 12) + 1).padStart(2, "0");
    const day = String((index % 27) + 1).padStart(2, "0");

    return {
      id: `${album.id}-${index + 1}`,
      title: `${album.title} Image ${index + 1}`,
      eventName: index % 2 === 0 ? "Utsav" : "Seva",
      date: `2026-${month}-${day}`,
      image,
    };
  }),
}));

function Gallery() {
  const [filters, setFilters] = useState({ name: "", month: "", year: "" });
  const [activeAlbumId, setActiveAlbumId] = useState(null);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminWebsite, setAdminWebsite] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    getContentMap()
      .then((map) => setAdminWebsite(map["Admin Website Data"] || null))
      .catch(() => setAdminWebsite(null))
      .finally(() => setDataLoaded(true));
  }, []);

  const liveAlbums = useMemo(() => {
    const savedAlbums = adminWebsite?.gallery?.albums || [];
    if (!savedAlbums.length) return albums;
    return savedAlbums.filter((album) => album.active !== false).map((album, albumIndex) => {
      const rawImages = album.images?.length ? album.images : [album.cover].filter(Boolean);
      const items = rawImages.map((img, index) => {
        const src = typeof img === "string" ? img : img.src || img.image || img.url;
        const month = String((index % 12) + 1).padStart(2, "0");
        const day = String((index % 27) + 1).padStart(2, "0");
        return {
          id: `${album.id || albumIndex}-${index}`,
          title: (typeof img === "object" && img.name) || `${album.title || "Album"} Image ${index + 1}`,
          eventName: album.title || "Gallery",
          date: img.date || `2026-${month}-${day}`,
          image: mediaUrl(src),
        };
      });
      return {
        id: String(album.id || albumIndex),
        title: album.title || "Album",
        description: album.description || "",
        cover: mediaUrl(album.cover || items[0]?.image || mandirImg),
        count: items.length,
        items,
      };
    });
  }, [adminWebsite]);

  const activeAlbum = liveAlbums.find((album) => String(album.id) === String(activeAlbumId));

  useEffect(() => {
    if (!searchOpen) return undefined;

    const closeSearchOnOutsideClick = (event) => {
      if (!searchRef.current?.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", closeSearchOnOutsideClick);
    document.addEventListener("touchstart", closeSearchOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeSearchOnOutsideClick);
      document.removeEventListener("touchstart", closeSearchOnOutsideClick);
    };
  }, [searchOpen]);

  const visibleAlbums = useMemo(() => {
    const name = filters.name.trim().toLowerCase();

    return liveAlbums.filter((album) => {
      const albumMatch = !name || album.title.toLowerCase().includes(name);
      const imageMatch = album.items.some((item) => {
        const itemDate = new Date(item.date);
        const matchName = !name || item.title.toLowerCase().includes(name) || album.title.toLowerCase().includes(name);
        const matchMonth = !filters.month || String(itemDate.getMonth() + 1).padStart(2, "0") === filters.month;
        const matchYear = !filters.year || String(itemDate.getFullYear()) === filters.year;
        return matchName && matchMonth && matchYear;
      });

      return albumMatch || imageMatch;
    });
  }, [filters, liveAlbums]);

  const albumImages = useMemo(() => {
    if (!activeAlbum) return [];
    const name = filters.name.trim().toLowerCase();

    return activeAlbum.items.filter((item) => {
      const itemDate = new Date(item.date);
      const matchName = !name || item.title.toLowerCase().includes(name) || activeAlbum.title.toLowerCase().includes(name);
      const matchMonth = !filters.month || String(itemDate.getMonth() + 1).padStart(2, "0") === filters.month;
      const matchYear = !filters.year || String(itemDate.getFullYear()) === filters.year;
      return matchName && matchMonth && matchYear;
    });
  }, [activeAlbum, filters]);

  const selectedImage = viewerIndex !== null ? albumImages[viewerIndex] : null;

  const openAlbum = (albumId) => {
    setActiveAlbumId(albumId);
    setViewerIndex(null);
    window.setTimeout(() => {
      document.getElementById("album-images")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const showPrev = () => {
    setViewerIndex((current) => (current === null ? 0 : (current - 1 + albumImages.length) % albumImages.length));
  };

  const showNext = () => {
    setViewerIndex((current) => (current === null ? 0 : (current + 1) % albumImages.length));
  };

  const shareImage = async () => {
    if (!selectedImage) return;
    const shareData = { title: selectedImage.title, text: selectedImage.title, url: window.location.href };
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  };

  const submitSearch = (event) => {
    event.preventDefault();
    setSearchOpen(false);
  };

  if (!dataLoaded) {
    return (
      <main className="gallery-page">
        <PageLoader message="Loading..." />
      </main>
    );
  }

  return (
    <main className="gallery-page">
      <section className="gallery-hero page-shell">
        <div>
          {/* <span>Gallery Albums</span>
          <h1>Shreeji Samipya Photo Folders</h1>
          <p>
            Gallery ma images folder/album wise manage thase. Album par click karsho to
            tena related 15-20 images open thase, ane image click karta full-screen viewer
            ma download/share sathe open thase.
          </p> */}
        </div>

        <div className="gallery-search-wrap" ref={searchRef}>
          <button
            className="gallery-search-icon"
            type="button"
            onClick={() => setSearchOpen((current) => !current)}
            aria-label="Search gallery"
            aria-expanded={searchOpen}
          >
            <span />
          </button>
          {searchOpen && (
            <form className="gallery-search" onSubmit={submitSearch}>
              <strong>Search Gallery</strong>
              <input
                type="search"
                placeholder="Name"
                value={filters.name}
                onChange={(event) => setFilters({ ...filters, name: event.target.value })}
              />
              <div className="gallery-filter-row">
                <select value={filters.month} onChange={(event) => setFilters({ ...filters, month: event.target.value })}>
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, index) => (
                    <option value={String(index + 1).padStart(2, "0")} key={index + 1}>
                      {String(index + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select value={filters.year} onChange={(event) => setFilters({ ...filters, year: event.target.value })}>
                  <option value="">Year</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
              <div className="gallery-search-actions">
                <button type="submit">Search</button>
                <button type="button" onClick={() => setFilters({ name: "", month: "", year: "" })}>
                  Clear
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="album-section page-shell">
        <div className="gallery-section-title">
          <h2>Album Folders</h2>
          <p>Folder structure thi clear khabar padse ke kai jagya/event/activity ni images kya che.</p>
        </div>

        <div className="album-grid">
          {visibleAlbums.map((album) => (
            <button
              className={album.id === activeAlbumId ? "active" : ""}
              type="button"
              key={album.id}
              onClick={() => openAlbum(album.id)}
            >
              <div className="folder-cover">
                <img src={album.cover} alt={album.title} />
              </div>
              <span>{album.count} Images</span>
              <strong>{album.title}</strong>
              <small>{album.description}</small>
            </button>
          ))}
        </div>
      </section>

      {activeAlbum && (
        <section className="album-images-section page-shell" id="album-images">
          <span className="gallery-anchor" id="activity-gallery" />
          <div className="album-images-head">
            <div>
              <button className="back-albums" type="button" onClick={() => setActiveAlbumId(null)}>
                Back to Albums
              </button>
              <h2>{activeAlbum.title}</h2>
              <p>{activeAlbum.description}</p>
            </div>
            <strong>{albumImages.length} Found</strong>
          </div>

          <div className="album-image-grid">
            {albumImages.map((item, index) => (
              <button className="album-photo-card" type="button" key={item.id} onClick={() => setViewerIndex(index)}>
                <img src={item.image} alt={item.title} />
                <span>{item.eventName} | {item.date}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedImage && (
        <div className="gallery-viewer" role="dialog" aria-modal="true" aria-label={selectedImage.title}>
          <div className="viewer-count">{viewerIndex + 1} / {albumImages.length}</div>
          <div className="viewer-actions">
            <a href={selectedImage.image} download>
              Download
            </a>
            <button type="button" onClick={shareImage}>
              Share
            </button>
            <button type="button" onClick={() => setViewerIndex(null)} aria-label="Close gallery viewer">
              X
            </button>
          </div>
          <button className="viewer-arrow left" type="button" onClick={showPrev} aria-label="Previous image">
            &lsaquo;
          </button>
          <img src={selectedImage.image} alt={selectedImage.title} />
          <button className="viewer-arrow right" type="button" onClick={showNext} aria-label="Next image">
            &rsaquo;
          </button>
          <div className="viewer-caption">
            <h2>{selectedImage.title}</h2>
            <p>{selectedImage.eventName} | {selectedImage.date}</p>
          </div>
          <div className="viewer-thumbs">
            {albumImages.map((item, index) => (
              <button
                className={index === viewerIndex ? "active" : ""}
                type="button"
                key={item.id}
                onClick={() => setViewerIndex(index)}
              >
                <img src={item.image} alt={item.title} />
              </button>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

export default Gallery;
