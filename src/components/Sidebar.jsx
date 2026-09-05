import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  // Custom theme colors matching your requirements
  const colors = {
    lightPurple: "#e5d2fa",
    deepPurple: "#6B21A8",
    mediumGray: "#6B7280",
    deepBlue: "#6850F5",
  };
  const [activeLink, setActiveLink] = useState("/");

  const activeStyle = { color: "#6B21A8", fontWeight: "700" };
  const inactiveStyle = { color: "#6B7280", fontWeight: "500" };
  return (
    <>
      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop {
            width: 260px;
            height: 100vh;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            background-color: ${colors.lightPurple} !important;
          }
          .main-content {
            margin-left: 260px;
          }
        }
        @media (max-width: 767.98px) {
          .offcanvas {
            z-index: -1; /* As requested: z-index -1 on small screens when closed */
            background-color: ${colors.lightPurple} !important;
          }
          .offcanvas.show {
            z-index: 1050; /* Automatically bumps up when opened via toggle */
          }
        }
      `}</style>

      {/* 2. MOBILE NAVBAR & TOGGLE BUTTON (Visible only on small screens) */}
      <div className="d-md-none p-3 bg-white border-bottom fixed-top d-flex justify-content-between align-items-center">
        <span className="fs-4 fw-bold " style={{ color: colors.deepBlue }}>
          workasana
        </span>
        <button
          className="btn text-dark"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#sidebarMenu"
        >
          ☰
        </button>
      </div>

      {/* 3. SIDEBAR CONTAINER (Uses Bootstrap Offcanvas behavior) */}
      <nav
        id="sidebarMenu"
        className="offcanvas-md offcanvas-start sidebar-desktop p-4 border-end"
        style={{ backgroundColor: colors.lightPurple }}
        tabIndex="-1"
      >
        {/* Mobile Close Header (Visible only inside mobile drawer) */}
        <div className="d-flex d-md-none justify-content-between align-items-center mb-4">
          <Link
            href="/"
            className="fs-3 fw-bold text-decoration-none"
            style={{ color: colors.deepBlue }}
          >
            workasana
          </Link>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            data-bs-target="#sidebarMenu"
            aria-label="Close"
          ></button>
        </div>

        {/* Brand Name (Visible only on Desktop) */}
        <div className="d-none d-md-block mb-5">
          <Link
            href="/"
            className="fs-3 fw-bold text-decoration-none"
            style={{ color: colors.deepBlue }}
          >
            workasana
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="nav flex-column gap-3">
          <li className="nav-item">
            <Link
              className="nav-link p-0 d-flex align-items-center gap-2"
              to="/"
              style={activeLink === "/" ? activeStyle : inactiveStyle}
              onClick={() => setActiveLink("/")}
            >
              <i className="bi bi-speedometer2 fs-5"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link p-0 d-flex align-items-center gap-2"
              to="/project"
              style={activeLink === "/project" ? activeStyle : inactiveStyle}
              onClick={() => setActiveLink("/project")}
            >
              <i className="bi bi-folder fs-5"></i>
              <span>Project</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link p-0 d-flex align-items-center gap-2"
              to="/team"
              style={activeLink === "/team" ? activeStyle : inactiveStyle}
              onClick={() => setActiveLink("/team")}
            >
              <i className="bi bi-people fs-5"></i>
              <span>Team</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link p-0 d-flex align-items-center gap-2"
              to="/report"
              style={activeLink === "/report" ? activeStyle : inactiveStyle}
              onClick={() => setActiveLink("/report")}
            >
              <i className="bi bi-graph-up-arrow fs-5"></i>
              <span>Report</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              className="nav-link p-0 d-flex align-items-center gap-2"
              to="/setting"
              style={activeLink === "/setting" ? activeStyle : inactiveStyle}
              onClick={() => setActiveLink("/setting")}
            >
              <i className="bi bi-gear fs-5"></i>
              <span>Setting</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
