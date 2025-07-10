import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top w-100">
      <div className="container-fluid">
        <Link className="navbar-brand" to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}>
          Candidate Referral
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to={user.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}>
                Dashboard
              </Link>
            </li>
            {user.role === "user" && (
              <li className="nav-item">
                <Link className="nav-link" to="/user/refer">
                  Refer Candidate
                </Link>
              </li>
            )}
          </ul>
          <span className="navbar-text me-3">{user.name} ({user.role})</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 