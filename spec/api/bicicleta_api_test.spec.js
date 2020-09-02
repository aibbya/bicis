var Bicicleta = require("../../models/mdlBicicletas");
var request = require("request");
var server = require("../../bin/www");

// beforeEach(() => {
//   Bicicleta.allBicis = [];
// });
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
