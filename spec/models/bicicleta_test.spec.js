var Bicicleta = require("../../models/mdlBicicletas");

beforeEach(() => {
  Bicicleta.allBicis = [];
});
describe("Bicicleta.allBicis", () => {
  it("comienza vacia", () => {
    expect(Bicicleta.allBicis.length).toBe(0);
  });
});

describe("Bicicleta.add", () => {
  it("agregamos 1", () => {
    expect(Bicicleta.allBicis.length).toBe(0);

    var a = new Bicicleta(1, "roja", "urbana", [-34.559098, -58.49571577]);
    Bicicleta.add(a);

    expect(Bicicleta.allBicis.length).toBe(1);
    expect(Bicicleta.allBicis[0]).toBe(a);
  });
});

describe("Bicicleta.findById", () => {
  it("debe devolver bici con ID 1", () => {
    expect(Bicicleta.allBicis.length).toBe(0);
    var a = new Bicicleta(1, "roja", "urbana", [-34.559098, -58.49571577]);
    Bicicleta.add(a);
    var b = new Bicicleta(2, "negra", "monta", [-34.559098, -58.49573577]);
    Bicicleta.add(b);

    var targetBici = Bicicleta.findById(1);
    expect(targetBici.id).toBe(a.id);
    expect(targetBici.color).toBe(a.color);
    expect(targetBici.modelo).toBe(a.modelo);
  });
});
