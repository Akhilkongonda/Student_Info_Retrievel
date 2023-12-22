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
  const [res, setres] = useState(null);
  const [text, settext] = useState(null);

  const onSubmit = (data) => {
    console.log(data);

    axios.post(' http://localhost:3500/StudentApi/verifycrdns', data)
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
      <div className='container-'>
        <h3 className='top-text'>MLR Institute of Technology
          (Autonomous)
        </h3>
      </div>

      <div className="row">



        <div className="col col-sm-6 bgimg">


        </div>

        <div className="col col-sm-6">
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
                  <button className='btn btn-primary' type="submit">Login</button>
                </div>
              </form>
              {text && <p className="text-danger">{text}</p>}

              <p className="signup-text">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </div>
          </div>

        </div>


      </div>

    </div>

  );
}

export default Login