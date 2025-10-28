import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="header">
      <h1>Checkpoint : frontend</h1>
      <div className="header-subtitle">Countries</div>

      <nav className="header-nav" aria-label="Main navigation">
        <NavLink to="/index" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Show All
        </NavLink>
        <NavLink to="/addcountry" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
          Add country
        </NavLink>
      </nav>
    </header>
  );
}