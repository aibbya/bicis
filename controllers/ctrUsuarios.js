const Usuario = require("../models/mdlUsuarios");

module.exports = {
  list: function (req, res, next) {
    Usuario.find({}, (err, usuarios) => {
      res.render("usuarios/index", { usuarios: usuarios });
    });
  },
  update_get: function (req, res, next) {
    Usuario.findById(req.params.id, function (err, usuario) {
      res.render("usuarios/update", { errors: {}, usuario: usuario });
    });
  },
  update: function (req, res, next) {
    var update_values = { nombre: req.body.nombre };
    Usuario.findByIdAndUpdate(req.params.id, update_values, function (
      err,
      usuario
    ) {
      if (err) {
        console.log(err);
        res.render("usuario/update", {
          error: err.errors,
          usuario: new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
          }),
        });
      } else {
        res.redirect("/usuarios");
        return;
      }
    });
  },
  create_get: function (req, res, next) {
    res.render("usuarios/create", { errors: {}, usuario: new Usuario({}) });
  },
  create: function (req, res, next) {
    console.log("req.body", req.body);
    if (req.body.password != req.body.confirm_password) {
      console.log("req.body", req.body);
      res.render("usuarios/create", {
        errors: {
          confirm_password: { message: "No coninciden las contraseñas" },
        },
        usuario: new Usuario({
          nombre: req.body.nombre,
          email: req.body.email,
        }),
      });
      console.log(usuario);
      console.log("req.body 2", req.body);
      return;
    }
    console.log("req.body3 ", req.body);
    Usuario.create(
      {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password,
      },
      function (err, nuevoUsuario) {
        console.log("nvo user 1", nuevoUsuario);
        if (err) {
          console.log(err);  
          res.render("usuarios/create", {
            error: err.errors,
            usuario: new Usuario({
              nombre: req.body.nombre,
              email: req.body.email,
            }),
          });
        } else {
          console.log("else antes de enviar mail");
          nuevoUsuario.enviar_email_bienvenida();
          res.redirect("/login");
        }
      }
    );
  },
  delete: function (req, res, next) {
    Usuario.findByIdAndDelete(req.body.id, function (err) {
      if (err) {
        next(err);
      } else {
        res.redirect("/usuarios");
      }
    });
  },
};
