import React, { useMemo, useState } from "react";
import CmsEditor from "../components/CmsEditor";
import { addLog, load, save } from "../utils/store";
import { defaultWebsiteData } from "../data/defaultData";

export default function AboutEdit() {
  const [w, setW] = useState(load("website", defaultWebsiteData));

  const sections = useMemo(() => {
    const current = w.about?.sections || [];
    if (current.some((item) => String(item.title || "").toLowerCase() === "founder")) {
      return current;
    }
    const founder = defaultWebsiteData.about.sections.find((item) => item.title === "Founder");
    return [...current, founder];
  }, [w]);

  const guruParampara = w.about?.guruParampara || [];

  const update = (items) => {
    const next = { ...w, about: { ...(w.about || {}), sections: items } };
    setW(next);
    save("website", next);
    addLog("About page updated");
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
        title="About Page - Who We Are, What We Do, Premises, Founder (Bhagwan Swaminarayan)"
        items={sections}
        onSave={update}
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
