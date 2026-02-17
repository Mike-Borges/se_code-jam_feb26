import ContactList from "../components/ContactList/ContactList";
import "./feed.css";

export default function Feed() {
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
          <button className="pill-primary" type="button">
            Add Memory
          </button>
          <button className="pill" type="button">
            Quizes
          </button>
          <button className="pill" type="button">
            Random Memory
          </button>
        </div>

        <div className="feed__timeline">
          {[0, 1].map((row) => (
            <div key={row} className="feed__dateGroup">
              <div className="feed__date">00/00/00</div>
              <div className="feed__grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="card memory">
                    <div className="memory__thumb" />
                    <div className="memory__text">
                      Text Post goes here. 8px from all edges. Truncated text...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <ContactList title="Friends" />
    </div>
  );
}
