var mongoose = require('../models/bdd');

// Creation of a new schema for our cities
var userSchema = mongoose.Schema({
  username: String,
  email:String,
  password:String,
});

// Creation of a new model for our cities
var userModel = mongoose.model('users', userSchema);

module.exports = userModel;