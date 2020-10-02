var Bicicleta = require("../models/mdlBicicletas");
// const Bicicleta = require("../models/mdlBicicletas");

exports.bicicletas_list = function (req, res) {
  // res.render("bicicletas/index",
  // { bicis: Bicicleta.allBicis });
  Bicicleta.find({}, (err, bicis) => {
    res.render("bicicletas/index", { bicis: bicis });
    // function (req, res, next) {
    //   Usuario.find({}, (err, usuarios) => {
    //     res.render("usuarios/index", { usuarios: usuarios });
  });
  // },
};

exports.bicicletas_create_get = function (req, res) {
  res.render("bicicletas/create");
};

exports.bicicletas_create_post = function (req, res) {
  console.log("algo");

  console.log("req.body", req.body);
  // var bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
  // bici.ubicacion = [req.body.lat, req.body.lng];
  Bicicleta.create(
    {
      code: req.body.id,
      modelo: req.body.modelo,
      color: req.body.color,
      ubicacion: [req.body.lat, req.body.lng],
    },
    function (err, nuevaBici) {
      if (err) {
        console.log(err);
        console.log("nvo Bici Con error");
        res.render("bicicletas/create", {
          error: err.errors,
          bici: new Bicicleta({
            code: req.body.id,
            modelo: req.body.modelo,
            color: req.body.color,
            ubicacion: [req.body.lat, req.body.lng]
          }),
        });
      } else {
        console.log("Agregada Correctamente");
        res.redirect("/bicicletas");
      }
    }
  );
};

exports.bicicletas_delete_post = function (req, res) {
  Bicicleta.findByIdAndDelete(req.body.id, function (err) {
    if (err) {
      next(err);
    } else {
      res.redirect("/bicicletas");
    }
  });
};

exports.bicicletas_update_get = function (req, res) {
  Bicicleta.findById(req.params.id, function (err, bici) {
    res.render("bicicletas/update", { errors: {}, bici: bici });
  });
};

exports.bicicletas_update_post = function (req, res) {
  var update_values = {
    code: req.body.id,
    modelo: req.body.modelo,
    color: req.body.color,
    ubicacion: [req.body.lat, req.body.lng]
  };
  Bicicleta.findByIdAndUpdate(req.params.id, update_values, function (
    err,
    bici
  ) {
    if (err) {
      console.log(err);
      res.render("bicicletas/update", {
        error: err.errors,
        bici: new Bicicleta({
          code: req.body.id,
          modelo: req.body.modelo,
          color: req.body.color,
          latitud: req.body.lat,
          longitud: req.body.lng,
        }),
      });
    } else {
      res.redirect("/bicicletas");
      return;
    }
  });

  // var bici = Bicicleta.findByCode(req.params.code);
  // bici.code = req.body.code;
  // bici.color = req.body.color;
  // bici.modelo = req.body.modelo;
  // bici.ubicacion = [req.body.lat, req.body.lng];

  // res.redirect("/bicicletas");
};
