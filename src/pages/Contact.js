import { useEffect, useMemo, useState } from "react";
import "./Contact.css";
import { apiPost } from "../services/api";
import { getContentMap } from "../services/content";
import PageLoader from "../components/PageLoader";

const initialForm = {
  full_name: "",
  mobile: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [contentMap, setContentMap] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getContentMap()
      .then((data) => { if (isMounted) setContentMap(data || {}); })
      .catch(() => { if (isMounted) setContentMap({}); });
    return () => { isMounted = false; };
  }, []);

  const isLoading = contentMap === null;
  const contact = (contentMap || {})["Admin Website Data"]?.contact || {};
  const mapLink = contact.mapLink || "";

  const contactDetails = useMemo(() => {
    const rows = [
      ["Phone", contact.phone],
      ["WhatsApp", contact.whatsapp],
      ["Email", contact.email],
      ["Address", contact.address],
    ];
    return rows.filter(([, value]) => value);
  }, [contact.phone, contact.whatsapp, contact.email, contact.address]);

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus("Sending...");
    try {
      await apiPost("/inquiry", { ...form, inquiry_type: "contact" });
      setStatus("Jay Swaminarayan! Your request has reached us successfully. Thank you for contacting us. We sincerely appreciate it.");
      setForm(initialForm);
    } catch (error) {
      setStatus(error.message);
    }
  };

  if (isLoading) {
    return (
      <main className="contact-page">
        <PageLoader message="Loading..." />
      </main>
    );
  }

  return (
    <main className="contact-page">
      <section className="contact-hero page-shell">
        <div className="contact-hero-copy" />
      </section>

      <section className="contact-layout page-shell">
        <aside className="contact-info-panel">
          <h2>Contact Details</h2>
          <p>Use the details below or submit the form. Our team can follow up for all trust and seva related inquiries.</p>

          {contactDetails.length > 0 && (
            <div className="contact-list">
              {contactDetails.map(([label, value]) => (
                <a
                  href={
                    label === "Email"
                      ? `mailto:${value}`
                      : label === "Phone" || label === "WhatsApp"
                        ? `tel:${value.replaceAll(" ", "")}`
                        : mapLink || "#"
                  }
                  key={label}
                  target={label === "Address" ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  <strong>{label}</strong>
                  <span>{value}</span>
                </a>
              ))}
            </div>
          )}

          {mapLink && (
            <a className="map-box" href={mapLink} target="_blank" rel="noreferrer">
              <div className="map-pin" aria-hidden="true" />
              <span>Google Map Location</span>
              <strong>Open Map</strong>
            </a>
          )}
        </aside>

        <form className="contact-form" onSubmit={submit}>
          <div className="form-heading">
            <span>Inquiry Form</span>
            <h2>Send Message</h2>
          </div>
          <label>
            Full Name
            <input name="full_name" value={form.full_name} onChange={update} required />
          </label>
          <label>
            Mobile Number
            <input name="mobile" value={form.mobile} onChange={update} />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={update} />
          </label>
          <label>
            Subject
            <input name="subject" value={form.subject} onChange={update} />
          </label>
          <label className="full-span">
            Message
            <textarea name="message" rows="5" value={form.message} onChange={update} required />
          </label>
          <button className="primary-btn" type="submit">Send Message</button>
          {status && <p className="form-status full-span">{status}</p>}
        </form>
      </section>
    </main>
  );
}

export default Contact;
