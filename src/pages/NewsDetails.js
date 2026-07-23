import { Link, useParams } from "react-router-dom";
import "./NewsDetails.css";
import { newsItems } from "../data/newsData";

function NewsDetails() {
  const { slug } = useParams();
  const item = newsItems.find((news) => news.slug === slug) || newsItems[0];
  const isImportantNotice = item.category === "Important Notices";
  const related = newsItems.filter((news) => news.slug !== item.slug).slice(0, 3);

  const share = async () => {
    const data = { title: item.title, text: item.description, url: window.location.href };
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(window.location.href);
  };

  return (
    <main className="news-detail-page">
      <section className={`news-detail-hero page-shell${isImportantNotice ? " notice-only" : ""}`}>
        {!isImportantNotice && <img src={item.banner} alt={item.title} />}
        <div>
          <span>{item.category}</span>
          <h1>{item.title}</h1>
          <div className="news-detail-meta">
            <span>{item.date}</span>
            <span>{item.time}</span>
            <span>{item.location}</span>
            <span>{item.author}</span>
          </div>
          <p>{item.description}</p>
          <button type="button" onClick={share}>Share News</button>
        </div>
      </section>

      {!isImportantNotice && (
        <section className="news-detail-gallery page-shell">
          <h2>Photo Gallery</h2>
          <div>
            {item.gallery.map((image, index) => (
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

      {!isImportantNotice && (
        <section className="related-news page-shell">
          <h2>Related News</h2>
          <div>
            {related.map((news) => (
              <Link to={`/news/${news.slug}`} key={news.slug}>
                <img src={news.banner} alt={news.title} />
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
