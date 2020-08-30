var express = require("express");
var router = express.Router();
var apiBicicletasController = require("../../controllers/api/apiBicicletasCtr");

router.get("/", apiBicicletasController.bicicleta_list);

router.post("/create", apiBicicletasController.bicicleta_create);

router.delete("/delete", apiBicicletasController.bicicleta_delete);

module.exports = router;
