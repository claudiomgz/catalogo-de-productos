require('dotenv').config()
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.DB_HOST,
  database : process.env.DB_DB,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  port     : process.env.DB_PORT
});

connection.connect(err => {
    if (err) throw err
    console.log('DB esta conectada')
});

setInterval(function () {
    connection.query('SELECT 1');
    console.log("manteniendo viva la conexion")
}, 50000);


module.exports = connection;