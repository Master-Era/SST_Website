import { useState } from "react";
import "./Donation.css";
import logo from "../assets/images/shreeji-logo.png";
import { apiPost } from "../services/api";

const donationPurposes = [
  "Mandir Seva",
  "Food Distribute",
  "For Thakorji Thal",
  "For Maha Pooja",
  "Gaushala Seva",
  "Child Education",
  "General Donation",
];

const initialForm = {
  donorName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  state: "",
  purpose: "Mandir Seva",
  amount: "",
  paymentMethod: "Trust team will call",
  notes: "",
};

function Donation() {
  const [form, setForm] = useState(initialForm);
  const [submittedDonation, setSubmittedDonation] = useState(null);
  const [status, setStatus] = useState("");

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitDonation = async (event) => {
    event.preventDefault();
    const donationRecord = {
      ...form,
      amount: Number(form.amount || 0),
      submittedAt: new Date().toLocaleString(),
    };

    try {
      const saved = await apiPost("/donation", donationRecord);
      setSubmittedDonation({ ...donationRecord, receiptNumber: saved.receipt_number || saved.receiptNumber });
      setStatus("success");
    } catch (error) {
      setStatus(error.message || "Donation API unavailable");
    }
  };

  return (
    <main className="donation-page">
      <section className="donation-hero page-shell">
        <div>
          <span>Donation</span>
          <h1>Offer Seva Through Shreeji Samipya Trust</h1>
          <p>
            Donor details submit karo. Shreeji Samipya Trust team tamne jaldi call kari
            donation process, receipt and seva purpose ni details confirm karse.
          </p>
        </div>
        <img src={logo} alt="Shreeji Samipya Trust" />
      </section>

      <section className="donation-content page-shell">
        <form className="donation-form" onSubmit={submitDonation}>
          <div className="donation-form-head">
            <span>Donation Form</span>
            <h2>Donor Details</h2>
            <p>Form submit karya pachi website ma thank-you message show thase.</p>
          </div>

          <label>
            Full Name
            <input
              type="text"
              required
              value={form.donorName}
              onChange={(event) => updateField("donorName", event.target.value)}
            />
          </label>
          <label>
            Mobile Number
            <input
              type="tel"
              required
              value={form.mobile}
              onChange={(event) => updateField("mobile", event.target.value)}
            />
          </label>
          <label>
            WhatsApp Number
            <input
              type="tel"
              required
              value={form.whatsapp}
              onChange={(event) => updateField("whatsapp", event.target.value)}
            />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </label>
          <label className="full-span">
            Address
            <textarea
              rows="3"
              required
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
          </label>
          <label>
            City / Village
            <input
              type="text"
              required
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
            />
          </label>
          <label>
            State
            <input
              type="text"
              required
              value={form.state}
              onChange={(event) => updateField("state", event.target.value)}
            />
          </label>
          <label>
            Donation Purpose
            <select value={form.purpose} onChange={(event) => updateField("purpose", event.target.value)}>
              {donationPurposes.map((purpose) => (
                <option value={purpose} key={purpose}>{purpose}</option>
              ))}
            </select>
          </label>
          <label>
            Amount
            <input
              type="number"
              min="1"
              required
              value={form.amount}
              onChange={(event) => updateField("amount", event.target.value)}
            />
          </label>
          <label>
            Preferred Payment / Contact Method
            <select value={form.paymentMethod} onChange={(event) => updateField("paymentMethod", event.target.value)}>
              <option>Trust team will call</option>
              <option>UPI</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
              <option>Cheque</option>
            </select>
          </label>
          <label className="full-span">
            Remarks / Seva Note
            <textarea
              rows="4"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
            />
          </label>

          <button type="submit">Submit Donation Details</button>
          {status === "success" && submittedDonation && (
            <div className="donation-thankyou">
              <strong>Thank you, {submittedDonation.donorName}.</strong>
              <p>
                Shreeji Samipya Trust taraf thi aabhar. Tamari donation request receive thai gayi che.
                Jaldi trust team tamara mobile/WhatsApp number par call kari details confirm karse.
              </p>
            </div>
          )}
        </form>

        <aside className="donation-summary">
          <div className="donation-bank-card">
            <span>Donation Process</span>
            <h2>Trust Team Will Guide</h2>
            <p>Form submit karya pachi donor details trust team sudhi pahochse ane call thi next process explain thase.</p>
            <ul>
              <li>Step 1: Donor details submit</li>
              <li>Step 2: Trust team call confirmation</li>
              <li>Step 3: Payment guidance</li>
              <li>Step 4: Receipt / record update</li>
            </ul>
          </div>

          <div className="donation-record-card">
            <span>Donation Given</span>
            {submittedDonation ? (
              <>
                <h3>{submittedDonation.donorName}</h3>
                <p><strong>Purpose:</strong> {submittedDonation.purpose}</p>
                <p><strong>Amount:</strong> Rs. {submittedDonation.amount}</p>
                <p><strong>Mobile:</strong> {submittedDonation.mobile}</p>
                <p><strong>WhatsApp:</strong> {submittedDonation.whatsapp}</p>
                <p><strong>Date:</strong> {submittedDonation.submittedAt}</p>
              </>
            ) : (
              <p>Form submit karsho pachi donation details ahi dekhase.</p>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Donation;
