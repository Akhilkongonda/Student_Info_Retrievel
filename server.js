const dotenv=require('dotenv').config();
const exp=require('express');
const app=exp();
const bodyParser=require('body-parser');
const cors=require('cors');

PORT = process.env.PORT || 3000

//run server
app.listen(PORT,()=>{
    console.log(`server is running in the  port ${PORT}`)
})


// stock overflow middleware
const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Add the necessary methods
    optionSuccessStatus: 200
};




// middlewares
app.use(exp.json());
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended:true}))




// //apis

const studentdata = require('./Apis/StudentApi')
app.use('/StudentApi',studentdata);  //here this the frontend serach for the correct path so here it matches to /StudentApi which is in frontend; and moves to the studentdata that is astudentapi.js 

const jwt=require('jsonwebtoken');
 
app.post('/verifylogintoken',async(req,res)=>{
    console.log('token :', req.body);
    const token = req.body.token;
    const decodedToken = jwt.decode(token, { complete: true });
    console.log('Decoded Token:', decodedToken);

    const userloged=decodedToken?.payload["mail"];
    const role=decodedToken?.payload['role'];

    console.log(userloged);

    try{
        let userdata=jwt.verify(token,'abcdefg');
        console.log('tokenn valid')
        res.send({message:"tokenvalid",role:role,userinfo:userloged})

    }
    catch(err){
        console.log("token invalid");
        res.send({message:"tokennotvalid"});
    }
})





//error handling middle ware
const errHandlingMiddleware=(err,req,res,next)=>{
    console.log("error in the server",err);
    res.status(201).send({message:err});
}
app.use(errHandlingMiddleware);


//Build Web Packserver
const path = require('path');
app.use(exp.static(path.join(__dirname, './build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "./build/index.html"));
});


// invalid path middleware
const invalidPathMiddleWare = (req, res)=>{
    console.log('Invalid Path:');
    res.status(404).json({message:'Invalid Path'});
}
app.use('*',invalidPathMiddleWare)

