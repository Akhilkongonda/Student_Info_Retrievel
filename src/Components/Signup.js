import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import FacultyDashboard from './FacultyDashboard';

import './Signup.css';

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate=useNavigate();


  const onSubmit = (data) => {
    console.log(data);

    axios.post('http://localhost:3500/StudentApi/postcrdns',data)
    .then(result=>{
      navigate('/')

    })
    .catch(err=>{
      console.log("error at front end"+err.message);
    })

    
  };

  return (

    <div className='container-fluid signupbg'>
        <div>
        <img className='m-auto img' src="https://exams.mlrinstitutions.ac.in/Images/header.png" alt="no" />
        </div>
  


    <div className='card card-body signupcard'>
      <h4>Signup</h4>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
        <input type="email" name="email" id="email"  placeholder='usermail'
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
          <button className='btn btn-primary' type="submit">Signup</button>
        </div>
      </form>
      <p className="signup-text">Already have a account? <Link to="/">Login</Link></p>
    </div>
 
    </div>
  );
}

export default Signup;
