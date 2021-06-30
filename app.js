const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init.mongodb')
const {verifyAccessToken} = require('./helpers/jwt_helper')
const AuthRoute = require('./Routes/Auth.route');



const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', verifyAccessToken, async(req,res,next)=>{
   
    res.send('Hello from Express...')
})


app.use('/auth',AuthRoute);

app.use((req,res,next) =>{
    next(createError(404,'Not found')); 
});
app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.send({
        error:{
            status:err.status || 500,
            message:err.message
        }
    });
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () =>{
    console.log(`server running on port ${PORT}` )
})