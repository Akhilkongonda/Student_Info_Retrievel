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

    <div>
       <div className='container-'>
        <h3 className='top-text'>MLR Institute of Technology
(Autonomous)
</h3>
       </div>
  
<div className="row">
  <div className="col col-sm-6 bgimg">


  </div>

  <div className="col col-sm-6">
  
    <div className='cardd card-body'>
      <h4 className='mt-4 mb-4'>Signup</h4>
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
          <button className='btnn' type="submit">Signup</button>
        </div>
        
      </form>
      <p className="signup-text">Already have a account? <Link to="/">Login</Link></p>
      
    </div>
  </div>
</div>
    
 
    </div>
  );
}

export default Signup;
