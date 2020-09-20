var Bicicleta = require("../../models/mdlBicicletas");

exports.bicicleta_list = function (req, res) {
  Bicicleta.allBicis(function(err, bicis){
    res.status(200).json({
    bicicletas: bicis,})
  });  
};

exports.bicicleta_create = function (req, res) {
  var bici = new Bicicleta();
  bici.code = req.body.code;
  bici.color = req.body.color;
  bici.modelo = req.body.modelo;
  bici.ubicacion = [req.body.lat, req.body.lng];

  Bicicleta.add(bici);

  res.status(200).json({
    bicicleta: bici,
  });
};

exports.bicicleta_delete = function (req, res) {
  Bicicleta.removeById(req.body.code);
  res.status(204).send();
};
