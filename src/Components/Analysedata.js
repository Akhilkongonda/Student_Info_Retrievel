import { React, useState } from 'react'
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { Modal, Button } from 'react-bootstrap';

import './Analysedata.css';



function Analysedata() {
    const API_URL = process.env.REACT_APP_API_URL

    const [studentdata, setstudentdata] = useState();
    const [showmodal, setshowmodal] = useState();
const [values,setvalues]=useState({key:'',value:''});
const [inputfield,setinputfield]=useState('');

const [roll,setroll]=useState(null);

const [serverres,setserverres]=useState();


    const updateres = (key, value) => {
        setshowmodal(true);
        setvalues({key,value})
        setinputfield(''); 
    


    }

    const handleCloseModal = () => {
        setshowmodal(false);
        // Add any additional logic you need here
        setserverres('');
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();



    const submitdata=()=>{
        
        let updatedresult={
            resultgpa:inputfield,
            key:values.key,
            rollnumber:roll
        

        }

        console.log("the updated data is",updatedresult);
        axios.post(`${API_URL}/StudentApi/postupdatedone`, updatedresult)
        .then(result => {
            console.log("came back from server");
            console.log(result.data.message);
            setserverres(result.data.message);
            onSubmit(updatedresult)
            

        })
        .catch(err => {
            console.log("error at front end" + err.message);

        })

    }




    const onSubmit = (data) => {

        console.log("API_UR: ", API_URL)
        console.log('Submited data is : ', data);
        setroll(data.rollnumber);
        axios.post(`${API_URL}/StudentApi/get`, data)// this will send /post this data to the server and then backend to check for the particular rollnumber
            .then(result => {
                console.log("hii data received") // if the apis sends correcr responds then  the data from database is sent to the results 
                console.log("the data received", result.data);
                setValue("rollnumber", "");
               

                {
                    setstudentdata(result.data)

                }// this data is came from the backebd that is from studentapi/get;

            })
            .catch(err => {
                console.log("error at front end" + err.message);

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

            <Modal show={showmodal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Update result</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                         <input type="number" name="" id="" placeholder={values.key} onChange={(e)=>setinputfield(e.target.value)}/>           
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={()=>submitdata(values.key,inputfield)}>
                                submit
                            </Button>
                            
                        </Modal.Footer>
                        <p className='text-success text-center'>{serverres}</p>
                    </Modal>



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



                                        <td className='table-cell'>
                                            {value}
                                            {key !== 'AdmnNo' && key !== 'Name' && (
                                                <button className='btnn d-block m-auto' onClick={()=>updateres(key,value)}>Update</button>
                                            )}
                                        </td>






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