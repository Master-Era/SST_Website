import { useRef, useState } from "react";
import "./HariBhakt.css";
import { apiPost } from "../services/api";

const initialForm = {
  full_name: "",
  father_husband_name: "",
  mobile: "",
  whatsapp: "",
  email: "",
  gender: "",
  date_of_birth: "",
  age: "",
  address: "",
  city: "",
  state: "",
  occupation: "",
  satsang_attend: "",
  remarks: "",
};

function HariBhakt() {
  const [form, setForm] = useState(initialForm);
  const [liveImage, setLiveImage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [status, setStatus] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age >= 0 ? String(age) : "";
  };

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "date_of_birth" ? { age: calculateAge(value) } : {}),
    }));
  };

  const uploadImage = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStatus("Only images up to 2MB are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setLiveImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
    } catch (error) {
      setStatus("Camera permission required for live capture.");
    }
  };

  const captureImage = () => {
    if (!videoRef.current) {
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setLiveImage(canvas.toDataURL("image/png"));
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
  };

  const openPreview = (event) => {
    event.preventDefault();
    setStatus("");
    setShowPreview(true);
  };

  const submit = async () => {
    setStatus("Submitting...");
    try {
      await apiPost("/hari-bhakto/register", {
        ...form,
        satsang_attend: form.satsang_attend === "Yes",
        photo_data: liveImage,
      });
    } catch (error) {
      setStatus("");
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setCameraOn(false);
    setShowPreview(false);
    setShowThanks(true);
    setForm(initialForm);
    setLiveImage("");
  };

  const closeThanks = () => {
    setShowThanks(false);
    setStatus("");
  };

  return (
    <main className="hari-page">
      <section className="page-hero">
        <div className="page-shell">
          <p className="section-kicker"></p>
          {/* <h1>Devotee Registration</h1> */}
          {/* <p>Upload a photo or capture a live image for the form. Only images up to 2MB are allowed.</p> */}
        </div>
      </section>

      <section className="hari-layout page-shell">
        <form className="form-grid hari-form" onSubmit={openPreview}>
          <div className="hari-form-head full-span">
            <span>Registration Form</span>
            <h2>Devotee Details</h2>
            <p>Details fill kari preview check karo, pachi final submit karo.</p>
          </div>

          <div className="live-image-card full-span">
            <div className="hari-photo-stage">
              {liveImage ? (
                <img src={liveImage} alt="Devotee registration preview" />
              ) : (
                <div className="empty-photo-placeholder" aria-label="No image selected">
                  <span>Image</span>
                </div>
              )}
              {cameraOn && <video ref={videoRef} autoPlay playsInline muted className="camera-preview"></video>}
            </div>
            <div className="image-actions">
              <label className="upload-control">
                Upload Image
                <input type="file" accept="image/*" onChange={uploadImage} />
              </label>
              {!cameraOn && <button type="button" onClick={startCamera}>Live Capture</button>}
              {cameraOn && <button type="button" onClick={captureImage}>Capture Photo</button>}
            </div>
            <span className="image-span">Photo upload/live capture preview. Only images up to 2MB are allowed.</span>
          </div>

          <label>Full Name<input name="full_name" value={form.full_name} onChange={update} required /></label>
          <label>Father / Husband Name<input name="father_husband_name" value={form.father_husband_name} onChange={update} /></label>
          <label>Mobile Number<input name="mobile" value={form.mobile} onChange={update} required /></label>
          <label>WhatsApp Number<input name="whatsapp" value={form.whatsapp} onChange={update} /></label>
          <label>Email<input name="email" type="email" value={form.email} onChange={update} /></label>
          <label>Gender<select name="gender" value={form.gender} onChange={update}><option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option></select></label>
          <label>DOB<input name="date_of_birth" type="date" value={form.date_of_birth} onChange={update} /></label>
          <label>Age<input name="age" type="number" value={form.age} readOnly /></label>
          <label className="full-span">Address<textarea name="address" rows="3" value={form.address} onChange={update} /></label>
          <label>City / Village<input name="city" value={form.city} onChange={update} /></label>
          <label>State<input name="state" value={form.state} onChange={update} /></label>
          <label>Occupation<input name="occupation" value={form.occupation} onChange={update} /></label>
          <label>Do you attend Satsang Sabha?<select name="satsang_attend" value={form.satsang_attend} onChange={update}><option value="">Select</option><option>Yes</option><option>No</option></select></label>
          <label className="full-span">Remarks<textarea name="remarks" rows="3" value={form.remarks} onChange={update} /></label>
          <button className="primary-btn" type="submit">Preview Details</button>
          {status && <p className="form-status full-span">{status}</p>}
        </form>
      </section>

      {showPreview && (
        <div className="devotee-modal" role="dialog" aria-modal="true" aria-label="Preview devotee registration">
          <div className="devotee-modal-card preview-card">
            <button className="modal-close" type="button" onClick={() => setShowPreview(false)} aria-label="Close preview">X</button>
            <span>Preview</span>
            <h2>Check Details Before Submit</h2>
            <div className="preview-layout">
              {liveImage ? (
                <img src={liveImage} alt="Preview devotee" />
              ) : (
                <div className="empty-photo-placeholder preview-empty">
                  <span>Image</span>
                </div>
              )}
              <div className="preview-details">
                <p><strong>Full Name:</strong> {form.full_name || "-"}</p>
                <p><strong>Father / Husband:</strong> {form.father_husband_name || "-"}</p>
                <p><strong>Mobile:</strong> {form.mobile || "-"}</p>
                <p><strong>WhatsApp:</strong> {form.whatsapp || "-"}</p>
                <p><strong>Email:</strong> {form.email || "-"}</p>
                <p><strong>Gender:</strong> {form.gender || "-"}</p>
                <p><strong>DOB:</strong> {form.date_of_birth || "-"}</p>
                <p><strong>Age:</strong> {form.age || "-"}</p>
                <p><strong>Address:</strong> {form.address || "-"}</p>
                <p><strong>City / State:</strong> {[form.city, form.state].filter(Boolean).join(", ") || "-"}</p>
                <p><strong>Occupation:</strong> {form.occupation || "-"}</p>
                <p><strong>Satsang Sabha:</strong> {form.satsang_attend || "-"}</p>
                <p><strong>Remarks:</strong> {form.remarks || "-"}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={() => setShowPreview(false)}>Edit Details</button>
              <button type="button" onClick={submit}>Final Submit</button>
            </div>
          </div>
        </div>
      )}

      {showThanks && (
        <div className="devotee-modal" role="dialog" aria-modal="true" aria-label="Registration thank you">
          <div className="devotee-modal-card thank-card">
            <span>Thank You</span>
            <h2>Registration Submitted</h2>
            <p>
              Shreeji Samipya Trust taraf thi aabhar. Tamari devotee registration details receive thai gayi che.
              Jaldi trust team tamara mobile/WhatsApp par contact karse.
            </p>
            <button type="button" onClick={closeThanks}>Done</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default HariBhakt;
