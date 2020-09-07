var express = require('express')
var router = express.Router();
var usuarioCtr = require('../../controllers/api/usuarioApiCtr')

router.get('/',usuarioCtr.usuarios_list);
router.post('/create', usuarioCtr.usuarios_create)
router.post('/reservar', usuarioCtr.usuario_reservar);

module.exports = router