import './FacultyDashboard.css';
import { Outlet, useNavigate } from 'react-router-dom';

function FacultyDashboard() {
  const navigate = useNavigate();

  const moveto = () => {
    navigate('/FacultyDashboard/Uploaddata');
  };

  return (
    <div className='container-fluid p-0 background' style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header>
        <h3 className='textborder text-center m-0'>Faculty Dashboard</h3>
      </header>
      

      <div className='row m-0' style={{ flex: 1, display: 'flex' }}>
        <div className='col-sm-2 leftnavbar ' style={{ display: 'flex', flexDirection: 'column' }}>
          


          <div className=' sidebuttons'>
<button class="arrow-button"  onClick={moveto}>Upload data<span class="arrow"></span>
</button>
          </div>


          <div className=' sidebuttons  p-0'>
          <button className="arrow-button" onClick={() => { navigate('/FacultyDashboard/Analysedata') }}>Student data<span class="arrow"></span>
</button>
          </div>
          <div className=' sidebuttons  p-0'>
          <button className="arrow-button" onClick={() => { navigate('/FacultyDashboard/Representation') }}>Analysis<span class="arrow"></span>
</button>
          </div>


        </div>

        <div className="col-sm-10 border" style={{ flex: 1 }}>
          <Outlet />
      
        </div>
      </div>
    </div>
  );
}

export default FacultyDashboard;
