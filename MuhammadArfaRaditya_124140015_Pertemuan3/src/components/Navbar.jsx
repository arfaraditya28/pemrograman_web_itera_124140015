import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner container">
        <NavLink
          to="/"
          className="navbar__brand"
          aria-label="Muhammad Arfa Raditya, kembali ke dashboard"
        >
          <span className="navbar__brand-text">
            <span className="navbar__brand-name">Muhammad Arfa Raditya</span>
            <span className="navbar__brand-nim">124140015</span>
          </span>
        </NavLink>
        <nav className="navbar__nav" aria-label="Navigasi utama">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar__link${isActive ? ' is-active' : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) => `navbar__link${isActive ? ' is-active' : ''}`}
          >
            Statistik
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
