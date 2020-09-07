var mongoose = require("mongoose");
var Bicicleta = require("../../models/mdlBicicletas");
var request = require("request");
var server = require("../../bin/www");
const { response } = require("express");

var base_url = "http://localhost:5000/api/bicicletas";

describe("BicicletasApi", () => {
  beforeEach((done) => {
    mongoose.disconnect();
    var mongoDB = "mongodb://localhost/testdb";
    mongoose.connect(mongoDB, { useNewUrlParser: true });

    const db = mongoose.connection;
    db.on(
      "error",
      console.error.bind(
        console,
        "AIBBY TIENES ERROR DE CONNECTION en **API TEST**"
      )
    );
    db.once("open", () => {
      console.log("TE CONECTATESTE A LA BASE DE DATOS **API test**");
      done();
    });
  });

  afterEach((done) => {
    Bicicleta.deleteMany({}, (error, success) => {
      if (error) console.log(error);
      mongoose.connection.close(done);
      done();
    });
  });

  describe("GEt Bicicletas/", () => {
    it("en get status 200", (done) => {
      request.get(base_url, function (err, response, body) {
        var result = JSON.parse(body);
        console.log("result es", result);
        expect(response.statusCode).toBe(200);
        // expect(result.bicicleta.length).toBe(0);
        done();
      });
    });
  });

  describe("POST Bicicletas /create", () => {
    it("en post CrearInstancia Status 200", (done) => {
      var headers = { "content-type": "application/json" };
      var aBici ='{"code": 10, "color": "rojo", "modelo": "urbana", "lat" :-34.559098, "lng": -58.495717}';
      console.log("aBici es: ", aBici);
      request.post(
        {
          headers: headers,
          url: base_url + "/create",
          body: aBici,
        },
        function (err, response, body) {
          console.log("el status code es ", response.statusCode);
          console.log(body);
          expect(response.statusCode).toBe(200);
          var bici = JSON.parse(body).bicicleta;
          console.log("la bici es ", bici);
          expect(bici.color).toBe("rojo");
          expect(bici.modelo).toBe("urbana");
          done();
        }
      );
    });
  });
  beforeAll((done) => {
    mongoose.connection.close(done);
  });
});

/* 
beforeEach(() => {
  console.log("testeando....");
});

describe("BicicletaAPi", () => {
  describe("GET BICICLETAS /", () => {
    it("Status 200", () => {
      expect(Bicicleta.allBicis.length).toBe(0);

      var a = new Bicicleta(1, "roja", "urbana", [-34.559098, -58.49571577]);
      Bicicleta.add(a);

      request.get("http://localhost:4000/api/bicicletas", function (
        error,
        response,
        body
      ) {
        expect(response.statusCode).toBe(200);
      });
    });
  });
});

describe("POST bicicletas/create", () => {
  it("status 200 MAGIA", (done) => {
    var headers = { "content-type": "application/json" };
    var aBici =
      '{"id": 10, "color" : "rojo", "modelo" : "urbana", "lat" : -34.559098, "lng" : -58.49571577 }';
    request.post(
      {
        headers: headers,
        url: "http://localhost:4000/api/bicicletas/create",
        body: aBici,
      },
      function (error, response, body) {
        expect(response.statusCode).toBe(200);
        expect(Bicicleta.findById(10).color).toBe("rojo");
        done();
      }
    );
  });
});
 */
