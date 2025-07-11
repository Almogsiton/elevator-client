import { Link } from "react-router-dom";
import "../styles/navbar.css";

export default function Header() {
  return (
    <header className="navbar">
      <h2 className="navbar-title">Elevator System</h2>
      <nav className="navbar-links">
        <Link to="/buildings">Buildings</Link>
        <Link to="/contact">Contact</Link>
        <Link
          to="/"
          onClick={() => localStorage.removeItem("userId")}
        >
          Logout
        </Link>
      </nav>
    </header>
  );
}
