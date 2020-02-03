var express = require('express');
var router = express.Router();
let request = require("async-request");
var userModel = require('../models/user')

/* Post sign-up. */
router.post('/sign-up', async function(req, res, next) {

  // We save our front input result in our backend 
  var usernameFromFront = req.body.username  ;
  var emailFromFront = req.body.email ;
  var passwordFromFront = req.body.password ;

  // We search for the email in our database
  var searchEmail = await userModel.findOne({ email: "toto@hotmail.fr" })

  //  if nothing came back from the database
  if(!searchEmail){
      // We create our new user
      var newUser = new userModel({
        username: usernameFromFront,
        email:emailFromFront,
        password:passwordFromFront,
      });
      // We save our new user in our MongoDB
      var userSaveToDb = await newUser.save();

      // We use the session system for our user so it wont forgot our user 
      req.session.user = userSaveToDb;

  }

  res.redirect('/cities');
});



/* Post sign-in. */
router.post('/sign-in',async function(req, res, next) {

  // We save the informations from the front-end page, from the sign-in form
  var emailFromFront= req.body.email;
  var passwordFromFront =req.body.password;

  // We are asking our database to search if there is a user with this email
  var searchUser = await userModel.findOne({email:emailFromFront,password:passwordFromFront})

  // if we dont have a user with the email
  if(!searchUser){

    // Log the research result in the terminal
    console.log(`There is no one in the database with the email ${emailFromFront}, so we display the page Login again, the user need to sign-in`)

    // Go to Login page
    res.redirect('/')

  }else{ 
    
    /* If we have a user in our database with this email and passeword */ 
    console.log(`We find a user in the database with the email ${emailFromFront}, so we can display directly the cities screen`)

    // We use the session system for our user so it wont forgot our user 
    req.session.user = searchUser;

    // Cities routes directly
    res.redirect('/cities')
  }

});

/* GET Logout. */
router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/')
});

module.exports = router;
