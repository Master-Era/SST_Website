import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CmsEditor from "../components/CmsEditor";
import { addLog, load, save } from "../utils/store";
import { defaultWebsiteData } from "../data/defaultData";

const sectionMeta = {
  latest: {
    label: "Latest News - Add/Edit",
    key: "latest",
    description: "New seva, new project and event update news cards.",
    fields: ["title", "date", "content"],
  },
  announcements: {
    label: "Upcoming Announcements - Add/Edit",
    key: "announcements",
    description: "Event date, time, location and banner-style announcement content.",
    fields: ["title", "date", "content"],
  },
  notices: {
    label: "Important Notices - Only Notice Content",
    key: "notices",
    description: "Only notice title and content. Image is not required here.",
    fields: ["title", "content"],
    hideImage: true,
  },
  "add-section": {
    label: "Add Section",
    key: "customSections",
    description: "Create extra News page sections with content and optional images.",
    fields: ["title", "date", "content"],
  },
};

export default function NewsEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const [website, setWebsite] = useState(load("website", defaultWebsiteData));
  const news = website.news || defaultWebsiteData.news;
  const activeKey = sectionMeta[location.hash.replace("#", "")] ? location.hash.replace("#", "") : "latest";
  const active = sectionMeta[activeKey];

  const sections = useMemo(() => Object.entries(sectionMeta), []);

  const update = (key, value) => {
    const next = { ...website, news: { ...news, [key]: value } };
    setWebsite(next);
    save("website", next);
    addLog(`News ${key} updated`);
  };

  return (
    <div className="news-edit-page news-section-editor">
      <div className="admin-card news-edit-hero">
        <div>
          <span>News Control</span>
          <h2>{active.label}</h2>
          <p>{active.description}</p>
        </div>
        <div className="news-edit-tabs">
          {sections.map(([key, item]) => (
            <button
              key={key}
              className={activeKey === key ? "active" : ""}
              type="button"
              onClick={() => navigate(`/admin/website/news#${key}`)}
            >
              <small>{key === "add-section" ? "+" : "-"}</small>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <CmsEditor
        key={active.key}
        title={active.label}
        items={news[active.key] || []}
        onSave={(value) => update(active.key, value)}
        fields={active.fields}
        hideImage={active.hideImage}
        inlineEditor
      />
    </div>
  );
}
