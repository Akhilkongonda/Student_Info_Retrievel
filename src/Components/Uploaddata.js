import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import './Uploaddata.css';      

function Uploaddata() {
  const inputRef = useRef(null);
  const [jsonData, setJsonData] = useState(null);
  const[resultin ,setresultin]=useState(null)

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const parsedJsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Now you have parsedJsonData array containing the rows from the Excel file
          // console.log(parsedJsonData);
          setJsonData(parsedJsonData);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSubmit = () => {
    if (jsonData) {

      axios.post('http://localhost:3500/StudentApi/post',jsonData)// this will send /post this data to the server and then backend to check for the particular rollnumber
            .then(result=>{  
              console.log("hii data received") // if the apis sends correcr responds then  the data from database is sent to the results 
              console.log("the check is ",result)
              setresultin(result.data);
              
            
              
            })
            .catch(err=>{
              console.log("error at front end"+err.message);
              setresultin("Wrong file format. Please check the uploaded file format and verify the column names ");

             
            })
            


      // Reset jsonData after submission
      // console.log("the data from sheet is",jsonData);
      setJsonData(null);
      
      // Clear the input field
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="background-img">
      <div className="card-analyse card-body">
        <label htmlFor="filename" className="p-3">
          Upload file
        </label>
        <input
          className="p-3"
          ref={inputRef}
          onChange={handleFileChange}
          type="file"
          name="file"
          id="file"
        />

<button className="btnn btn-primary m-auto d-block" onClick={handleSubmit}>
          Submit
        </button>
        {resultin && (
          <p className="text-danger text-center mt-4">
            {resultin}
          </p>
        )}
      </div>
  
      
        {/* Add a submit button */}
        
     
    </div>
  );
  
}

export default Uploaddata;
