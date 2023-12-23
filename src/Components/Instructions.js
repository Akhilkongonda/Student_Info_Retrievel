import React from 'react';
import './Instructions.css'; // Create a separate CSS file for styling

function Instructions() {
  const columnNames = [
    'AdmnNo', 'Name', 'SEM1-1GPA', 'SEM1-1Backlogs', 'SEM1-2GPA', 'SEM1-2Backlogs',
    'SEM2-1GPA', 'SEM2-1Backlogs', 'SEM2-2GPA', 'SEM2-2Backlogs', 'SEM3-1GPA',
    'SEM3-1Backlogs', 'SEM3-2GPA', 'SEM3-2Backlogs', 'SEM4-1GPA', 'SEM4-1Backlogs',
    'SEM4-2GPA', 'SEM4-2Backlogs', 'AluminiGPA', 'AluminiBacklogs', 'FinalCGPA',
    'TotalCredits', 'TotalBacklogs',
  ];

  return (
    <div>
      <div>
        <p></p>

        
        <div className="row">
          <div className="col col-sm-8 background-image">
            {/* Content in the left column */}
          </div>
          <div className="col col-sm-4">
            <p style={{marginTop:"60px"}}>Prepare a CSV file with the following columns while uploading Data</p>
            <ul>
              {columnNames.map((colname) => (
                <li key={colname}>{colname}</li>
              ))}
            </ul>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Instructions;
