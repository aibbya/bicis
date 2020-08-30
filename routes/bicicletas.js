var express = require("express");
var router = express.Router();
var bicicletasController = require("../controllers/ctrBicicletas");

router.get("/", bicicletasController.bicicletas_list);

router.get("/create", bicicletasController.bicicletas_create_get);

router.post("/create", bicicletasController.bicicletas_create_post);

router.post("/:id/delete", bicicletasController.bicicletas_delete_post);

router.get("/:id/update", bicicletasController.bicicletas_update_get);

router.post("/:id/update", bicicletasController.bicicletas_update_post);

module.exports = router;
