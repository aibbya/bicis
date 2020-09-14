var mongoose = require("mongoose");
var Reserva = require("./mdlReserva");
const { NotExtended } = require("http-errors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var Schema = mongoose.Schema;

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/;
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
    unique: 
    validate: [validateEmail, "Por favor ingrese un email valido"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/],

  },
  password: {
    type: String,
    required: [true, "El password es obligatorio"],
  },
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  verificate: {
    type: Boolean,
    default: false,
  },
});
usuarioSchema.plugin(uniqueVadator, {message: 'El {PATH} ya existe con otro usuario'})

usuarioSchema.pre("save"),
  function () {
    if (this.isModified("password")) {
      this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
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

module.exports = mongoose.model("Usuario", usuarioSchema);
