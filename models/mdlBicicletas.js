var Bicicleta = function (id, color, modelo, ubicacion) {
  this.id = id;
  this.color = color;
  this.modelo = modelo;
  this.ubicacion = ubicacion;
};

Bicicleta.prototype.toString = function () {
  return "id:", this.id, "| color:", this.color;
};

Bicicleta.allBicis = [];

Bicicleta.add = function (aBici) {
  Bicicleta.allBicis.push(aBici);
};

Bicicleta.findById = function (aBiciId) {
  var aBici = Bicicleta.allBicis.find((x) => x.id == aBiciId);
  if (aBici) return aBici;
  else throw new Error(`No Existe una Bicicleta con el ID ${aBiciId}`);
};

Bicicleta.removeById = function (aBiciId) {
  console.log(typeof aBiciId);
  console.log(aBiciId);
  var aBici = Bicicleta.findById(aBiciId);
  console.log(aBici);
  for (var i = 0; i < Bicicleta.allBicis.length; i++) {
    if (Bicicleta.allBicis[i].id == aBiciId) {
      Bicicleta.allBicis.splice(i, 1);
      break;
    }
  }
};

var a = new Bicicleta(1, "roja", "urbana", [-34.559098, -58.49571577]);
var b = new Bicicleta(2, "blanca", "urbana", [-34.5577394, -58.4962143]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta;
