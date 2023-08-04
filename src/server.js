const express = require("express"); // Para configurar servidor
const morgan = require("morgan"); // Para mejorar el LOG de la consola del servidor
const env = require("dotenv").config(); // Variables de Entorno
const hbs = require("hbs"); // Páginas dinámicas usando Handlebars
require("./helpers/helpers"); // Funciones extras y de ayuda para HBS
const session = require("express-session"); // Para autorizaciones
const path = require("path"); // Permite poder indicar que otras rutas tener en cuenta en views

// CREAR APP CON EXPRESS
const app = express();

//SESIÓN DEL USUARIO
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

// SETEAR MOTOR DE LAS VISTAS
app.set("view engine", "hbs");

// RUTAS DE LAS VISTAS
const viewsPath = [
  path.join(__dirname, "views/front"),
  path.join(__dirname, "views/back"),
  path.join(__dirname, "views/partials"),
];
app.set("views", viewsPath);

// RUTA DE LAS VISTAS PARTIALS
hbs.registerPartials(__dirname + "/views/partials");

// RUTAS
app.use("/", require("./routes/rutas"));

// RUTA CARPETA PÚBLICA
app.use(express.static(path.join(__dirname, "public")));

// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// 404 NOT FOUND
app.use(function (req, res, next) {
  res.status(404).render("404");
});

// INICAR EL SERVIDOR
let PORT = env.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ONLINE en puerto ${PORT}.`);
});
