import { Routes, Route, Navigate } from "react-router-dom";
import Feed from "../../pages/Feed/Feed";
import Messages from "../../pages/Messages/Messages";
import Profile from "../../pages/Profile/Profile";
import "./View.css";

export default function View() {
  return (
    <main className="th-view">
      <div className="container th-view__inner">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </main>
  );
}
