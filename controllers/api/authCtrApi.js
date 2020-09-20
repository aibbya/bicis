const Usuario = require("../../models/mdlUsuarios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  authenticate: function (req, res, next) {
    Usuario.findOne({ email: req.body.email }, function (err, userInfo) {
      if (err) {
        next(err);
      } else {
        if (userInfo === null) {
          return res
            .status(401)
            .json({
              status: "error",
              message: "Usuario o password invalido",
              data: null,
            });
        }
        if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign(
            { id: userInfo._id },
            req.app.get("secretKey"),
            { expiresIn: "10d" }
          );
          res
            .status(200)
            .json({
              message: "usuario encontrado",
              data: { usuario: userInfo, token: token },
            });
        } else {
          res
            .status(401)
            .json({
              status: "error",
              message: "Invalid password or email",
              data: null,
            });
        }
      }
    });
  },
  forgotPassword: function (req, res, nexr) {
    Usuario.findOne({ email: req.body.email }, function (err, usuario) {
      if (!usuario)
        return res
          .status(401)
          .json({ message: "no existe el usuario", data: null });
      usuario.resetPwd(function (err) {
        if (err) {
          return next(err);
        }
        res
          .status(200)
          .json({
            message: "Se envio un mail para restablecer contraseña",
            data: null,
          });
      });
    });
  },
};
