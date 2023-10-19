const axios = require("axios");
const hbs = require("hbs");
const path = require("path");

// HELPERS HANDLEBARS
// {{precio}} --> objeto
hbs.registerHelper("dolarApeso", (objeto) => {
  let precioTotal = dolarHOY * objeto;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(precioTotal);

  // new Intl.NumberFormat
});

hbs.registerHelper("list", (objeto) => {
  // Convierto en array la lista de características separadas previamente con "coma"
  let array = objeto.split(",");
  var html = "<ul>";

  // Recorro array para que, cada valor, tenga el HTML <li>
  for (var i = 0; i < array.length; i++) {
    html = `${html} <li> ${array[i]} </li>`;
  }

  return html + "</ul>";
});

// FUNCIONES EXTRAS
/* Cálculo dolar */
let dolarHOY;
let dolar;
axios
  //VIEJA API DOLAR
  //.get("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
  
  //NUEVA API DOLAR
  .get("https://api.bluelytics.com.ar/v2/latest")
  .then((response) => {
    dolar = response.data.oficial.value_sell;
    //dolar = dolar.replace(/,/g, ".");
    dolar = parseFloat(dolar);
  })
  .then(() => {
    const impuestoPAIS = 0.3;
    const percepcionAFIP = 0.35;
    dolarHOY = dolar * impuestoPAIS + dolar * percepcionAFIP + dolar;
    return dolarHOY;
  })
  .catch(function (error) {
    // handle error
    console.log("error Axios", error);
  });

const multer = require("multer"); //Maneja la subida de archivos al directorio público.
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb = callback
    const rutaAnterior = path.resolve(__dirname, '..');
    cb(null, path.join(rutaAnterior + "/public/uploads/"));
  },
  filename: (req, file, cb) => {
    let fileExtension = file.originalname.split(".")[1];
    cb(null, `${Date.now()}.${fileExtension}`);
  },
});

var maxSize = 1024 * 1024 * 1; // 1MB
var maxSizeMB = formatBytes(maxSize, 2);
// FUNCION: Manejar errores de la imagen cargada
var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Sólo los formatos .png, .jpg y .jpeg son los permitidos")
      );
    }
  },
}).single("imagenDeProducto");

// FUNCION: tamaño de archivo
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

module.exports = {
  upload,
  maxSizeMB,
  multer,
  storage,
};
