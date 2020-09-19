const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const Usuario = require('../models/mdlUsuarios')

passport.use(new LocalStrategy(
  // cb(null, user.id)
));

passport.serializeUser(function(user, cb){  
  cb(null, user.id)
})

passport.deserializeUser(function(id, cb){
  Usuario.findById(id, function(err, user){
    cb(err, user);
  })
})

module.exports = passport;