import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import './FacultyDashboard.css';

function FacultyDashboard() {
  const navigate = useNavigate();
  const [isNavOpen, setNavOpen] = useState(false);

  const moveto = () => {
    navigate('/FacultyDashboard/Uploaddata');
    setNavOpen(false);
  };

  const handleNavToggle = () => {
    setNavOpen(!isNavOpen);
  };

  return (
    <div className="container-fluid p-0 background" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
        <nav className="navbar navvbar navbar-expand-lg  fixed-top">
          <div className="container">
            <button
              className={`navbar-toggler ${isNavOpen ? 'collapsed' : ''}`}
              type="button"
              onClick={handleNavToggle}
              aria-controls="navbarNav"
              aria-expanded={isNavOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item navvitem">
                  <NavLink to="/FacultyDashboard/Uploaddata" className="nav-link" activeClassName="active" onClick={moveto}>
                    Upload Data
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/FacultyDashboard/Analysedata" className="nav-link" activeClassName="active">
                    CSIT_2020
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/FacultyDashboard/Representation" className="nav-link" activeClassName="active">
                    CSIT2K20 Analysis
                  </NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <div className="row m-0" style={{ flex: 1, display: 'flex', marginTop: '70px' }}>
        <div className="col-sm-12 border" style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
