
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var adminSchema = mongoose.Schema({
    email: {
        type: String,
        index: true
    },
    password: {
        type: String
    }, 
     first_name: {
        type: String
    },
   last_name: {
        type: String
    },
    status: {
        type: String,
        default: 'admin'
    }
});

var Admin = module.exports = mongoose.model('admin', adminSchema);

module.exports.createAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newAdmin.password, salt, function (err, hash) {
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
}

module.exports.getAdminByEmail = function (email, callback) {
    var query = { email: email };
    Admin.findOne(query, callback);
}

module.exports.getAdminById = function (id, callback) {
    Admin.findById(id, callback);
}
module.exports.comparePassword = function (givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}

module.exports.getAllAdmins = function (callback) {
    Admin.find(callback)
}