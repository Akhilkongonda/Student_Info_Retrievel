import React, { useState, useEffect } from 'react';
import './Representation.css';
import axios from 'axios';
import Chart from 'chart.js/auto';

function Representation() {
  const [branchData, setBranchData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:3500/StudentApi/gettopresent')
      .then(result => {
        console.log('Data received:', result.data);
        const branchCounts = countStudentsByBranch(result.data.payload);
        setBranchData(branchCounts);
        createChart(branchCounts);
      })
      .catch(err => {
        console.log('Error at frontend:', err.message);
      });
  };

  const countStudentsByBranch = (students) => {
    const branchCounts = {};
    students.forEach(student => {
      const branch = student.SubBranch;
      branchCounts[branch] = (branchCounts[branch] || 0) + 1;
    });
    return Object.entries(branchCounts).map(([SubBranch, Count]) => ({ SubBranch, Count }));
  };

  const createChart = (data) => {
    const ctx = document.getElementById('branchDistributionChart').getContext('2d');

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(entry => entry.SubBranch),
        datasets: [{
          label: 'Number of Students',
          data: data.map(entry => entry.Count),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  return (
    <div className='represent'>
      <h5 className='text-center'>Representation</h5>
      <div>
        <h4 className='text-center'>Number of students in each branch</h4>
        <button className='btn btn-primary m-auto d-block' onClick={fetchData}>Analyze</button>
        
      </div>
     
      {branchData.length > 0 && (
        <canvas id='branchDistributionChart' width='400' height='200'></canvas>
      )}
      
      
    </div>
  );
}

export default Representation;
