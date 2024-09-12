import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useState,useEffect } from 'react';


import './Signup.css';


function Signup() {

  const API_URL = process.env.REACT_APP_API_URL

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate=useNavigate();

  const [res,setres]=useState();

  const [genotp,setgenotp]=useState()

  const [usermail,setusermail]=useState()
  const [password,setpassword]=useState();
  const [otpmail,sentotpmail]=useState();

  const [otpverify,setotpverify]=useState();


//verify otp to naviget to create another user

  const [enterotp, setenterOtp] = useState('');

  const verifyotp = () => {
    // Your verification logic here
    console.log(genotp,enterotp)
   
    if(+enterotp===+genotp){
              console.log('Entered OTP verified:', enterotp);
              setotpverify("otp verified successfully")
        const data={
          username:usermail,
          password:password,
          role:'Admin'



        }

      axios.post(`${API_URL}/StudentApi/verifycrdns`,data )
      .then( async result => { 
        console.log(result);

        if (result.status === 200) {
          // Move the navigation logic here
          console.log("the token from backend is",result.data.token);
          localStorage.setItem('token', result.data.token);
          navigate('/Addadmin'); 
          reset();
      


          
        } else {
          // settext("Invalid credentials");

         

        }
      })
      .catch(err => {
        
        // settext("Invalid credentials");
        

      });



   
      
    }
    else{
      setotpverify("otp enetered invalid")

    }
   
  
    
    // Add logic to verify the entered OTP and handle accordingly
  };

 


  const onSubmit = async (data) => {
    console.log("the registered data is",data.username,data.password);

    setusermail(data.username)
    setpassword(data.password)
    
    const generatedotp = Math.floor(1000 + Math.random() * 9000);
    console.log('Generated OTP:',generatedotp);
    setgenotp(generatedotp)

   
  
    axios.post(`${API_URL}/StudentApi/postcrdns`,data)
    .then(async (result)=>{
      // for sending mail to particular registered mail
      console.log("this is from signup server side",result.data)
      if(result.data==="accountexisted")
      {
        const response=await axios.post(`${API_URL}/StudentApi/sendemail`,{...data,otp: generatedotp,})
        console.log('response after sending mail',response.data)
        setres("registered successfully");
        sentotpmail("Otp sent to mail")
        reset();
      }
      else if(result.data==="accountnotexisted"){
        sentotpmail("invalid credentials")
        reset();
      }
      
      
    })
  
    .catch(err=>{
      console.log("error at front end"+err.message);
    })
    


    
    
  };

 


  
  useEffect(() => {
    console.log(res);
  }, [res]);

  return (

    <div className='bgcolor'>
       <div className='container-'>
        <h3 className='top-text'>MLR Institute of Technology
(Autonomous)
</h3>
       </div>
  
<div className="row">
  

  <div className="col col-sm-6">
  
    <div className='cardd card-body'>
      <h4 className='mt-4 mb-4'>AdminLogin</h4>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
       
        <input type="email" name="email" id="email"  placeholder='usermail'
        {...register("username", { required: "Username is required", minLength: 3 })}/>
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div className="form-group">
        
          <input
            type="password"
            placeholder='Password'
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <button className='btnn' type="submit">SendOtp</button>

        </div>
        {
          <p>{otpmail}</p>
        }



              {/* otp  */}
        <div className="form-group">
        <input
          type="password"
          placeholder="Enter OTP"
          value={enterotp}
          onChange={(e) => setenterOtp(e.target.value)}
        />
        {/* Display error message if needed */}
        {/* {errors.password && <p>{errors.password.message}</p>} */}
      </div>

      <div className="form-group">
        <button className="btnn" type="button" onClick={verifyotp}>
          Verify
        </button>

        {
        <p>{otpverify}</p>
      }
       
      </div>
     
        
      </form>
      {/* <p className="signup-text">Already have a account? <Link to="/">Login</Link></p>
      {
          <p className='text-danger'>{res}</p>
        } */}
      
    </div>
    
  </div>
  <div className="col col-sm-6 bgimg">


  </div>
</div>
    
 
    </div>
  );
}

export default Signup;
