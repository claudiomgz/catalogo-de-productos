const express = require("express"); // Para configurar servidor
const morgan = require("morgan"); // Para mejorar el LOG de la consola del servidor
const env = require("dotenv").config(); // Variables de Entorno
const hbs = require("hbs"); // Páginas dinámicas usando Handlebars
require("./helpers/helpers"); // Funciones extras y de ayuda para HBS
const session = require("express-session"); // Para autorizaciones
const path = require("path"); // Permite poder indicar que otras rutas tener en cuenta en views

const app = express();

// Determinar el modo de ejecución (desarrollo o producción)
const isProduction = process.env.NODE_ENV === "production";

// Configurar la ruta de las vistas
app.set("view engine", "hbs");
const viewsPath = isProduction
  ? [
      path.join("./dist/views/front"),
      path.join("./dist/views/back"),
      path.join("./dist/views"),
    ]
  : [
      path.join("./views/front"),
      path.join("./views/back"),
      path.join("./views"),
    ];
app.set("views", viewsPath);

const partialPath = isProduction
  ?  "/dist/views/partials"
  :  "/views/partials";
hbs.registerPartials(__dirname + partialPath);

// Configurar el middleware para servir archivos estáticos
const publicPath = isProduction
  ? path.join(__dirname, "dist/public")
  : path.join(__dirname, "public");
app.use("/", express.static(publicPath));

// // Configuración HANDLEBARS para dev
// app.set("view engine", "hbs");
// app.set("views", [
//   path.join("./views/front"),
//   path.join("./views/back"),
//   path.join("./views"),
// ]);
// hbs.registerPartials(__dirname + "/views/partials");

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

// RUTAS
app.use("/", require("./routes/rutas"));
//app.use("/", express.static(__dirname + "/public"));

/* 404 not found */
app.use(function (req, res, next) {
  res.status(404).render("404");
});

// Iniciar el servidor
let PORT = env.parsed.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ONLINE en puerto ${PORT}.`);
});
