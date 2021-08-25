const express = require('express') // Para configurar servidor
require('dotenv').config() // Variables de Entorno
const morgan = require('morgan') // Para mejorar el LOG de la consola del servidor
const hbs = require('hbs'); // Páginas dinámicas usando Handlebars
require('./helpers/helpers'); // Funciones extras y de ayuda para HBS
const session = require('express-session'); // Para autorizaciones
const path = require('path'); // Permite poder indicar que otras rutas tener en cuenta en views 

const app = express()

let PORT = process.env.PORT || 3000 // Esta variable "PORT" no hay que definirla, ya existe en Heroku y es necesario aplicarla para que funcione en la plataforma.

// Handlebars
app.set('view engine', 'hbs');
app.set('views', [
    path.join('./views/front'),
    path.join('./views/back'), 
    path.join('./views')
])
hbs.registerPartials(__dirname + '/views/partials');

// middlewares
app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(session({
	secret: "codo a codo te ayuda a entrar al mundo de la programacion",
    resave: false,
	saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

// rutas
app.use('/', require('./routes/rutas'))
app.use('/', express.static(__dirname + '/public'))

/* 404 not found */
app.use(function(req, res, next) {
    res.status(404).render('404');
});

 
app.listen(PORT, () => {
    console.log(`Servidor ONLINE en puerto ${PORT}`)
})