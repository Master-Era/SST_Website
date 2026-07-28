import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./News.css";
import { newsCategories, newsItems } from "../data/newsData";
import { getContentMap } from "../services/content";
import PageLoader from "../components/PageLoader";

function News() {
  const [adminWebsite, setAdminWebsite] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    getContentMap()
      .then((map) => setAdminWebsite(map["Admin Website Data"] || null))
      .catch(() => setAdminWebsite(null))
      .finally(() => setDataLoaded(true));
  }, []);

  const liveNews = useMemo(() => {
    const news = adminWebsite?.news;
    if (!news) return null;
    return [
      ...(news.latest || []).map((item) => ({ ...item, category: "Latest News" })),
      ...(news.announcements || []).map((item) => ({ ...item, category: "Upcoming Announcements" })),
      ...(news.notices || []).map((item) => ({ ...item, category: "Important Notices" })),
      ...(news.customSections || []).map((item) => ({ ...item, category: item.sectionTitle || item.title || "Added News Section" })),
    ].filter((item) => item.active !== false);
  }, [adminWebsite]);

  const categories = liveNews ? [...new Set(liveNews.map((item) => item.category))] : newsCategories;
  const source = liveNews || newsItems;

  if (!dataLoaded) {
    return (
      <main className="news-page">
        <PageLoader message="Loading..." />
      </main>
    );
  }

  return (
    <main className="news-page">
      <section className="news-hero page-shell"></section>
      {categories.map((category) => {
        const items = source.filter((item) => item.category === category);
        return (
          <section className="news-section page-shell" key={category}>
            <div className="news-section-heading">
              <h2>{category}</h2>
              <p>{items.length} updates available</p>
            </div>
            <div className="news-card-grid">
              {items.map((item, index) => (
                <Link className="news-card" to={item.slug ? `/news/${item.slug}` : "/news"} key={item.slug || `${category}-${item.id || index}`}>
                  <div>
                    <span>{item.date || item.createdAt || ""}</span>
                    <h3>{item.title}</h3>
                    <p>{item.location || ""}</p>
                    <small>{item.description || item.content}</small>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
}

export default News;
