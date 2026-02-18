import "./Header.css";

export default function Header({ onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <header className="th-header">
      <div className="container th-header__inner">
        <div className="th-header__brand">Chronicle</div>
        <div className="th-header__right">
          <span className="th-header__chip">
            {user.username ? `Signed in as ${user.username}` : "Signed in"}
          </span>
          <button className="th-header__logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
