const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuario = require("../models/mdlUsuarios");
const Token = require("../models/mdl_token");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    function (email, password, done) {
      console.log("entre en LocalStrategy");
      Usuario.findOne({ email: email }, function (err, usuario) {
        if (err) {
          return done(err);
        }
        if (!usuario) {
          return done(null, false, { message: "email no existe o incorrecto" });
        }
        if (!usuario.validPassword(password)) {
          return done(null, false, { message: "Password incorrecta" });
        }
        return done(null, usuario);
      });
    }
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.HOST + "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("entre en GoogleStrategy", profile);
      Usuario.findOneOrCreateByGoogle({ googleId: profile.id }, function (
        err,
        user
      ) {
        console.log("########entre en GoogleStrategy", user);
        return cb(err, user);
      });
    }
  )
);

passport.use(
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.HOST + "/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      try {
        Usuario.findOneOrCreateByFacebook(profile, function (err, user) {
          if (err) console.log("err" + err);
          return done(err, user);
        });
      } catch (err2) {
        console.log(err2);
        return done(err2, null);
      }
    }
  )
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
