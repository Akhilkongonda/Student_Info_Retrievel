import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'

function Login() {


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const Navigate=useNavigate();
  const [res,setres]=useState(null);
  const [text,settext]=useState(null);

  const onSubmit = (data) => {
    console.log(data);
  
    axios.post('https://student-info-retrievel.vercel.app/StudentApi/verifycrdns', data)
      .then(result => {
        setres(result.status); // use result.status instead of result.response.status
  
        if (result.status === 200) {
          // Move the navigation logic here
          Navigate('/FacultyDashboard');
        } else {
          settext("Invalid credentials");

        }
      })
      .catch(err => {
        setres(err.status); // use err.status instead of err.response.status
        settext("Invalid credentials");

      });
      reset();
  };
  


  return (
    <div>

   
    <div className=' login'>
      <div>
      <img className='m-auto img' src="https://exams.mlrinstitutions.ac.in/Images/header.png" alt="" />
      </div>
      <img src="https://smartinterviews.in/assets/images/Logging_in.gif" alt="" />
     

  
    <div className='card card-body signupcard'>
    
      <h4>Login</h4>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
         <input type="email" name="email" id="email" placeholder='usermail' 
          {...register("username", { required: "Username is required", minLength: 3 })}/>
          {errors.username && <p>{errors.username.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder='Password'
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <button className='btn btn-primary' type="submit">Login</button>
        </div>
      </form>
      {text && <p className="text-danger">{text}</p>}

      <p className="signup-text">Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
    </div>
    </div>
   
  );
}

export default Login