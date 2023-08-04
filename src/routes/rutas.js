var express = require("express");
var router = express.Router();

// RUTAS FRONT
const {
  inicioGET,
  comoComprarGET,
  quienesSomosGET,
  contactoGET,
  contactoPOST,
  productoGET_ID,
} = require("../controllers/front.ctrl");

router.get("/", inicioGET);
router.get("/como-comprar", comoComprarGET);
router.get("/quienes-somos", quienesSomosGET);
router.get("/contacto", contactoGET);
router.post("/contacto", contactoPOST);
router.get("/producto/:id", productoGET_ID);
// ============================= //

// RUTAS BACK
const {
  adminGET,
  loginGET,
  loginPOST,
  agregarGET,
  agregarPOST,
  editarGET_ID,
  editarPOST_ID,
  borrarGET_ID,
  logoutGET,
} = require("../controllers/back.ctrl");

router.get("/admin", adminGET);
router.get("/login", loginGET);
router.post("/login", loginPOST);
router.get("/agregar", agregarGET);
router.post("/agregar", agregarPOST);
router.get("/editar/:id", editarGET_ID);
router.post("/editar/:id", editarPOST_ID);
router.get("/borrar/:id", borrarGET_ID);
router.get("/logout", logoutGET);
// ============================= //

module.exports = router;