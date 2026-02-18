import { useState } from "react";
import "./AddMemoryModal.css";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - i);

export default function AddMemoryModal({ onClose, onCreated }) {
  const [tab, setTab] = useState("photo");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreviews(selected.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    setError("");

    if (!month || !day || !year) {
      setError("Please select a complete date.");
      return;
    }
    if (tab === "photo" && files.length === 0) {
      setError("Please choose at least one photo.");
      return;
    }
    if (tab === "text" && !text.trim()) {
      setError("Please write something for your memory.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("type", tab);
      formData.append("month", month);
      formData.append("day", day);
      formData.append("year", year);

      if (text.trim()) {
        formData.append("text", text);
      }
      if (tab === "photo") {
        files.forEach((f) => formData.append("photos", f));
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create memory");
        return;
      }

      onCreated(data);
      onClose();
    } catch {
      setError("Something went wrong. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__tabs">
          <button
            className={`modal__tab ${tab === "photo" ? "modal__tab--active" : ""}`}
            onClick={() => setTab("photo")}
          >
            Photo
          </button>
          <button
            className={`modal__tab ${tab === "text" ? "modal__tab--active" : ""}`}
            onClick={() => setTab("text")}
          >
            Text
          </button>
        </div>

        <div className="modal__body">
          <h2 className="modal__heading">
            {tab === "photo" ? "Upload a Memory" : "Write a Memory"}
          </h2>

          <div className="modal__dateRow">
            <select className="modal__select" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Select Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
            <select className="modal__select" value={day} onChange={(e) => setDay(e.target.value)}>
              <option value="">Select Day</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select className="modal__select" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Select Year</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {tab === "photo" && (
            <>
              <label className="modal__fileLabel">
                Choose Photo(s)
                <input
                  className="modal__fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFiles}
                />
              </label>
              {previews.length > 0 && (
                <div className="modal__previews">
                  {previews.map((src, i) => (
                    <img key={i} className="modal__preview" src={src} alt="" />
                  ))}
                </div>
              )}
              <textarea
                className="modal__textarea modal__caption"
                placeholder="Add a caption..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </>
          )}

          {tab === "text" && (
            <textarea
              className="modal__textarea"
              placeholder="Text input answering the above prompt..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}

          {error && <p className="modal__error">{error}</p>}

          <button className="modal__btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Posting..." : "Post Memory"}
          </button>
        </div>
      </div>
    </div>
  );
}
