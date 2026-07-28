import React, { useState } from "react";
import CmsEditor from "../components/CmsEditor";
import { addLog, load, save } from "../utils/store";
import { defaultWebsiteData } from "../data/defaultData";

export default function AboutEdit() {
  const [w, setW] = useState(load("website", defaultWebsiteData));

  const sections = w.about?.sections || [];
  const founder = w.about?.founder ? [w.about.founder] : [];
  const guruParampara = w.about?.guruParampara || [];

  const update = (items) => {
    const next = { ...w, about: { ...(w.about || {}), sections: items } };
    setW(next);
    save("website", next);
    addLog("About page updated");
  };

  const updateFounder = (items) => {
    // Founder is a single record (not a list), so always take the latest one.
    const founderRecord = items[items.length - 1] || null;
    const next = { ...w, about: { ...(w.about || {}), founder: founderRecord } };
    setW(next);
    save("website", next);
    addLog("Founder updated");
  };

  const updateGuru = (items) => {
    const next = { ...w, about: { ...(w.about || {}), guruParampara: items } };
    setW(next);
    save("website", next);
    addLog("Guru Parampara updated");
  };

  return (
    <>
      <CmsEditor
        title="About Page - Who We Are, What We Do, Premises"
        items={sections}
        onSave={update}
        allowGallery
      />
      <br />
      <CmsEditor
        title="Founder (e.g. Bhagwan Swaminarayan) - what shows when 'Founder' is clicked"
        items={founder}
        onSave={updateFounder}
        allowGallery
      />
      <br />
      <CmsEditor
        title="Founder > Guru Parampara (e.g. Guru Swami Maharaj) - shows as a dropdown under Founder"
        items={guruParampara}
        onSave={updateGuru}
        allowGallery
      />
    </>
  );
}
