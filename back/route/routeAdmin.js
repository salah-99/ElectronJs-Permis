const express= require('express');
const AdminController= require('../controllers/Admin.controller');
const route = express.Router();

route.post("/register",AdminController.RegisterAdmin);
route.post("/login",AdminController.LoginAdmin);


module.exports=route;