import React, { useState } from "react";
import CmsEditor from "../components/CmsEditor";
import { addLog, load, save } from "../utils/store";
import { defaultWebsiteData } from "../data/defaultData";

export default function EventsEdit() {
  const [w, setW] = useState(load("website", defaultWebsiteData));
  const update = (patch) => {
    const next = { ...w, events: { ...w.events, ...patch } };
    setW(next);
    save("website", next);
    addLog("Events updated");
  };

  return (
    <>
      <div className="admin-card event-content-card">
        <h2>Event Page Top Content</h2>
        <p className="admin-muted">Aa long content Event page na upar show thashe.</p>
        <textarea
          className="textarea long-editor"
          value={w.events?.intro || ""}
          onChange={(e) => update({ intro: e.target.value })}
          placeholder="Write complete event introduction, utsav details, place, seva and purpose..."
        />
      </div>
      <br />
      <CmsEditor
        title="Events Images and Names"
        items={w.events.items || []}
        onSave={(items) => update({ items })}
        fields={["title", "year", "content"]}
      />
    </>
  );
}
