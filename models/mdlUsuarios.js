var mongoose = require("mongoose");
var Reserva = require("./mdlReserva");
const { NotExtended } = require("http-errors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");
const saltRounds = 10;
const Token = require("./mdl_token");
const mailer = require("../mailer/mailer");
var Schema = mongoose.Schema;

const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(email);
};

var usuarioSchema = new Schema({
  nombre: {
    type: String,
    trim: true,
    required: [true, "El nombre es obligatorio"],
  },
  email: {
    type: String,
    trim: true,
    required: [true, "El email es obligatorio"],
    lowercase: true,
    unique: true,
    validate: [validateEmail, "Por favor ingrese un email valido"],
    match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  },
  password: {
    type: String,
    required: [true, "El password es obligatorio"],
  },
  passwordResetToken: { type: String },
  passwordResetTokenExpire: { type: Date },
  verificado: {
    type: Boolean,
    default: false,
  },
});
usuarioSchema.plugin(uniqueValidator, {
  message: "El {PATH} ya existe con otro usuario",
});

usuarioSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
  }
  next();
});

usuarioSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.resetPassword = function (cb) {
  const token = new Token({
    _userId: this.id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  const email_destino = this.email;
  token.save(function (err) {
    if (err) {
      return console.log(err.message);
    }
    const mailOptions = {
      from: "aibbyale@gmail.com",
      to: email_destino,
      subject: "Resete su Contraseña",
      text:
        "HOla, \n\n" +
        "por favor,para ingresa en este enlace para cambiar tu contraseña: \n" +
        "https://red-bicis-aibby.herokuapp.com" +
        "/resetPwd/" +
        token.token +
        " .\n",
    };
    mailer.sendMail(mailOptions, function (err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("se envio un mail para resetear contraseña", email_destino);
    });
    cb(null);
  });
};

usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
  var reserva = new Reserva({
    usuario: this._id,
    bicicleta: biciId,
    desde: desde,
    hasta: hasta,
  });
  console.log(reserva);
  reserva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function (cb) {
  const token = new Token({
    _userId: this.id,
    token: crypto.randomBytes(16).toString("hex"),
  });
  const email_destino = this.email;
  token.save(function (err) {
    if (err) {
      return console.log(err.message);
    }
    const mailOptions = {
      from: "aibbyale@gmail.com",
      to: email_destino,
      subject: "Verificacion de Cuenta",
      text:
        "Hola, \n\n" +
        "por favor,para verificar su cuenta haga click en este enlace: \n" +
        "https://red-bicis-aibby.herokuapp.com" +
        "/token/confirmation/" +
        token.token +
        " .\n",
    };
    mailer.sendMail(mailOptions, function (err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("A verification email has been sent to", email_destino);
    });
  });
};

usuarioSchema.statics.findOrCreateByGoogle = function findOrCreate(
  condition,
  callback
) {
  const self = this;
  console.log("=======1==== CONDITION ================");
  console.log(condition);
  self.findOne(
    {
      $or: [{ googleId: condition.id }, { email: condition.emails[0] }]
    },
    (err, result) => {
      if (result) {
        console.log("======result====", result)
        callback(err, result);
      } else {
        console.log("======2======= CONDITION ================");
        console.log(condition);
        let values = {};
        values.googleId = condition.id;
        values.email = condition.emails[0].value;
        values.nombre = condition.displayName || "Sin Nombre";
        values.verificado = true;
        values.password = condition._json.etag;
        console.log("================ VALUES ================");
        console.log(values);
        self.create(values, (err, result) => {
          if (err) {
            console.log(err);
          }
          return callback(err, result);
        });
      }
    }
  );
};

module.exports = mongoose.model("Usuario", usuarioSchema);
