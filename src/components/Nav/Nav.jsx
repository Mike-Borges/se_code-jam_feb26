import { NavLink } from "react-router-dom";
import "./Nav.css";

export default function Nav() {
  return (
    <nav className="th-tabs">
      <div className="container th-tabs__inner">
        <NavLink
          className={({ isActive }) => `th-tab ${isActive ? "is-active" : ""}`}
          to="/"
        >
          Feed
        </NavLink>
        <NavLink
          className={({ isActive }) => `th-tab ${isActive ? "is-active" : ""}`}
          to="/messages"
        >
          Messages
        </NavLink>
        <NavLink
          className={({ isActive }) => `th-tab ${isActive ? "is-active" : ""}`}
          to="/profile"
        >
          Profile
        </NavLink>
      </div>
    </nav>
  );
}
