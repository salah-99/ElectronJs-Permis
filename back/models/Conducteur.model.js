const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt= require('bcrypt');
const SchemaConducteur = new schema(
    {
      matricule:{
        type:String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName:{
        type: String,
        required: true,
        trim: true,
      },
      email:{
          type:String,
          email:true,
          require:true
      },
    password: {
        type: String
    },
      phone:{
        type:String,
      require:true
      },
      adress:{
      type:String 
      },
      status:{
        type:String,
        default:'attendre' 
        },
      license_number:{
        type:String,
      },
      numberPoints:{
        type:Number,
        default:30
      },
      resetToken:{
          type: String
      },
      expireToken:{
          type:Date,
          default: Date.now
      }
      
    },
    {
      versionKey: false
  }
  );
  
 
  
  var Conducteur =module.exports =  mongoose.model("Conducteur", SchemaConducteur);
module.exports.createConducteur = function (newConducteur, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newConducteur.password, salt, function (err, hash) {
          newConducteur.password = hash;
          newConducteur.save(callback);
        });
    });
}

module.exports.getConducteurByEmail = function (email, callback) {
    var query = { email: email };
    Conducteur.findOne(query, callback);
}


module.exports.getConducteurByEmailAndStatus = function (email, callback) {
  var query = { email: email,status:'confirmer'};
  Conducteur.findOne(query, callback);
}

module.exports.getConducteurById = function (id, callback) {
    Conducteur.findById(id, callback);
}
module.exports.comparePasswordConducteur = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.getAllConducteur = function (callback) {
    Conducteur.find(callback)
}