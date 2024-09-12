import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './FacultyDashboard.css';

function FacultyDashboard() {
  const API_URL = process.env.REACT_APP_API_URL

  const [logedin, setlogedin] = useState();
  //for token to verify

  useEffect(() => {

    //verify token and get details
    const token = localStorage.getItem('token');
    console.log('token fetched in facultydashboard :', token)
    axios
      .post(`${API_URL}/verifylogintoken`, { token })
      .then((res) => {
        //if token is invalid
        // console.log(res.data.message)
        // console.log(res.data.userinfo)
        setlogedin(res.data.userinfo);
        if (res.data.message === "tokennotvalid") {
          alert("please login first")
          localStorage.clear();

          navigate('/');

        }
      })
      .catch((err) => { console.log("Error in token Verification ", err) });
  })


  /////upto here 




  const navigate = useNavigate();
  const [isNavOpen, setNavOpen] = useState(false);

  const moveto = () => {
    navigate('/FacultyDashboard/Uploaddata');
    setNavOpen(false);
  };

  const handleNavToggle = () => {
    setNavOpen(!isNavOpen);
  };



  const handleLogout = () => {
    // Clear localStorage
    alert(" click ok ! to logOut successfully")
    localStorage.clear();


    // Redirect to the login page
    navigate('/');
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
                    StudentInfo
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/FacultyDashboard/Representation" className="nav-link" activeClassName="active">
                    Result Analysis
                  </NavLink>
                </li>


                <li className="nav-item logout">
                  <NavLink to="/" className="nav-link" activeClassName="active" onClick={handleLogout}>
                    LogOut
                  </NavLink>
                </li>
              </ul>
              <ul className='placetext'>
                {logedin}
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
