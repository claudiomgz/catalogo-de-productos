require("dotenv").config();
let nodemailer = require("nodemailer"); // Para que funcione contacto
const db = require("../db");

// GET
const inicioGET = (req, res) => {
  let logueado = req.session.loggedin; // true || undefined
  let usuario = req.session.username;

  let sql = "SELECT * FROM productos";
  db.query(sql, function (err, data) {
    if (err) res.send(`Ocurrió un error ${err.code}`);

    res.render("inicio", {
      titulo: "Mi emprendimiento",
      logueado,
      usuario,
      data,
    });
  });
};

// GET
const comoComprarGET = (req, res) => {
  let logueado = req.session.loggedin; // true || undefined
  let usuario = req.session.username;

  res.render("como-comprar", {
    titulo: "Cómo comprar",
    usuario: usuario,
    logueado: logueado,
  });
};

// GET
const quienesSomosGET = (req, res) => {
  let logueado = req.session.loggedin; // true || undefined
  let usuario = req.session.username;

  res.render("quienes-somos", {
    titulo: "Quienes somos",
    usuario: usuario,
    logueado: logueado,
  });
};

// GET
const contactoGET = (req, res) => {
  let logueado = req.session.loggedin; // true || undefined
  let usuario = req.session.username;

  res.render("contacto", {
    titulo: "Contacto",
    usuario: usuario,
    logueado: logueado,
  });
};

// POST
const contactoPOST = (req, res) => {
  // Definimos el transporter
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // Definimos el email
  console.log("contactoPOST - REQ: ", req);
  console.log("contactoPOST - REQ.BODY: ", req.body);
  let data = req.body;
  var mailOptions = {
    from: data.nombre,
    to: process.env.EMAIL_RECIBE,
    subject: data.asunto,
    text: data.mensaje,
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500, error.message);
      res.status(500).render("contacto", {
        mensaje: `Ha ocurrido el siguiente error: ${error.message}`,
        mostrar: true,
      });
    } else {
      console.log("Email enviado");
      //res.redirect("/")
      res.status(200).render("contacto", {
        mensaje: "Mail enviado correctamente",
        mostrar: true,
      });
    }
  });
};

//GET
const productoGET_ID = (req, res) => {
  let id = req.params.id;
  let logueado = req.session.loggedin; // true || undefined
  let usuario = req.session.username;

  var sql = "SELECT * FROM productos WHERE id = $1";
  db.query(sql, [id], function (err, data) {
    console.log("ProductoGET_ID - DATA", data);
    console.log("ProductoGET_ID - DATA[0]", data[0]);
    if (err) res.send(`Ocurrió un error ${err.code}`);
    if (data == "") {
      res
        .status(404)
        .render("404", { mensaje: `Producto con ID ${id} no encontrado` });
    } else {
      res.render("producto", {
        // "data[0]" en vez de "data" porque sino da error con el helper "Cannot read property 'split' of undefined, dado que hay que extraer el objeto del array directamente"
        data: data[0],
        usuario: usuario,
        logueado: logueado,
      });
    }
  });
};

module.exports = {
  inicioGET,
  comoComprarGET,
  quienesSomosGET,
  contactoGET,
  contactoPOST,
  productoGET_ID,
};
