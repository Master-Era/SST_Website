import { useState } from "react";
import "./Contact.css";
import { apiPost } from "../services/api";

const mapLink = "https://maps.app.goo.gl/a5YXeXm7esqtdf729";

const initialForm = {
  full_name: "",
  mobile: "",
  email: "",
  subject: "",
  message: "",
};

const contactDetails = [
  ["Phone", "+91 98765 43210"],
  ["WhatsApp", "+91 98765 43210"],
  ["Email", "info@shreejisamipya.org"],
  ["Address", "Shreeji Samipya Trust, Mandir Campus"],
];

function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");

  const update = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setStatus("Sending...");
    try {
      await apiPost("/inquiry", { ...form, inquiry_type: "contact" });
      setStatus("Your inquiry has been submitted successfully.");
      setForm(initialForm);
    } catch (error) {
      setStatus(error.message);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-hero page-shell">
        <div className="contact-hero-copy">
          {/* <span>Contact</span>
          <h1>Connect with Shreeji Samipya</h1> */}
          {/* <p>
            Reach the trust office for mandir seva, devotee support, activities,
            events, donation inquiry or general communication.
          </p> */}
          {/* <a href={mapLink} target="_blank" rel="noreferrer">Open Google Map</a> */}
        </div>
      </section>

      <section className="contact-layout page-shell">
        <aside className="contact-info-panel">
          <h2>Contact Details</h2>
          <p>Use the details below or submit the form. Our team can follow up for all trust and seva related inquiries.</p>

          <div className="contact-list">
            {contactDetails.map(([label, value]) => (
              <a href={label === "Email" ? `mailto:${value}` : label === "Phone" || label === "WhatsApp" ? `tel:${value.replaceAll(" ", "")}` : mapLink} key={label} target={label === "Address" ? "_blank" : undefined} rel="noreferrer">
                <strong>{label}</strong>
                <span>{value}</span>
              </a>
            ))}
          </div>

          <a className="map-box" href={mapLink} target="_blank" rel="noreferrer">
            <div className="map-pin" aria-hidden="true" />
            <span>Google Map Location</span>
            <strong>Open Map</strong>
          </a>
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
