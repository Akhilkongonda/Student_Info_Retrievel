const exp = require('express');
const studentdata = exp.Router();
const connection = require('./db');
const cors = require('cors');
const csvParser = require('csv-parser');
const { Readable } = require('stream');
const sendEmailFunction = require('./utils/sendEmail');//  importing sendemail
const dotenv=require('dotenv').config();


studentdata.use(exp.json());
studentdata.use(cors());

studentdata.post('/get', async (req, res) => {
  try {
    let data = req.body;
    console.log("Received roll number:", data.rollnumber);

    const query = 'SELECT * FROM csit_2020 WHERE AdmnNo LIKE ?;';

    connection.query(query, [`%${data.rollnumber}%`], (error, results) => {
      if (error) {
        console.error('Error fetching data from database:', error);
        res.status(500).json({ message: 'Database Error', error: error.message });
      } else {
        if (results && results.length > 0) {
          console.log("Result:", results);
          res.status(200).send({ payload: results });
        } else {
          console.log("No results found for the provided roll number.");
          res.status(200).send({ payload: [] });
        }
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});








studentdata.post('/post', async (req, res) => {
  try {
    console.log("Hello received server");
    const content = req.body;
    console.log(content[0]);

    if (!Array.isArray(content) || content.length < 2 || !Array.isArray(content[1])) {
      console.error('Invalid file format.');
      return res.status(400).send("Wrong file format. Please check the uploaded file format. And verify column names");
    }

    const insertQuery = `
  INSERT INTO csit_2020 (
    AdmnNo, Name, \`SEM1-1GPA\`, \`SEM1-1Backlogs\`, \`SEM1-2GPA\`, \`SEM1-2Backlogs\`,
    \`SEM2-1GPA\`, \`SEM2-1Backlogs\`, \`SEM2-2GPA\`, \`SEM2-2Backlogs\`, \`SEM3-1GPA\`,
    \`SEM3-1Backlogs\`, \`SEM3-2GPA\`, \`SEM3-2Backlogs\`, \`SEM4-1GPA\`, \`SEM4-1Backlogs\`,
    \`SEM4-2GPA\`, \`SEM4-2Backlogs\`, AluminiGPA, \`AluminiBacklogs\`, \`FinalCGPA\`,
    \`TotalCredits\`, \`TotalBacklogs\`
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

    

    // Use Promise.all to wait for all queries to complete before sending the response
    const insertionPromises = content.slice(1).map(async (row) => {
      return new Promise((resolve, reject) => {
        connection.query(insertQuery, row, (error, results) => {
          if (error) {
            console.error('Error inserting data into MySQL:', error);
            reject(error);
          } else {
            console.log('Data inserted into MySQL successfully');
            resolve(results);
         
          }
        });
      });
    }); 

    // Wait for all promises to resolve before sending the response
    await Promise.all(insertionPromises);

    res.status(201).send("Data uploaded successfully");
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


///////////////////////////////
//logging and checking otp as admin to add new faculty credientails

studentdata.post('/postcrdns', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const mail = data.username;

    const password = data.password;

    const accountcheck= 'SELECT * FROM admins_data WHERE mail = ? AND password = ?';


    connection.query(accountcheck,[mail,password],(err,result)=>{

      if (err) {
        console.error('Error executing query:',err);
        res.status(500).send('Internal Server Error');
        return;
      }


      if (result.length > 0) {
        console.log("already you have an account with this mail")
        res.send("accountexisted");

      }
      else{
        console.log("acount not existed")
        res.send("accountnotexisted")
      }
     

    })

} catch (err) {
    console.error('Error from postcred', err);
    res.status(500).send('Internal Server Error');
  }
 
});






studentdata.post('/addnewfaculty', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const mail = data.username;

    const password = data.password;

    const accountcheck= 'SELECT * FROM admins_data WHERE mail = ? AND password = ?';
    
    connection.query(accountcheck,[mail,password],(err,result)=>{

      if (err) {
        console.error('Error executing query:',err);
        res.status(500).send('Internal Server Error');
        return;
      }


      if (result.length > 0) {
        console.log("already you have an account with this mail")
        res.send("accountexisted");
        return;

      }
      
        
    const query = 'INSERT INTO admins_data (mail, password) VALUES (?, ?)';
    console.log("Signup ! :",{mail,password})
    connection.query(query, [mail, password], (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Internal Server Error');
        return;
      }


      console.log('Query result:', result);

      res.status(200).send('Data inserted successfully');
    });


      
     

    })

  } catch (err) {
    console.error('Error from postcred', err);
    res.status(500).send('Internal Server Error');
  }
 
});





const jwt=require('jsonwebtoken');






//verify credientials
studentdata.post('/verifycrdns', async (req, res) => {
  try {
    const data = req.body;
    const mail = data.username;
    const password = data.password;
    const query = 'SELECT * FROM admins_data WHERE mail = ? AND password = ?';

    let role='Faculty'
    if(data.role!=null){
      role=data.role
    }
    connection.query(query, [mail, password], (err, result) => {
  

      if (err) {
        console.error('Error executing query:',err);
        res.status(500).send('Internal Server Error');
        return;
      }

      if (result.length > 0) {
        // Matching credentials found
        let jwttoken=jwt.sign({mail:mail,role:role},'abcdefg',{expiresIn:"2h"});
        console.log("Logged in : " ,jwttoken ,'\n user :' ,mail);
        return res.status(200).json({ message: 'Logged in' ,token:jwttoken});
      } else {
        // No matching credentials found
        res.status(401).send('Invalid credentials');
      }
    })}
    catch(err){
      console.error('Error from verifycrdns', err);
      res.status(500).send('Internal Server Error');
    }
  });


  //get to present
  studentdata.post('/gettorepresent',async(req,res)=>{
    try {
      let data = req.body;
      console.log("Received roll number:", data.rollnumber);
  
      const query = 'SELECT * FROM csit_2020 WHERE AdmnNo LIKE ?;';
  
      connection.query(query, [`%${data.rollnumber}%`], (error, results) => {
        if (error) {
          console.error('Error fetching data from database:', error);
          res.status(500).json({ message: 'Database Error', error: error.message });
        } else {
          if (results && results.length > 0) {
            console.log("Result:", results);
            res.status(200).send({ payload: results });
          } else {
            
            res.status(200).send( "no result found for provided roll number" );
          }
        }
      });
  
    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  })
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  //post updatedresultone 

  studentdata.post('/postupdatedone',async(req,res)=>{
    try{
      let data=req.body;
      console.log(data);
      const query = `UPDATE csit_2020 SET \`${data.key}\`= ? WHERE AdmnNo = ?`;
      connection.query(query,[data.resultgpa,data.rollnumber],(err,result)=>{
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send({ success: false, message: 'Internal server error' });
          return;
        }
  
        console.log('Query result:', result);
        res.status(200).send({ success: true, message: ' Updated successfully' });
      })
 
    }
    catch(err){

      console.error("Error:", err);
      res.status(500).send({ success: false, message: 'Internal server error' });
    }
  })



  //for sending emails
  const asyncHandler = require('express-async-handler')
  studentdata.post("/sendemail",asyncHandler(async(req,res)=>{
    const data=req.body;
    const email=data.username
    const password=data.password
    const otp=data.otp
    console.log("the email came into server ",data)
    try{
      const send_to=email;
      const sent_from=process.env.EMAIL_USER;
      // console.log("Sent_from",process.env.EMAIL_USER)
      const reply_to=email;
      const subject="Thankyou message"
      const message = `<p>Your OTP is: ${otp}</p>
      <p>your password is:${data.password}</p>
       <p>Best regards</p>`;
      

        await sendEmailFunction(subject,message,send_to,sent_from,reply_to)
        res.status(200).json({success:true,message:"Emailsent"});
     

    }
    catch (error) {
      console.log("came into catch")
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  
  }))





  ////////////////////////sending mail for login

  
  //for sending emails for login candidates
  
  studentdata.post("/sendemailforlogin",asyncHandler(async(req,res)=>{
    const data=req.body;
    const email=data.username
    const otp=data.otp
    console.log("sent otp is",otp)
    
    console.log("the email came into server ",data)
    try{
      const send_to=email;
      const sent_from=process.env.EMAIL_USER;
      // console.log("Sent_from",process.env.EMAIL_USER)
      const reply_to=email;
      const subject="Thankyou message"
      const message=`<p>Successfully loggedIn into MLRIT Student Information System</p>
      <p>Your OTP is: ${otp}</p>`

        await sendEmailFunction(subject,message,send_to,sent_from,reply_to)
        res.status(200).json({success:true,message:"Emailsent"});
     

    }
    catch (error) {
      console.log("came into catch")
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
  
  }))


   
 
 



module.exports = studentdata;
