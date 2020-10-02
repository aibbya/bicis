var mongoose = require("mongoose");
// const { bicicletas_create_post } = require("../controllers/ctrBicicletas");

var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
  code: { type: Number },
  color: { type: String },
  modelo: { type: String },
  ubicacion: {
    type: [Number],
    index: { type: "2dsphere", sparse: true },
  },
});

bicicletaSchema.statics.createInstance = function (
  code,
  color,
  modelo,
  ubicacion
) {
  return new this({
    code: code,
    color: color,
    modelo: modelo,
    ubicacion: ubicacion,
  });
};

bicicletaSchema.methods.toString = function () {
  return "code: " + this.code + " | color: " + this.color;
};

bicicletaSchema.statics.allBicis = function (cb) {
  return this.find({}, cb);
};

bicicletaSchema.statics.add = function (aBici, cb) {
  this.create(aBici, cb);
};

bicicletaSchema.statics.findByCode = function (aCode, cb) {
  console.log("bicicletaSchema.statics.findByCode", aCode);
  return this.findOne({ code: aCode }, cb);
};
bicicletaSchema.statics.removeByCode = function (aCode, cb) {
  return this.deleteOne({ code: aCode }, cb);
};

module.exports = mongoose.model("Bicicleta", bicicletaSchema);
