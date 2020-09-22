var Usuario = require("../models/mdlUsuarios");
var Token = require("../models/mdl_token");
// const { token } = require('morgan')

module.exports = {
  confirmationGet: function (req, res, next) {
    console.log("req", req);
    Token.findOne({ token: req.params.token }, function (err, token) {
      if (!token)
        return res
          .status(400)
          .send({
            type: "not-verificated",
            msg:
              "No se pudo verificar este token, quizas ha expirado, realicelo nuevamente",
          });
      Usuario.findById(token._userId, function (err, usuario) {
        if (!usuario)
          return res.status(400).send({ msg: "Usuario no encontrado" });
        if (usuario.verificado) return res.redirect("/usuarios");
        usuario.verificado = true;
        usuario.save(function (err) {
          if (err) {
            return res.status(500).send({ msg: err.message });
          }
          res.redirect("/");
        });
      });
    });
  },
};
