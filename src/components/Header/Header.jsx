import "./Header.css";

export default function Header() {
  return (
    <header className="th-header">
      <div className="container th-header__inner">
        <div className="th-header__brand">Threadline</div>
        <div className="th-header__right">
          <span className="th-header__chip">Signed in</span>
        </div>
      </div>
    </header>
  );
}
