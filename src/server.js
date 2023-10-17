const express = require("express"); // Para configurar servidor
import morgan from "morgan"; // Para mejorar el LOG de la consola del servidor
const env = require("dotenv").config(); // Variables de Entorno
import { registerPartials } from "hbs"; // Páginas dinámicas usando Handlebars
import "./helpers/helpers"; // Funciones extras y de ayuda para HBS
import session from "express-session"; // Para autorizaciones
import { join } from "path"; // Permite poder indicar que otras rutas tener en cuenta en views

// CREAR APP CON EXPRESS
const app = express();

//SESIÓN DEL USUARIO
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

// SETEAR MOTOR DE LAS VISTAS
app.set("view engine", "hbs");

// RUTAS DE LAS VISTAS
const viewsPath = [
  join(__dirname, "views/front"),
  join(__dirname, "views/back"),
  join(__dirname, "views/partials"),
];
app.set("views", viewsPath);

// RUTA DE LAS VISTAS PARTIALS
registerPartials(__dirname + "/views/partials");

// MIDDLEWARES
app.use(morgan("dev"));
app.use(json());
app.use(
  urlencoded({
    extended: false,
  })
);

// RUTAS
app.use("/", require("./routes/rutas"));

// RUTA CARPETA PÚBLICA
app.use(express.static(join(__dirname, "public")));

// 404 NOT FOUND
app.use(function (req, res, next) {
  res.status(404).render("404");
});

// INICAR EL SERVIDOR
let PORT = env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ONLINE en puerto ${PORT}.`);
});
