const mysql=require('mysql');

//connecting to data base
const connection =mysql.createConnection({
    host:'sql12.freemysqlhosting.net',//sql12.freemysqlhosting.net
    user:'sql12678347', //
    password:'G9k6eKk9Wb',///'G9k6eKk9Wb'
    database:'sql12678347' //'sql12678347'
});
//checking if connection is succesful or not
connection.connect((error)=>{
    if(error){
        console.log('error in db',error);
    }
    else{
        console.log('db connection succesful');
    }
    
})

module.exports=connection; 


