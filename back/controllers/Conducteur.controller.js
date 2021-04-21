const Conducteur = require('../models/Conducteur.model');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation');
var {ErrorHandler} = require('../Middleware/ErrorHandler')
const nodemailer = require('nodemailer')
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { response } = require('express');
const SmsTransceiver = require('node-sms-transceiver');
const smstransceiver = new SmsTransceiver('/dev/ttyMODEM0');

// Register
let RegisterConducteur = function (req, res, next) {
    const { matricule,firstName,lastName, email, password, confirmerPassword,adress,phone,license_number} = req.body
   // LETS VALIDATE THE DATA BEFORE WE ADD A SELLER
  const { error } = validation.registerValidation({firstName,lastName,email,password,confirmerPassword});
  if (error){
    let err = new ErrorHandler('signin error', 400, 'invalid_field', {
        errors: error.details[0].message
      })
    return next(err)
  } 
  
  
  var newConducteur = new Conducteur({
    matricule,
    firstName,
    lastName,
    password,
    email,
    phone,
    adress,
    license_number

  });

   // save new Conducteur

    crypto.randomBytes(32,async (err,buffer)=>{
     
      if(err){
          console.log(err)
      }
       token = buffer.toString("hex")
       
       console.log(token);
     
   
   
      newConducteur.resetToken = token

      Conducteur.getConducteurByEmail(email, function (error, seller) {
        if (error) return next(err)
        if (seller) {
          let err = new ErrorHandler('signin error', 409, 'invalid_field', {
            message: "conducteur is existed"
          })
          return next(err)
        }


         Conducteur.createConducteur(newConducteur, function (err, conducteur) {
          if (err) return next(err);
          ///
          let transporter =  nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.USER,
             pass: process.env.PASS
            },
          })

          let info =  transporter.sendMail({
            from: 'salaheddineezzahi5@gmail.com', // sender address
            to: email, // list of receivers
            subject: "new password ✔", // Subject line
            html :
         `<div> thank you mr <b> ${firstName + ' ' + lastName + ' '}</b> <br> your welcome in this site <br <br> 
          <a href=http://127.0.0.1:5500/src/view/verify.html?token=${token} > Confirmer </a> </div>`
              // html body
          });


            ////
        res.json({ message: 'conducteur created', conducteur : conducteur })
         });
      })
    })
 


   
  }


  //Login 
  let LoginConducteur = function (req, res, next) {
    const { email, password } = req.body
    if (!email || !password) {
      let err = new ErrorHandler('login error', 400, 'missing_field', { message: "missing username or password" })
      return next(err)
    }
    Conducteur.getConducteurByEmailAndStatus(email, function (err, conducteur) {
      if (err) return next(err)

      if (!conducteur) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      Conducteur.comparePasswordConducteur(password, conducteur.password, function (err, isMatch) {
        if (err) return next(err)
        
        if (isMatch) {
          let token = jwt.sign(
            { conducteur: conducteur },
            process.env.TOKEN_SECRET,
            { expiresIn: '7d' }
          )
          res.status(201).header('auth-token',token).json({
            conducteur_token: {
                conducteur_id: conducteur.id,
                conducteur_name: conducteur.firstName + ' ' + conducteur.lastName,
              token: token,
              expire_in: '7d'
            }
          })
        } else {
          let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
          return next(err)
        }
      })
    })
  }


  /// getAllConducteur ///

  let getAllConducteur = async(req,res,next)=>{
      await Conducteur.getAllConducteur(function (err,conducteurs) {
          if(err) return next(err) 
          if(conducteurs){
              res.json({conducteurs:conducteurs});
          }
      })
  }


  /// getConducteur ///
  let getConducteur = async(req,res,next)=>{
      let id=req.params.id;
    await Conducteur.getConducteurById(id,function (err,conducteur) {
        if(err) return next(err) 
        if(conducteur){
            res.json({conducteur:conducteur});
        }
    })
}


/// update Conducteur ///
let updateConducteur = async(req,res,next)=>{
  let id=req.params.id;
  let numberPoints = req.body.numberPoints;
  let Reason = req.body.Reason;

await Conducteur.findOneAndUpdate({_id:id},{numberPoints:numberPoints},function (err,conducteur) {
   if(err) return next(err)
   if(conducteur){
  let transporter =  nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.USER,
       pass: process.env.PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    })

  let info =  transporter.sendMail({
      from: 'se.ezzahi@gmail.com', // sender address
      to: conducteur.email, // list of receivers 
      subject: "new update :heavy_check_mark:", // Subject line
      html :
        `<div>Hello mr <b> ${conducteur.firstName + ' ' + conducteur.lastName + ' '}</b> <br> your welcome your compte modify number Points  <br <br> 
        numberPoints =  <b style="color:green"> ${numberPoints}</b></div>
        <div> Reason : <b style="color:red"> ${Reason}  </b> </div>`
    });
    res.json(conducteur);
  }
})
}

  //Verify Password 

 let verifyConducteur = async (req, res,next) => {
    const sentToken = req.body.token
    console.log("sentToken");
    console.log(sentToken);
    Conducteur.findOne({resetToken:sentToken})
    .then(conducteur=>{
        console.log(conducteur);
        if(!conducteur){
            let err = new ErrorHandler('verify passsword ', 403, 'invalid_field', { message: " Not find conducteur" })
        return next(err)
        }
      
                conducteur.status='confirmer'
                conducteur.resetToken = undefined;
                conducteur.expireToken = undefined;
                conducteur.save().then((saveConducteur)=>{
                    res.json({message:"confirmer success",saveConducteur:saveConducteur})
                });
           
    }).catch(err=>{
        console.log(err)
        return next(err)
    })
}
  module.exports = {
      RegisterConducteur,LoginConducteur,verifyConducteur,getAllConducteur,getConducteur,updateConducteur
  }