import React, { useState,useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './FacultyDashboard.css';

function FacultyDashboard() {



//for token to verify
  
  useEffect(()=>{
    
    //verify token and get details
    const token = localStorage.getItem('token');
     console.log('token fetched in facultydashboard :',token)
    axios
      .post('http://localhost:5000/verifylogintoken',{token})
      .then((res)=>{
        //if token is invalid
        console.log(res.data.message)
        if(res.data.message ==="tokennotvalid" ){
          localStorage.clear();
          alert("please login first");
          navigate('/');
        }
        //if Token is valid
      
      })
      .catch((err)=>{console.log("Error in token Verification ",err)});
 },[])


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
    alert("you are logged Out successfully")
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
