const express= require('express');
const ConducteurController= require('../controllers/Conducteur.controller');
const fs = require('fs');
const path = require('path');

const route = express.Router();
route.post("/register",ConducteurController.RegisterConducteur);
route.post("/login",ConducteurController.LoginConducteur);
route.get('/Conducteurs',ConducteurController.getAllConducteur);
route.get("/findConducteur/:id",ConducteurController.getConducteur);
route.post("/confirmer",ConducteurController.verifyConducteur)
route.put("/updateConducteur/:id",ConducteurController.updateConducteur);
module.exports=route;