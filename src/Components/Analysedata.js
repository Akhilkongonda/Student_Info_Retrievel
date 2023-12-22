import {React, useState} from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios'

import './Analysedata.css';



function Analysedata() {

    const [studentdata,setstudentdata]=useState();
      const {
          register,
          handleSubmit,
          formState: { errors },
          setValue
        } = useForm();
        
        const onSubmit = (data)=>{

            console.log('Submited data is : ' ,data);
            axios.post('http://localhost:3500/StudentApi/get',data)// this will send /post this data to the server and then backend to check for the particular rollnumber
            .then(result=>{  
              console.log("hii data received") // if the apis sends correcr responds then  the data from database is sent to the results 
              console.log("the data received",result.data);
              setValue("rollnumber","");
            
              {
                setstudentdata(result.data)
    
              }// this data is came from the backebd that is from studentapi/get;
              
            })
            .catch(err=>{
              console.log("error at front end"+err.message);
             
            })
          }

    return (
        <div className='bb'>
            <div className='cardanalyse card-body'>
                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    <input className='mt-4' type="text" name="rollnumber" id="rollnumber" placeholder=' Enter Rollnumber'
                        {...register("rollnumber", { required: "Username is required" })} />
                    <div className='mt-4'>
                        <button className='btnn m-auto d-block mt-4' type="submit">submit</button>
                    </div>
                </form>

            </div>

            {studentdata ? (
                <div className='mt-5'>
                    <h4 className='text-center'>Student Information</h4>
                    {studentdata.payload && studentdata.payload.length > 0 ? (
                        <table className='table tabledata'>
                            <thead>
                                <tr>
                                    <th>Attribute</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(studentdata.payload[0]).map(([key, value]) => (
                                    <tr key={key}>
                                        <td className='table-cell'>{key}</td>
                                        <td className='table-cell'>{value}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className='text-center text-danger'>No results found for the provided roll number.</p>
                    )}
                </div>
            ) : null}
        </div>
    )
}

export default Analysedata