var mongoose = require("mongoose");
var Bicicleta = require("../../models/mdlBicicletas");
var Usuario = require("../../models/mdlUsuarios");
var Reserva = require("../../models/mdlReserva");

describe("Testing Uusuaros", function () {
  beforeEach(function (done) {
    mongoose.disconnect();
    var mongoDB = "mongodb://localhost/testdb";
    mongoose.connect(mongoDB, { useNewUrlParser: true });

    const db = mongoose.connection;
    db.on(
      "error",
      console.error.bind(console, "AIBBY TIENES ERROR DE CONNECTION ")
    );
    db.once("open", () => {
      console.log("TE CONECTATESTE A LA BASE DE DATOS **test**");
      done();
    });
  });
  afterEach(function (done) {
    Reserva.deleteMany({}, function (error, success) {
      if (error) console.log(error);
      Usuario.deleteMany({}, function (err, success) {
        if (err) console.log(err);
        Bicicleta.deleteMany({}, function (e, success) {
          if (e) console.log(e);
          done();
        });
      });
    });
  });

  describe("Cuando un usuario reserva una  bici", () => {
    it("dede existir la reserva", (done) => {
      const usuario = new Usuario({ nombre: "Ezequiel" });
      usuario.save();
      const bicicleta = new Bicicleta({
        code: 1,
        color: "negro",
        modelo: "urbana",
        lat: -34.559098,
        lng: -58.495717,
      });
      bicicleta.save();

      var hoy = new Date();
      var mañana = new Date();
      mañana.setDate(hoy.getDate() + 1);
      usuario.reservar(bicicleta.id, hoy, mañana, function (err, reserva) {
        Reserva.find({})
          .populate("bicicleta")
          .populate("usuario")
          .exec(function (err, reservas) {
            console.log("esta es la reserva",reservas[0]);
            expect(reservas.length).toBe(1);
            expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
            done();
          });
      });
    });
  });
});
