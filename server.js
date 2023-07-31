const express = require("express"); // Para configurar servidor
const morgan = require("morgan"); // Para mejorar el LOG de la consola del servidor
const env = require("dotenv").config(); // Variables de Entorno
const hbs = require("hbs"); // Páginas dinámicas usando Handlebars
require("./helpers/helpers"); // Funciones extras y de ayuda para HBS
const session = require("express-session"); // Para autorizaciones
const path = require("path"); // Permite poder indicar que otras rutas tener en cuenta en views

const app = express();
let PORT = env.parsed.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  // Configurar Express para servir archivos estáticos desde la carpeta "dist" en producción
  // HANDLEBARS
  app.set("view engine", "hbs");
  app.set("views", [
  path.join("/dist/views/front"),
  path.join("/dist/views/back"),
  path.join("/dist/views"),
]);
hbs.registerPartials(__dirname + "/dist/views/partials");
  // RUTAS
  app.use("/", require("./dist/routes/rutas"));
  app.use("/", express.static(__dirname + "/dist/public"));
} else {
  // Configurar Express para servir archivos estáticos desde la carpeta "public" en desarrollo
  // HANDLEBARS
  app.set("view engine", "hbs");
  app.set("views", [
  path.join("./views/front"),
  path.join("./views/back"),
  path.join("./views"),
]);
hbs.registerPartials(__dirname + "/views/partials");
  // RUTAS
  app.use("/", require("./routes/rutas"));
  app.use("/", express.static(__dirname + "/public"));
}

// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

/* 404 not found */
app.use(function (req, res, next) {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`Servidor ONLINE en puerto ${PORT}.`);
});
