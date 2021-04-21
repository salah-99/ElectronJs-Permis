const Admin = require('../models/Admin.module');
const jwt = require('jsonwebtoken');
var validation = require('./ValidateSchema/validation');
var {ErrorHandler} = require('../Middleware/ErrorHandler')
const nodemailer = require('nodemailer')

// Register
let RegisterAdmin = function (req, res, next) {
    const {firstName,lastName, email, password, verifyPassword} = req.body
   // LETS VALIDATE THE DATA BEFORE WE ADD A SELLER
  const { error } = validation.registerValidation(req.body);
  if (error){
    let err = new ErrorHandler('signin error', 400, 'invalid_field', {
        errors: error.details[0].message
      })
    return next(err)
  } 
  
  
  var  newAdmin= new Admin({
   firstName,
    lastName,
    password,
    email

  });

   // save new Admin

   
      Admin.getAdminByEmail(email, function (error, admin) {
        if (error) return next(err)
        if (admin) {
          let err = new ErrorHandler('signin error', 409, 'invalid_field', {
            message: "compte is existed"
          })
          return next(err)
        }
         admin.createAdmin(newAdmin, function (err, adminC) {
          if (err) return next(err);
        res.json({ message: 'admin created', admin : adminC })
         });

    })
  }


  //Login 
  let LoginAdmin = function (req, res, next) {
    const { email, password } = req.body
    if (!email || !password) {
      let err = new ErrorHandler('login error', 400, 'missing_field', { message: "missing username or password" })
      return next(err)
    }
    Admin.getAdminByEmail(email, function (err, admin) {
      if (err) return next(err)
      if (!admin) {
        let err = new ErrorHandler('login error', 403, 'invalid_field', { message: "Incorrect email or password" })
        return next(err)
      }
      Admin.comparePassword(password, admin.password, function (err, isMatch) {
        if (err) return next(err)
        if (isMatch) {
          let token = jwt.sign(
            { admin: admin },
            process.env.TOKEN_SECRET_ADMIN,
            { expiresIn: '7d' }
          )
          res.status(201).header('auth-token-admin',token).json({
            admin_token: {
                admin_id: admin._id,
                conducteur_name: admin.firstName + ' ' + admin.lastName,
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



  module.exports = {
      RegisterAdmin,LoginAdmin
  }