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

  const Navigate = useNavigate();
  const [text, settext] = useState(null);

  const onSubmit = (data) => {
    console.log(data);
    const generatedotp = Math.floor(1000 + Math.random() * 9000);
    console.log('Generated OTP:',generatedotp);

    axios.post('https://mlrit.onrender.com/StudentApi/verifycrdns', data)
      .then( async result => { 
        console.log(result);

        if (result.status === 200) {
          // Move the navigation logic here
          console.log("the token from backend is",result.data.token);
          localStorage.setItem('token', result.data.token); 
          const response=await axios.post("https://mlrit.onrender.com/StudentApi/sendemailforlogin",{...data,otp: generatedotp,})
          console.log('response after sending mail',response.data)

          Navigate('/FacultyDashboard');
          
        } else {
          settext("Invalid credentials");

         

        }
      })
      .catch(err => {
        
        settext("Invalid credentials");
        

      });
    reset();
  };



  return (
    <div className='container-fluid' >
      <div className='container-' >
        <h3 className='top-text'>MLR Institute of Technology
          (Autonomous)
        </h3>
      </div>

      <div className="row">




        <div className="col col-md-6 col-sm-12" >
          <div className=' login'>




            <div className='cardd card-body'>

              <h4>Login</h4>
              <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">

                  <input type="email" name="email" id="email" placeholder='usermail'
                    {...register("username", { required: "Username is required", minLength: 3 })} />
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
                  <button className='btnn' type="submit">Login</button>
                </div>
              </form>
              {text && <p className="text-danger">{text}</p>}

              <p className="signup-text">Want to add new Faculty? <Link to="/signup">Sign up</Link></p>
            </div>
          </div>

        </div>
        <div className="col col-md-6 col-sm-12 bgimg">


        </div>


      </div>

    </div>

  );
}

export default Login