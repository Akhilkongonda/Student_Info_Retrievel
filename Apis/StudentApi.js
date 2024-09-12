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

//post 


studentdata.post('/get', async (req, res) => {
  try {
    let data = req.body;
    console.log("Received roll number:", data.rollnumber);

    // Adjusted query to use parameterized queries properly
    const query = 'SELECT * FROM csit_2020 WHERE "admnno" ILIKE $1;'; // ILIKE for case-insensitive search

    // Execute the query
    const result = await connection.query(query, [`%${data.rollnumber}%`]);

    if (result.rows.length > 0) {
      console.log("Result:", result.rows);
      res.status(200).send({ payload: result.rows });
    } else {
      console.log("No results found for the provided roll number.");
      res.status(200).send({ payload: [] });
    }
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

    // Prepare the insert query with parameter placeholders
    const insertQuery = `
    INSERT INTO csit_2020 (
      "admnno", "name", "sem1-1gpa", "sem1-1backlogs", "sem1-2gpa", "sem1-2backlogs",
      "sem2-1gpa", "sem2-1backlogs", "sem2-2gpa", "sem2-2backlogs", "sem3-1gpa",
      "sem3-1backlogs", "sem3-2gpa", "sem3-2backlogs", "sem4-1gpa", "sem4-1backlogs",
      "sem4-2gpa", "sem4-2backlogs", "aluminigpa", "aluminibacklogs", "finalcgpa",
      "totalcredits", "totalbacklogs"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22,$23)
  `;
  

    // Use Promise.all to wait for all queries to complete before sending the response
    const insertionPromises = content.slice(1).map((row) => {
      return connection.query(insertQuery, row);
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

    const accountcheck = 'SELECT * FROM admins_data WHERE mail = $1 AND password = $2';

    // Use Promises with async/await for better readability
    const { rows } = await connection.query(accountcheck, [mail, password]);

    if (rows.length > 0) {
      console.log("Account already exists with this mail");
      res.status(200).send("accountexisted");
    } else {
      console.log("Account does not exist");
      res.status(200).send("accountnotexisted");
    }

  } catch (err) {
    console.error('Error from postcrdns:', err);
    res.status(500).send('Internal Server Error');
  }
});







studentdata.post('/addnewfaculty', async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const mail = data.username;
    const password = data.password;

    // Query to check if an account already exists with the given email and password
    const accountcheck = 'SELECT * FROM admins_data WHERE mail = $1 AND password = $2';

    // Execute the query to check for existing account
    const { rows } = await connection.query(accountcheck, [mail, password]);

    if (rows.length > 0) {
      // If an account with the given email and password already exists
      console.log("Account already exists with this mail");
      return res.status(400).send("accountexisted"); // Send a 400 Bad Request status
    }

    // Query to insert a new faculty account
    const query = 'INSERT INTO admins_data (mail, password) VALUES ($1, $2)';
    console.log("Signup attempt:", { mail, password });

    // Execute the query to insert the new account
    await connection.query(query, [mail, password]);

    console.log('Account created successfully');
    res.status(201).send('Data inserted successfully'); // Send a 201 Created status

  } catch (err) {
    console.error('Error from /addnewfaculty:', err);
    res.status(500).send('Internal Server Error'); // Send a 500 Internal Server Error status
  }
});








const jwt=require('jsonwebtoken');




// Verify credentials
studentdata.post('/verifycrdns', async (req, res) => {
  try {
    const data = req.body;
    const mail = data.username;
    const password = data.password;
    const query = 'SELECT * FROM admins_data WHERE mail = $1 AND password = $2';

    // Default role is 'Faculty'; it can be overridden if provided in the request
    let role = data.role || 'Faculty';

    // Execute the query to check for matching credentials
    const result = await connection.query(query, [mail, password]);

    if (result.rows.length > 0) {
      // Matching credentials found
      const jwttoken = jwt.sign({ mail: mail, role: role }, 'abcdefg', { expiresIn: '2h' });
      console.log("Logged in: ", jwttoken, '\nUser:', mail);
      return res.status(200).json({ message: 'Logged in', token: jwttoken });
    } else {
      // No matching credentials found
      return res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    console.error('Error from /verifycrdns:', err);
    return res.status(500).send('Internal Server Error');
  }
});


// Get data based on roll number 
studentdata.post('/gettorepresent', async (req, res) => {
  try {
    let data = req.body;
    console.log("Received roll number:", data.rollnumber);

    // Use parameterized query for safe SQL execution
    const query = 'SELECT * FROM csit_2020 WHERE admnno ILIKE $1;'; // 'ILIKE' is used for case-insensitive search in PostgreSQL

    // Execute the query
    const result = await connection.query(query, [`%${data.rollnumber}%`]);

    if (result.rows.length > 0) {
      console.log("Result:", result.rows);
      res.status(200).json({ payload: result.rows });
    } else {
      res.status(200).send("No result found for the provided roll number.");
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});



  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Post updated result
studentdata.post('/postupdatedone', async (req, res) => {
  try {
    let data = req.body;
    console.log(data);

    // Construct query with dynamic column name
    const query = `UPDATE csit_2020 SET "${data.key}" = $1 WHERE admnno = $2`;

    // Execute the query with parameterized inputs
    const result = await connection.query(query, [data.resultgpa, data.rollnumber]);

    console.log('Query result:', result);

    res.status(200).send({ success: true, message: 'Updated successfully' });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ success: false, message: 'Internal server error' });
  }
});




  //for sending emails
  const asyncHandler = require('express-async-handler')

  
// Route for sending emails
studentdata.post("/sendemail", asyncHandler(async (req, res) => {
  const data = req.body;
  const email = data.username;
  const password = data.password;
  const otp = data.otp;

  console.log("Received email data:", data);

  try {
    const sendTo = email;
    const sentFrom = process.env.EMAIL_USER;
    const replyTo = email;
    const subject = "Thank you for your request";
    const message = `
      <p>Your OTP is: ${otp}</p>
      <p>Your password is: ${password}</p>
      <p>Best regards</p>
    `;

    await sendEmailFunction(subject, message, sendTo, sentFrom, replyTo);
    res.status(200).json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}));





  ////////////////////////sending mail for login


 // Route for sending login email with OTP
studentdata.post("/sendemailforlogin", asyncHandler(async (req, res) => {
  const data = req.body;
  const email = data.username;
  const otp = data.otp;

  console.log("Sent OTP is:", otp);
  console.log("Received email data:", data);

  try {
    const sendTo = email;
    const sentFrom = process.env.EMAIL_USER;
    const replyTo = email;
    const subject = "Login Notification";
    const message = `
      <p>Successfully logged in to the MLRIT Student Information System</p>
      <p>Your OTP is: ${otp}</p>
    `;

    await sendEmailFunction(subject, message, sendTo, sentFrom, replyTo);
    res.status(200).json({ success: true, message: "Email sent successfully" });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}));


module.exports = studentdata;
