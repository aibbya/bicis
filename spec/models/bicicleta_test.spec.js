var mongoose = require("mongoose");
var Bicicleta = require("../../models/mdlBicicletas");

describe("Testing Bicicletas,", () => {
  beforeEach((done) => {
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
  afterEach((done) => {
    Bicicleta.deleteMany({}, (error, success) => {
      if (error) console.log(error);
      done();
    });
  });

  beforeAll((done) => {
    mongoose.connection.close(done);
  });

  describe("Bicicleta.createInstance", () => {
    it("crea una instancia de bicicletas", () => {
      var bici = Bicicleta.createInstance(1, "verde", "urbana", [
        -34.559098,
        -58.49571577,
      ]);

      expect(bici.code).toBe(1);
      expect(bici.color).toBe("verde");
      expect(bici.modelo).toBe("urbana");
      expect(bici.ubicacion[0]).toEqual(-34.559098);
      expect(bici.ubicacion[1]).toEqual(-58.49571577);
    });
  });

  describe("Bicicleta.allBici", () => {
    it("comienza vacia", (done) => {
      Bicicleta.allBicis((err, bicis) => {
        console.log(bicis);
        expect(bicis.length).toBe(0);
        done();
      });
    });
  });

  describe("Bicicletas.add", () => {
    it("agrega solo una bici", (done) => {
      var aBici = new Bicicleta({
        code: 1,
        color: "verde",
        modelo: "urbana",
        ubicacion: [-34.559098, -58.49571577],
      });
      Bicicleta.add(aBici, (err, newBici) => {
        if (err) console.log(err);
        Bicicleta.allBicis((err, bicis) => {
          console.log(bicis);
          expect(bicis.length).toEqual(1);
          expect(bicis[0].code).toEqual(aBici.code);
          done();
        });
      });
    });
  });

  describe("Bicicleta.findByCode", () => {
    it("debe devolver la bici con codigo 1", (done) => {
      Bicicleta.allBicis((err, bicis) => {
        expect(bicis.length).toBe(0);

        var aBici = new Bicicleta({
          code: 1,
          color: "verde",
          modelo: "urbana",
          ubicacion: [-34.559098, -58.49571577],
        });
        Bicicleta.add(aBici, (err, newBici) => {
          if (err) console.log(err);

          var aBici2 = new Bicicleta({
            code: 2,
            color: "roja",
            modelo: "montaña",
            ubicacion: [-34.555098, -58.49550577],
          });
          Bicicleta.add(aBici2, (err, newBici) => {
            if (err) console.log(err);
            Bicicleta.findByCode(1, (err, targetBici) => {
              expect(targetBici.code).toBe(aBici.code);
              expect(targetBici.color).toBe(aBici.color);
              expect(targetBici.modelo).toBe(aBici.modelo);

              done();
            });
          });
        });
      });
    });
  });
});

/* 
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
 */
