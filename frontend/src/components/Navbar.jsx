import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container">
        <NavLink to="/" className="navbar-brand">
          Wayfarer <span className="brand-mark">Tours</span>
        </NavLink>
        <ul className="navbar-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/packages">Packages</NavLink></li>
          <li><NavLink to="/my-bookings">My Bookings</NavLink></li>
          <li><NavLink to="/admin">Admin</NavLink></li>
        </ul>
      </div>
    </header>
  );
}
