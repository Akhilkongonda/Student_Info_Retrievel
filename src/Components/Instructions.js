import React from 'react'
import './Instructions.css';

function Instructions() {
  return (
    <div className='mt-4'>
        <p>*Please follow these instructions when uploading student data:</p>
<ol>
    <li>Prepare a CSV file with the following columns:</li>
    <ul>
        <li>Sno (Serial Number)</li>
        <li>HTNo (Hall Ticket Number)</li>
        <li>Name</li>
        <li>AdminNo (Admin Number)</li>
        <li>YearOfJoin (Year of Joining)</li>
        <li>AdminDate (Admission Date)</li>
        <li>AdmissionType</li>
        <li>DOB (Date of Birth)</li>
        <li>Gender</li>
        <li>FatherName</li>
        <li>StudentMobileNo</li>
        <li>CETName (Common Entrance Test Name)</li>
        <li>CETHTNo (CET Hall Ticket Number)</li>
        <li>CETRank (CET Rank)</li>
        <li>SubBranch (Sub Branch of Study)</li>
        <li>FeeReimbursementAmt (Fee Reimbursement Amount)</li>
        <li>CompletionYear</li>
        <li>Email</li>
    </ul>
    <li>Ensure the file format is correct before uploading.</li>
    
</ol>

   <p>*Please follow these instructions when Anlyzing student data</p>
   <ol>
 
    Enter valid Rollnumber Number of a Student
   </ol>

    </div>
  )
}

export default Instructions