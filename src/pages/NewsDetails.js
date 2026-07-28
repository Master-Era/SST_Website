import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./NewsDetails.css";
import { getContentMap, mediaUrl } from "../services/content";
import PageLoader from "../components/PageLoader";

function NewsDetails() {
  const { slug } = useParams();
  const [adminWebsite, setAdminWebsite] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    getContentMap()
      .then((map) => setAdminWebsite(map["Admin Website Data"] || null))
      .catch(() => setAdminWebsite(null))
      .finally(() => setDataLoaded(true));
  }, []);

  const allNews = useMemo(() => {
    const news = adminWebsite?.news || {};
    return [
      ...(news.latest || []).map((item) => ({ ...item, category: "Latest News" })),
      ...(news.announcements || []).map((item) => ({ ...item, category: "Upcoming Announcements" })),
      ...(news.notices || []).map((item) => ({ ...item, category: "Important Notices" })),
      ...(news.customSections || []).map((item) => ({ ...item, category: item.sectionTitle || item.title || "Added News Section" })),
    ].filter((item) => item.active !== false);
  }, [adminWebsite]);

  const item = allNews.find((news) => news.slug === slug);

  if (!dataLoaded) {
    return (
      <main className="news-detail-page">
        <PageLoader message="Loading..." />
      </main>
    );
  }

  if (!item) {
    return (
      <main className="news-detail-page">
        <section className="news-detail-hero page-shell notice-only">
          <div>
            <h1>News not found</h1>
            <p>This news item is not available. It may have been removed from the admin panel.</p>
            <Link to="/news">Back to News</Link>
          </div>
        </section>
      </main>
    );
  }

  const isImportantNotice = item.category === "Important Notices";
  const banner = mediaUrl(item.image || item.banner);
  const gallery = (item.gallery || []).map((image) => mediaUrl(image)).filter(Boolean);
  const related = allNews.filter((news) => news.slug !== item.slug).slice(0, 3);

  const share = async () => {
    const data = { title: item.title, text: item.description || item.content, url: window.location.href };
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <main className="news-detail-page">
      <section className={`news-detail-hero page-shell${isImportantNotice ? " notice-only" : ""}`}>
        {!isImportantNotice && banner && <img src={banner} alt={item.title} />}
        <div>
          <span>{item.category}</span>
          <h1>{item.title}</h1>
          <div className="news-detail-meta">
            {item.date && <span>{item.date}</span>}
            {item.time && <span>{item.time}</span>}
            {item.location && <span>{item.location}</span>}
            {item.author && <span>{item.author}</span>}
          </div>
          <p>{item.description || item.content}</p>
          <button type="button" onClick={share}>Share News</button>
        </div>
      </section>

      {!isImportantNotice && gallery.length > 0 && (
        <section className="news-detail-gallery page-shell">
          <h2>Photo Gallery</h2>
          <div>
            {gallery.map((image, index) => (
              <img src={image} alt={`${item.title} ${index + 1}`} key={`${item.slug}-${index}`} />
            ))}
          </div>
        </section>
      )}

      {!isImportantNotice && item.video && (
        <section className="news-video page-shell">
          <h2>Video</h2>
          <iframe src={item.video} title={item.title} allowFullScreen />
        </section>
      )}

      {!isImportantNotice && related.length > 0 && (
        <section className="related-news page-shell">
          <h2>Related News</h2>
          <div>
            {related.map((news) => (
              <Link to={`/news/${news.slug}`} key={news.slug}>
                {mediaUrl(news.image || news.banner) && (
                  <img src={mediaUrl(news.image || news.banner)} alt={news.title} />
                )}
                <strong>{news.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default NewsDetails;
