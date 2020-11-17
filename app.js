const express = require("express");
const cors = require("cors");
const { restart } = require("nodemon");
const createError = require('http-errors');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


//initialize database
require('./helpers/initDB');

const productRoute = require('./Routes/productRoute');
const authRoute = require('./Routes/authRoute');
const { verifyAccessToken,signRefreshToken } = require('./helpers/jwtHelper');
require('./helpers/initRedis');

app.use(morgan('dev'));

app.get('/', verifyAccessToken, async(req,res,next)=>{
    res.send('hello from express')
});

app.all('/test',(req,res,next)=>{
    //console.log(req.query);
    //console.log(req.query.name);
    //res.send(req.query);
    //console.log(req.params);
    //res.send(req.params);
    console.log(req.body);
    res.send(req.body);
});

app.use('/auth',authRoute);
app.use('/products',productRoute);

app.use((req,res,next)=>{
    // const err = new Error("Not Found");
    // err.status = 404;
    next(createError(404,'Not Found'));

});

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.send({
        error:{
        status: err.status || 500,
        message: err.message
    }});
});

const PORT = process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log("server started on "+ PORT +"...");
})
