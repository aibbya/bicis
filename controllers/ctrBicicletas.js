var Bicicleta = require("../models/mdlBicicletas");
// const Bicicleta = require("../models/mdlBicicletas");

exports.bicicletas_list = function (req, res) {
  // res.render("bicicletas/index", 
  // { bicis: Bicicleta.allBicis });
  Bicicleta.find({}, (err, bicis)=> {
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
  var bici = new Bicicleta(req.body.code, req.body.color, req.body.modelo);
  bici.ubicacion = [req.body.lat, req.body.lng];
  Bicicleta.add(bici);
  res.redirect("/bicicletas");
};

exports.bicicletas_delete_post = function (req, res) {
  Bicicleta.removeById(req.body.code);

  res.redirect("/bicicletas");
};

exports.bicicletas_update_get = function (req, res) {
  var bici = Bicicleta.findById(req.params.code);

  res.render("bicicletas/update", { bici });
};

exports.bicicletas_update_post = function (req, res) {
  var bici = Bicicleta.findById(req.params.id);
  bici.id = req.body.code;
  bici.color = req.body.color;
  bici.modelo = req.body.modelo;
  bici.ubicacion = [req.body.lat, req.body.lng];

  res.redirect("/bicicletas");
};
