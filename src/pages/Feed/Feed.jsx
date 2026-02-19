import { useState, useEffect } from "react";
import API_URL from "../../config";
import ContactList from "../../components/ContactList/ContactList";
import AddMemoryModal from "../../components/AddMemoryModal/AddMemoryModal";
import "./Feed.css";

function groupByDate(posts, sort) {
  const sorted = [...posts].sort((a, b) => {
    if (sort === "chronological") {
      const da = new Date(a.memoryDate.year, a.memoryDate.month - 1, a.memoryDate.day);
      const db = new Date(b.memoryDate.year, b.memoryDate.month - 1, b.memoryDate.day);
      return db - da;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const groups = {};
  for (const post of sorted) {
    const { month, day, year } = post.memoryDate;
    const key = `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(post);
  }
  return Object.entries(groups);
}

export default function Feed() {
  const [showModal, setShowModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("recent");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchPosts = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/api/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleMemoryCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const dateGroups = groupByDate(posts, sort);

  return (
    <div className="layout">
      <section className="feed">
        <div className="card feed__prompt">
          <div className="feed__promptTop">
            <h2 className="feed__title">Prompt of the Day</h2>
            <p className="feed__subtitle">
              The question goes here underneath the banner?
            </p>
          </div>

          <div className="feed__inputRow">
            <input
              className="feed__input"
              placeholder="User may answer the prompt or upload a photo..."
            />
            <button className="feed__send" type="button" aria-label="submit">
              ➤
            </button>
          </div>
        </div>

        <div className="feed__actions">
          <button className="pill-primary" type="button" onClick={() => setShowModal(true)}>
            Add Memory
          </button>
          <button className="pill" type="button">
            Quizes
          </button>
          <button className="pill" type="button">
            Random Memory
          </button>
        </div>

        <div className="feed__sort">
          <button
            className={`pill-sort ${sort === "recent" ? "pill-sort--active" : ""}`}
            type="button"
            onClick={() => setSort("recent")}
          >
            Recently Added
          </button>
          <button
            className={`pill-sort ${sort === "chronological" ? "pill-sort--active" : ""}`}
            type="button"
            onClick={() => setSort("chronological")}
          >
            Chronological
          </button>
        </div>

        <div className="feed__timeline">
          {dateGroups.length === 0 && (
            <p className="feed__empty">No memories yet. Add your first one!</p>
          )}
          {dateGroups.map(([date, memories]) => (
            <div key={date} className="feed__dateGroup">
              <div className="feed__date">{date}</div>
              <div className="feed__grid">
                {memories.map((post) => (
                  <div key={post._id} className="card memory">
                    {post.type === "photo" && post.images.length > 0 ? (
                      <img
                        className="memory__thumb"
                        src={`${API_URL}/uploads/${post.images[0]}`}
                        alt="memory"
                      />
                    ) : (
                      <div className="memory__thumb" />
                    )}
                    {post.author && post.author._id !== currentUser.id && (
                      <div className="memory__author">{post.author.username}</div>
                    )}
                    {post.text && (
                      <div className="memory__text">{post.text}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactList title="Friends" onFriendsChange={fetchPosts} />

      {showModal && (
        <AddMemoryModal
          onClose={() => setShowModal(false)}
          onCreated={handleMemoryCreated}
        />
      )}
    </div>
  );
}
