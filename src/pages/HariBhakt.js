import {
  useEffect,
  useRef,
  useState,
} from "react";

import "./HariBhakt.css";
import { apiPost } from "../services/api";

const MAX_IMAGE_SIZE =
  2 * 1024 * 1024;

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
  const [form, setForm] =
    useState(initialForm);

  const [selectedImage, setSelectedImage] =
    useState("");

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [cameraLoading, setCameraLoading] =
    useState(false);

  const [cameraError, setCameraError] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [showPreview, setShowPreview] =
    useState(false);

  const [showThanks, setShowThanks] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const refreshTimerRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject =
        null;
    }

    setCameraOpen(false);
    setCameraLoading(false);
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      if (refreshTimerRef.current) {
        window.clearTimeout(
          refreshTimerRef.current
        );
      }
    };
  }, []);

  const calculateAge = (dob) => {
    if (!dob) {
      return "";
    }

    const birthDate =
      new Date(dob);

    const today =
      new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() <
          birthDate.getDate()
      )
    ) {
      age -= 1;
    }

    return age >= 0
      ? String(age)
      : "";
  };

  const update = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,

      [name]: value,

      ...(name ===
      "date_of_birth"
        ? {
            age:
              calculateAge(value),
          }
        : {}),
    }));
  };

  const handleImageUpload = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setCameraError("");
    setStatus("");

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      setStatus(
        "Please select a valid image file."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setStatus(
        "Only images up to 2MB are allowed."
      );

      event.target.value = "";
      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {
      stopCamera();

      setSelectedImage(
        String(
          reader.result || ""
        )
      );

      setStatus("");
    };

    reader.onerror = () => {
      setStatus(
        "The selected image could not be loaded."
      );
    };

    reader.readAsDataURL(file);
  };

  const openCamera = async () => {
    try {
      setCameraError("");
      setStatus("");
      setCameraLoading(true);

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {
        throw new Error(
          "Camera is not supported in this browser."
        );
      }

      stopCamera();

      const stream =
        await navigator
          .mediaDevices
          .getUserMedia({
            video: {
              facingMode:
                "user",

              width: {
                ideal: 720,
              },

              height: {
                ideal: 720,
              },
            },

            audio: false,
          });

      streamRef.current =
        stream;

      setCameraOpen(true);

      window.setTimeout(
        async () => {
          if (
            !videoRef.current
          ) {
            return;
          }

          videoRef.current
            .srcObject =
            stream;

          try {
            await videoRef
              .current
              .play();
          } catch (error) {
            console.error(
              "Camera playback error:",
              error
            );
          }

          setCameraLoading(
            false
          );
        },
        100
      );
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      stopCamera();

      setCameraError(
        error?.message ||
          "Camera could not be opened. Please allow camera permission."
      );
    }
  };

  const capturePhoto = () => {
    const video =
      videoRef.current;

    const canvas =
      canvasRef.current;

    if (
      !video ||
      !canvas
    ) {
      setCameraError(
        "Camera is not ready. Please try again."
      );

      return;
    }

    const videoWidth =
      video.videoWidth || 720;

    const videoHeight =
      video.videoHeight || 720;

    if (
      !videoWidth ||
      !videoHeight
    ) {
      setCameraError(
        "Camera is still loading. Please wait and try again."
      );

      return;
    }

    const cropSize =
      Math.min(
        videoWidth,
        videoHeight
      );

    const sourceX =
      (
        videoWidth -
        cropSize
      ) / 2;

    const sourceY =
      (
        videoHeight -
        cropSize
      ) / 2;

    const outputSize = 600;

    canvas.width =
      outputSize;

    canvas.height =
      outputSize;

    const context =
      canvas.getContext("2d");

    if (!context) {
      setCameraError(
        "Photo could not be captured."
      );

      return;
    }

    context.clearRect(
      0,
      0,
      outputSize,
      outputSize
    );

    /*
      Mirror final selfie so it matches
      the live camera preview.
    */
    context.save();

    context.translate(
      outputSize,
      0
    );

    context.scale(
      -1,
      1
    );

    context.drawImage(
      video,

      sourceX,
      sourceY,
      cropSize,
      cropSize,

      0,
      0,
      outputSize,
      outputSize
    );

    context.restore();

    const imageData =
      canvas.toDataURL(
        "image/jpeg",
        0.86
      );

    /*
      Captured image replaces any
      previously uploaded image.
    */
    setSelectedImage(
      imageData
    );

    setCameraError("");
    setStatus("");

    stopCamera();
  };

  const removeImage = () => {
    stopCamera();

    setSelectedImage("");
    setCameraError("");
    setStatus("");

    if (
      fileInputRef.current
    ) {
      fileInputRef.current
        .value = "";
    }
  };

  const cancelCamera = () => {
    stopCamera();
    setCameraError("");
  };

  const openPreview = (
    event
  ) => {
    event.preventDefault();

    setStatus("");

    if (!selectedImage) {
      setStatus(
        "Please upload or capture a profile image."
      );

      return;
    }

    setShowPreview(true);
  };

  const submit = async () => {
    if (submitting) {
      return;
    }

    if (!selectedImage) {
      setShowPreview(false);

      setStatus(
        "Please upload or capture a profile image."
      );

      return;
    }

    setSubmitting(true);
    setStatus("Submitting...");

    try {
      await apiPost(
        "/hari-bhakto/register",
        {
          ...form,

          satsang_attend:
            form
              .satsang_attend ===
            "Yes",

          photo_data:
            selectedImage,

          photo:
            selectedImage,
        }
      );

      stopCamera();

      setShowPreview(false);
      setShowThanks(true);
      setStatus("");

      refreshTimerRef.current =
        window.setTimeout(
          () => {
            window.location.reload();
          },
          3500
        );
    } catch (error) {
      setShowPreview(false);

      setStatus(
        error?.message ||
          "Registration could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const closeThanks = () => {
    if (
      refreshTimerRef.current
    ) {
      window.clearTimeout(
        refreshTimerRef.current
      );
    }

    window.location.reload();
  };

  return (
    <main className="hari-page">
      <section className="page-hero">
        <div className="page-shell">
          <p className="section-kicker">
          </p>
        </div>
      </section>

      <section className="hari-layout page-shell">
        <form
          className="form-grid hari-form"
          onSubmit={openPreview}
        >
          <div className="hari-form-head full-span">
            <span>
              Registration Form
            </span>

            <h2>
              Devotee Details
            </h2>

            <p>
              Fill in the details,
              review the preview,
              and then submit the
              form.
            </p>
          </div>

          <div className="devotee-photo-section full-span">
            <div
              className={`devotee-round-preview ${
                cameraOpen
                  ? "camera-active"
                  : ""
              }`}
            >
              {cameraOpen ? (
                <>
                  <video
                    ref={videoRef}
                    className="devotee-preview-media devotee-live-video"
                    autoPlay
                    muted
                    playsInline
                  />

                  {cameraLoading && (
                    <div className="devotee-camera-loading">
                      Opening
                      camera...
                    </div>
                  )}
                </>
              ) : selectedImage ? (
                <img
                  src={
                    selectedImage
                  }
                  alt="Devotee preview"
                  className="devotee-preview-media"
                />
              ) : (
                <div className="devotee-empty-preview">
                  <span className="camera-icon">
                    📷
                  </span>

                  <strong>
                    Image
                  </strong>

                  <small>
                    Upload or
                    capture photo
                  </small>
                </div>
              )}

              {(
                selectedImage ||
                cameraOpen
              ) && (
                <button
                  type="button"
                  className="devotee-remove-photo"
                  onClick={
                    removeImage
                  }
                  aria-label="Remove image"
                  title="Remove image"
                >
                  ×
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={
                handleImageUpload
              }
              hidden
            />

            <canvas
              ref={canvasRef}
              hidden
            />

            {!cameraOpen ? (
              <div className="devotee-photo-actions">
                <button
                  type="button"
                  className="photo-action-btn primary"
                  onClick={() =>
                    fileInputRef
                      .current
                      ?.click()
                  }
                >
                  {selectedImage
                    ? "Change Image"
                    : "Upload Image"}
                </button>

                <button
                  type="button"
                  className="photo-action-btn secondary"
                  onClick={
                    openCamera
                  }
                >
                  {selectedImage
                    ? "Take New Photo"
                    : "Open Camera"}
                </button>
              </div>
            ) : (
              <div className="devotee-photo-actions">
                <button
                  type="button"
                  className="photo-action-btn primary"
                  onClick={
                    capturePhoto
                  }
                  disabled={
                    cameraLoading
                  }
                >
                  Capture Photo
                </button>

                <button
                  type="button"
                  className="photo-action-btn secondary"
                  onClick={
                    cancelCamera
                  }
                >
                  Cancel Camera
                </button>
              </div>
            )}

            {cameraError && (
              <div className="camera-message error">
                {cameraError}
              </div>
            )}

            <div className="camera-message info">
              Upload or capture
              one profile image.
              Only images up to
              2MB are allowed.
            </div>
          </div>

          <label>
            Full Name

            <input
              name="full_name"
              value={
                form.full_name
              }
              onChange={update}
              required
            />
          </label>

          <label>
            Father / Husband Name

            <input
              name="father_husband_name"
              value={
                form
                  .father_husband_name
              }
              onChange={update}
            />
          </label>

          <label>
            Mobile Number

            <input
              name="mobile"
              value={
                form.mobile
              }
              onChange={update}
              required
            />
          </label>

          <label>
            WhatsApp Number

            <input
              name="whatsapp"
              value={
                form.whatsapp
              }
              onChange={update}
            />
          </label>

          <label>
            Email

            <input
              name="email"
              type="email"
              value={
                form.email
              }
              onChange={update}
            />
          </label>

          <label>
            Gender

            <select
              name="gender"
              value={
                form.gender
              }
              onChange={update}
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </label>

          <label>
            DOB

            <input
              name="date_of_birth"
              type="date"
              value={
                form
                  .date_of_birth
              }
              onChange={update}
            />
          </label>

          <label>
            Age

            <input
              name="age"
              type="number"
              value={form.age}
              readOnly
            />
          </label>

          <label className="full-span">
            Address

            <textarea
              name="address"
              rows="3"
              value={
                form.address
              }
              onChange={update}
            />
          </label>

          <label>
            City / Village

            <input
              name="city"
              value={form.city}
              onChange={update}
            />
          </label>

          <label>
            State

            <input
              name="state"
              value={form.state}
              onChange={update}
            />
          </label>

          <label>
            Occupation

            <input
              name="occupation"
              value={
                form.occupation
              }
              onChange={update}
            />
          </label>

          <label>
            Do you attend Satsang
            Sabha?

            <select
              name="satsang_attend"
              value={
                form
                  .satsang_attend
              }
              onChange={update}
            >
              <option value="">
                Select
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="No">
                No
              </option>
            </select>
          </label>

          <label className="full-span">
            Remarks

            <textarea
              name="remarks"
              rows="3"
              value={
                form.remarks
              }
              onChange={update}
            />
          </label>

          <button
            className="primary-btn"
            type="submit"
          >
            Preview Details
          </button>

          {status && (
            <p className="form-status full-span">
              {status}
            </p>
          )}
        </form>
      </section>

      {showPreview && (
        <div
          className="devotee-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Preview devotee registration"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowPreview(
                false
              );
            }
          }}
        >
          <div className="devotee-modal-card preview-card">
            <button
              className="modal-close"
              type="button"
              onClick={() =>
                setShowPreview(
                  false
                )
              }
              aria-label="Close preview"
            >
              ×
            </button>

            <span>
              Preview
            </span>

            <h2>
              Check Details Before
              Submit
            </h2>

            <div className="preview-layout">
              <img
                src={
                  selectedImage
                }
                alt="Preview devotee"
                className="preview-profile-image"
              />

              <div className="preview-details">
                <p>
                  <strong>
                    Full Name:
                  </strong>{" "}
                  {form.full_name ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Father /
                    Husband:
                  </strong>{" "}
                  {form
                    .father_husband_name ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Mobile:
                  </strong>{" "}
                  {form.mobile ||
                    "-"}
                </p>

                <p>
                  <strong>
                    WhatsApp:
                  </strong>{" "}
                  {form.whatsapp ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Email:
                  </strong>{" "}
                  {form.email ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Gender:
                  </strong>{" "}
                  {form.gender ||
                    "-"}
                </p>

                <p>
                  <strong>
                    DOB:
                  </strong>{" "}
                  {form
                    .date_of_birth ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Age:
                  </strong>{" "}
                  {form.age || "-"}
                </p>

                <p>
                  <strong>
                    Address:
                  </strong>{" "}
                  {form.address ||
                    "-"}
                </p>

                <p>
                  <strong>
                    City / State:
                  </strong>{" "}
                  {[
                    form.city,
                    form.state,
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Occupation:
                  </strong>{" "}
                  {form.occupation ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Satsang Sabha:
                  </strong>{" "}
                  {form
                    .satsang_attend ||
                    "-"}
                </p>

                <p>
                  <strong>
                    Remarks:
                  </strong>{" "}
                  {form.remarks ||
                    "-"}
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                onClick={() =>
                  setShowPreview(
                    false
                  )
                }
                disabled={
                  submitting
                }
              >
                Edit Details
              </button>

              <button
                type="button"
                onClick={submit}
                disabled={
                  submitting
                }
              >
                {submitting
                  ? "Submitting..."
                  : "Final Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showThanks && (
        <div
          className="devotee-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Registration thank you"
        >
          <div className="devotee-modal-card thank-card">
            <span>
              Jay Swaminarayan
            </span>

            <h2>
              Thank You!
            </h2>

            <p>
              Your devotee
              registration has
              been submitted
              successfully. We
              sincerely appreciate
              your time and
              connection with
              Shreeji Samipya
              Trust.
            </p>

            <small>
              This page will
              refresh
              automatically.
            </small>

            <button
              type="button"
              onClick={
                closeThanks
              }
            >
              Done
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default HariBhakt;