const express= require('express');
const mongoose = require("./database/config");
const bodyParser= require('body-parser');
const fs = require('fs');
const multer = require('multer');
var path = require('path')
const app= express();
var morgan = require('morgan');

//router
let RouteConducteur = require('./route/routeConducteur');
let RouteAdmin = require('./route/routeAdmin');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, OPTION");
    next();
    });
app.use("/api/",RouteConducteur);
app.use("/api/admin/",RouteAdmin);


app.use((req,res,next)=>{
    res.status(404).send('Sorry Dont find this route');
    
});

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500).json(err);
  });


const PORT = process.env.PORT || 4000;
app.listen(PORT,()=>{
    console.log(`Server listen this Port ${PORT}`);
});

