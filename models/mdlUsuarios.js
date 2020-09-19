var mongoose = require("mongoose");
var Reserva = require("./mdlReserva");
const { NotExtended } = require("http-errors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const uniqueValidator = require("mongoose-unique-validator");
const saltRounds = 10;
const Token = require("./mdlToken");
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
      from: "no-reply@redbiciletas.com",
      to: email_destino,
      subject: "Verificacion de Cuenta",
      text:
        "HOla, \n\n" +
        "por favor,para verificar su cuenta haga click en este enlace: \n" +
        "http://localhost:3000" +
        "/token/confirmation/" +
        token.token +
        ".\n",
    };
    mailer.sendMail(mailOptions, function (err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("A verification email has been sent to", email_destino);
    });
  });
};

module.exports = mongoose.model("Usuario", usuarioSchema);