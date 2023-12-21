const exp=require('express');
const app=exp();
const bodyParser=require('body-parser');
const cors=require('cors');
//run server
app.listen(3500,()=>{
    console.log('server is running in the  port 3500')
})

// stock overflow middleware
const corsOptions = {
    origin: 'https://student-info-retrievel.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Add the necessary methods
    optionSuccessStatus: 200
};




// middlewares
app.use(exp.json());
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({extended:true}))




// //apis

const studentdata = require('./StudentApi')
app.use('/StudentApi',studentdata);  //here this the frontend serach for the correct path so here it matches to /StudentApi which is in frontend; and moves to the studentdata that is astudentapi.js 
















//error handling middle ware
const errHandlingMiddleware=(err,req,res,next)=>{
    console.log("error in the server",err);
    res.status(201).send({message:err});
}
app.use(errHandlingMiddleware);
//invalid path middleware
const invalidPathMiddleWare = (req, res)=>{
    console.log('Invalid Path:');
    res.status(404).json({message:'Invalid Path'});
}
app.use('*',invalidPathMiddleWare)

