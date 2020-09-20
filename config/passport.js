const express = require('express');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("../models/mdlUsuarios");

passport.use(
  new LocalStrategy({usernameField: 'email', passwordField: 'password'}, function (email, password, done) {
    console.log("entre en LocalStrategy");
    Usuario.findOne({ email: email }, function (err, usuario) {
      console.log("passport1", usuario)
      if (err) {
        console.log("err en passpot linea 12", err);
        return done(err);
      }
      if (!usuario){
        return done(null, false, { message: "email no existe o incorrecto" });}

      if (!usuario.validPassword(password)) {
        return done(null, false, { message: "Password incorrecta" });
      }
      return done(null, usuario);
    });
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  Usuario.findById(id, function (err, user) {
    cb(err, user);
  });
});

module.exports = passport;
