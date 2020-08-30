var Bicicleta = require("../models/mdlBicicletas");
// const Bicicleta = require("../models/mdlBicicletas");

exports.bicicletas_list = function (req, res) {
  res.render("bicicletas/index", { bicis: Bicicleta.allBicis });
};

exports.bicicletas_create_get = function (req, res) {
  res.render("bicicletas/create");
};

exports.bicicletas_create_post = function (req, res) {
  console.log("algo");
  var bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
  bici.ubicacion = [req.body.lat, req.body.lng];
  Bicicleta.add(bici);
  res.redirect("/bicicletas");
};

exports.bicicletas_delete_post = function (req, res) {
  console.log("+++++++++++++++++");
  Bicicleta.removeById(req.body.id);

  res.redirect("/bicicletas");
};

exports.bicicletas_update_get = function (req, res) {
  var bici = Bicicleta.findById(req.params.id);

  res.render("bicicletas/update", { bici });
};

exports.bicicletas_update_post = function (req, res) {
  var bici = Bicicleta.findById(req.params.id);
  bici.id = req.body.id;
  bici.color = req.body.color;
  bici.modelo = req.body.modelo;
  bici.ubicacion = [req.body.lat, req.body.lng];

  res.redirect("/bicicletas");
};
