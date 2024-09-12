import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NavLink} from 'react-router-dom';
import { useForm } from 'react-hook-form';


export default function Addadmin() {

  const API_URL = process.env.REACT_APP_API_URL

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
      } = useForm();
    const navigate=useNavigate();

    const [accountcreated,setaccountcreated]=useState();

    const onSubmit = async (data) => {
        console.log("the registered data is",data.username);
       
      
        axios.post(`${API_URL}/StudentApi/addnewfaculty`,data)
        .then(async (result)=>{
          // for sending mail to particular registered mail
          console.log( "the result came from server of adding new faculty",result)


          if(result.data==="accountexisted" && result.status===200){
            setaccountcreated("already existed choose another mail");
          }
          else if (result.status===200 && result.data==='Data inserted successfully')
          {
            const response=await axios.post(`${API_URL}/StudentApi/sendemail`,data)
          console.log('response after sending mail',response.data)
          reset();
          setaccountcreated("regestered successfully!");

          }
         

          
         
        })
        .catch(err=>{
          console.log("error at front end"+err.message);
        })
      
        
    } ;




    const handleLogout = () => {
        // Clear localStorage
        alert(" click ok ! to logOut successfully")
        localStorage.clear();
    
    
        // Redirect to the login page
        navigate('/');
      };



    useEffect(() => {

        //verify token and get details
        const token = localStorage.getItem('token');
        console.log('token fetched in facultydashboard :', token)
        axios
          .post(`${API_URL}/verifylogintoken`, { token })
          .then((res) => {

            console.log(res.data)
            if (res.data.message === "tokennotvalid" || res.data.role!=='Admin') {
              alert("please login first")
              localStorage.clear();
    
              navigate('/');
    
            }

          })
          .catch((err) => { console.log("Error in token Verification ", err) });
      })


  return (
    <div>
       

        
        <div className='cardd card-body'>

<h4>AddFaculty</h4>
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
    <button className='btnn' type="submit">AddFaculty</button>
    {
      <p>{accountcreated}</p>
    }
    
  </div>

  <button className='btnn'>

<NavLink to="/" className="nav-link"  activeClassName="active" onClick={handleLogout}>
  LogOut
</NavLink>

        </button>

</form>

</div>




       
            </div>
  )
}
