import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Chart from 'chart.js/auto';

function Representation() {
  const API_URL = process.env.REACT_APP_API_URL
  const [studentData, setStudentData] = useState(null);
  const chartRef = useRef(null);
  const { register, handleSubmit, setValue } = useForm();
  const [error, setError] = useState(null);

  // Initialize the chart when the component mounts
  useEffect(() => {
    const chartContainer = document.getElementById('myChart');
    if (chartContainer && !chartRef.current) {
      chartRef.current = new Chart(chartContainer, {
        type: 'bar',
        data: { datasets: [] },
        options: {
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
            },
          },
        },
      });
    }

    return () => {
      // Clean up the chart when the component is unmounted
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [studentData]); // Dependency array ensures chart is reinitialized when studentData changes

  // Listen for changes in studentData and update the chart
  useEffect(() => {
    if (chartRef.current && studentData && studentData.length > 0) {
      const semesters = [
        'sem1-1gpa',
        'sem1-2gpa',
        'sem2-1gpa',
        'sem2-2gpa',
        'sem3-1gpa',
        'sem3-2gpa',
        'sem4-1gpa',
        'sem4-2gpa',
      ];

      // Extract GPA and Backlogs data
      const gpaData = semesters.map((semester) => {
        const gpa =
          studentData[0][semester] !== undefined ? parseFloat(studentData[0][semester]) : 0;
        return isNaN(gpa) ? 0 : gpa;
      });

      const backlogsData = semesters.map((semester) => {
        const backlogs =
          studentData[0][`${semester.replace('gpa', 'backlogs')}`] !== undefined
            ? parseInt(studentData[0][`${semester.replace('gpa', 'backlogs')}`])
            : 0;
        return isNaN(backlogs) ? 0 : backlogs;
      });

      // Update the chart data
      chartRef.current.data.labels = semesters;
      chartRef.current.data.datasets = [
        {
          label: 'Semester-wise GPA',
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          data: gpaData,
        },
        {
          label: 'Semester-wise Backlogs',
          backgroundColor: 'rgba(255,99,132,0.4)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          data: backlogsData,
        },
      ];

      // Update the chart
      chartRef.current.update();
    }
  }, [studentData]);

  const onSubmit = (data) => {
    axios
      .post(`${API_URL}/StudentApi/gettorepresent`, data)
      .then((result) => {
        console.log('Data received', result.data);
        setValue('rollnumber', '');
        setStudentData(result.data.payload);
        setError(null); // Reset error state when new data is received
      })
      .catch((err) => {
        console.log('Error at frontend', err.message);
        setStudentData(null); // Reset student data on error
        setError('No student information available.'); // Set error message
      });
  };

  return (
    <div>
      <div className="cardanalyse card-body">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="mt-4"
            type="text"
            name="rollnumber"
            id="rollnumber"
            placeholder="Enter Rollnumber"
            {...register('rollnumber', { required: 'Username is required' })}
          />
          <div className="mt-4">
            <button className="btnn btn-primary m-auto d-block mt-4" type="submit">
              Submit
            </button>
          </div>
        </form>
      </div>

      {studentData && studentData.length > 0 ? (
        <div className="mt-4">
          <h2>Student Information</h2>
          <p>Roll Number: {studentData[0].admnno}</p>
          <p>Name: {studentData[0].name}</p>
          <canvas id="myChart" style={{ width: '500px', height: '300px', maxHeight: '300px' }}></canvas>

          {/* Display Total Backlogs and Final CGPA below the chart */}
          {studentData[0].totalbacklogs !== undefined && studentData[0].finalcgpa !== undefined && (
            <div>
              <h5>Total Backlogs: {studentData[0].totalbacklogs}</h5>
              <h5>Final CGPA: {studentData[0].finalcgpa}</h5>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mt-4">
            {error && <div className="error-message">{error}</div>}
          </div>
        </>
      )}
    </div>
  );
}

export default Representation;
