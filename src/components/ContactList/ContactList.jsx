import { useState, useEffect } from "react";
import API_URL from "../../config";
import "./ContactList.css";

export default function ContactList({ title = "Contacts", onFriendsChange }) {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sent, setSent] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchFriends = () => {
    if (!token) return;
    fetch(`${API_URL}/api/friends`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setFriends(data); })
      .catch(() => {});
  };

  const fetchRequests = () => {
    if (!token) return;
    fetch(`${API_URL}/api/friends/requests`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setRequests(data); })
      .catch(() => {});
  };

  const fetchSent = () => {
    if (!token) return;
    fetch(`${API_URL}/api/friends/sent`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setSent(data); })
      .catch(() => {});
  };

  useEffect(() => {
    fetchFriends();
    fetchRequests();
    fetchSent();
  }, []);

  const handleSendRequest = async () => {
    if (!identifier.trim()) return;
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/friends/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ identifier: identifier.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
        return;
      }

      setSuccess("Friend request sent!");
      setIdentifier("");
      fetchSent();
      setTimeout(() => { setSuccess(""); setShowInput(false); }, 1500);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const res = await fetch(`${API_URL}/api/friends/accept/${requestId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
        if (data.friend) setFriends((prev) => [...prev, data.friend]);
        if (onFriendsChange) onFriendsChange();
      }
    } catch {}
  };

  const handleDecline = async (requestId) => {
    try {
      const res = await fetch(`${API_URL}/api/friends/decline/${requestId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r._id !== requestId));
      }
    } catch {}
  };

  const handleCancel = async (requestId) => {
    try {
      const res = await fetch(`${API_URL}/api/friends/request/${requestId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSent((prev) => prev.filter((r) => r._id !== requestId));
      }
    } catch {}
  };

  const handleRemove = async (friendId) => {
    try {
      const res = await fetch(`${API_URL}/api/friends/${friendId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setFriends((prev) => prev.filter((f) => (f._id || f.id) !== friendId));
        if (onFriendsChange) onFriendsChange();
      }
    } catch {}
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendRequest();
    if (e.key === "Escape") {
      setShowInput(false);
      setIdentifier("");
      setError("");
      setSuccess("");
    }
  };

  return (
    <aside className="card contacts">
      <div className="contacts__header">
        <span>{title}</span>
        <button
          className="contacts__addBtn"
          type="button"
          onClick={() => { setShowInput(!showInput); setError(""); setSuccess(""); }}
          aria-label="Add friend"
        >
          +
        </button>
      </div>

      {showInput && (
        <div className="contacts__addRow">
          <input
            className="contacts__addInput"
            placeholder="Username or email..."
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <button
            className="contacts__addSubmit"
            type="button"
            onClick={handleSendRequest}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      )}
      {error && <p className="contacts__error">{error}</p>}
      {success && <p className="contacts__success">{success}</p>}

      {requests.length > 0 && (
        <div className="contacts__requests">
          <div className="contacts__requestsLabel">Friend Requests</div>
          {requests.map((r) => (
            <div key={r._id} className="contacts__requestRow">
              <div className="contacts__avatar" aria-hidden="true" />
              <div className="contacts__name">{r.from.username}</div>
              <div className="contacts__requestActions">
                <button
                  className="contacts__acceptBtn"
                  type="button"
                  onClick={() => handleAccept(r._id)}
                >
                  ✓
                </button>
                <button
                  className="contacts__declineBtn"
                  type="button"
                  onClick={() => handleDecline(r._id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sent.length > 0 && (
        <div className="contacts__requests">
          <div className="contacts__requestsLabel">Sent Requests</div>
          {sent.map((r) => (
            <div key={r._id} className="contacts__requestRow">
              <div className="contacts__avatar" aria-hidden="true" />
              <div className="contacts__name">{r.to.username}</div>
              <div className="contacts__requestActions">
                <button
                  className="contacts__declineBtn"
                  type="button"
                  onClick={() => handleCancel(r._id)}
                  title="Cancel request"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="contacts__list">
        {friends.length === 0 && requests.length === 0 && sent.length === 0 && !showInput && (
          <p className="contacts__empty">No friends yet</p>
        )}
        {friends.map((f) => (
          <div key={f._id || f.id} className="contacts__row">
            <div className="contacts__avatar" aria-hidden="true" />
            <div className="contacts__name">{f.username}</div>
            <button
              className="contacts__removeBtn"
              type="button"
              onClick={() => handleRemove(f._id || f.id)}
              aria-label="Remove friend"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
