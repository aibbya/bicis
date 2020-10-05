require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const passport = require("./config/passport");
var session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const jwt = require("jsonwebtoken");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var tokenRouter = require("./routes/token");
var bicicletasRouter = require("./routes/bicicletas");
var bicicletasApiRouter = require("./routes/api/apiRouterBicicletas");
var usuariosApiRouter = require("./routes/api/apiRouterUsuarios");
var authApiRouter = require("./routes/api/apiRouterAuth");

var Usuario = require("./models/mdlUsuarios");
var Token = require("./models/mdl_token");

let store;
if (process.env.NODE_ENV === "development") {
  store = new session.MemoryStore();
} else {
  store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions",
  });
  store.on("error", function (error) {
    assert.ifError(error);
    assert.ok(false);
  });
}

var app = express();

app.set("secretKey", "jwt_pwd_!!223344");

app.use(
  session({
    cookie: { maxAge: 240 * 60 * 60 * 1000 },
    store: store,
    saveUninitialized: true,
    resave: true,
    secret: "...!",
  })
);

var mongoose = require("mongoose");
// var mongoDB = "mongodb://localhost/red_bicicletas";
// mongodb+srv://aibby:<password>@cluster0.q0vxu.mongodb.net/<dbname>?retryWrites=true&w=majority
var mongoDB = process.env.MONGO_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.connect(mongoDB, { useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection Error: "));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.get("/login", function (req, res) {
  res.render("session/login");
});

app.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, usuario, info) {
    if (err) {
      console.log(err);
      return next(err);
    }
    if (!usuario) {
      console.log(info);
      return res.render("session/login", { info });
    }
    req.logIn(usuario, function (err) {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

app.get("/logout", function (req, res) {
  req.logOut();
  res.redirect("/");
});

app.get("/forgotPwd", function (req, res) {
  res.render("session/forgotPwd");
});

app.post("/forgotPwd", function (req, res) {
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    if (!usuario) {
      return res.render("session/forgotPwd", {
        info: { message: "No existe este usuario" },
      });
    }

    usuario.resetPassword(function (err) {
      if (err) return next(err);
      console.log("session/forgotPwdMsg");
    });
  });
  res.render("session/forgotPwdMsg");
});

app.get("/resetPwd/:token", function (req, res, next) {
  Token.findOne({ token: req.params.token }, function (err, token) {
    if (!token)
      return res
        .status(400)
        .send({ type: "not-verified", msg: "Verifique, su token ha expirado" });
    Usuario.findById(token._userId, function (err, usuario) {
      if (!usuario)
        return res
          .status(400)
          .send({ msg: "No existe usuario asociado a este token" });
      res.render("session/resetPwd", { error: {}, usuario: usuario });
    });
  });
});

app.post("/resetPwd", function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    res.render("session/resetPwd", {
      errors: {
        confirm_password: { message: "No coninciden las contraseñas" },
      },
      usuario: new Usuario({ email: req.body.email }),
    });
    return;
  }
  Usuario.findOne({ email: req.body.email }, function (err, usuario) {
    usuario.password = req.body.password;
    usuario.save(function (err) {
      if (err) {
        console.log("err", err);
        res.render("session/resetPwd", {
          errors: err.errors,
          usuario: new Usuario({ email: req.body.email }),
        });
      } else {
        res.redirect("/login");
      }
    });
  });
});

app.use("/usuarios", usersRouter);
app.use("/token", tokenRouter);

app.use("/bicicletas", loggedIn, bicicletasRouter);

app.use("/api/auth", authApiRouter);
app.use("/api/bicicletas", bicicletasApiRouter);
app.use("/api/usuarios", validarUsuario, usuariosApiRouter);

app.use("/politica_de_privacidad", function (req, res) {
  res.sendFile("public/politica_de_privacidad.html");
});

app.use("/google9dceff3ac65a565e", function (req, res) {
  res.sendFile("public/google9dceff3ac65a565e.html");
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log("user sin logears");
    res.redirect("/login");
  }
}

function validarUsuario(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function (
    err,
    decoded
  ) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      req.body.userId = decoded.id;
      console.log("Jwt verify:", decoded);
      next();
    }
  });
}

module.exports = app;
