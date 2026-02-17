import { useMemo, useState } from "react";
import paperTexture from "../../assets/Paper_texture_21.png";

import "./MessageThread.css";

export default function MessageThread() {
  const [text, setText] = useState("");

  const demo = useMemo(
    () => [
      {
        id: 1,
        side: "left",
        msg: "Direct Message. 24 px left, right, up, down borders...",
      },
      {
        id: 2,
        side: "right",
        msg: "Direct Message. 24 px left, right, up, down borders...",
      },
      {
        id: 3,
        side: "left",
        msg: "Direct Message. 24 px left, right, up, down borders...",
      },
      {
        id: 4,
        side: "right",
        msg: "Direct Message. 24 px left, right, up, down borders...",
      },
    ],
    [],
  );

  function onSend() {
    if (!text.trim()) return;
    // later: dispatch to store / API
    setText("");
  }

  return (
    <section
      className="card thread"
      style={{ backgroundImage: `url(${paperTexture})` }}
    >
      <div className="thread__scroll">
        {demo.map((m) => (
          <div key={m.id} className={`bubbleRow ${m.side}`}>
            <div className="bubble">{m.msg}</div>
          </div>
        ))}
      </div>

      <div className="thread__composer">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="composer__input"
          placeholder="Sending a message to friend..."
        />
        <button
          className="composer__send"
          type="button"
          onClick={onSend}
          aria-label="send"
        >
          ➤
        </button>
      </div>
    </section>
  );
}
