const db = require('../db');
const {upload, maxSizeMB, multer} = require('../helpers/helpers')
const fs = require('fs');


const adminGET = (req, res) => {


    if (req.session.loggedin) {

        let sql='SELECT * FROM productos';
        db.query(sql, (err,data) => {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            res.render("admin", {
                titulo: "Panel de control",
                data
            })
        })

    } else {
        res.render("login", { 
            titulo: "Login", 
            error: "Por favor loguearse para ver ésta página" 
        })

    }
    

}

const loginGET = (req, res) => {
    res.render("login", { titulo: "Login" })
}

const loginPOST = (req, res) => {

    console.log("loginPOST - REQ.session:", req.session)

    // Tomar los campos del LOGIN
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        let sql = 'SELECT * FROM cuentas WHERE email = ? AND password = ?'
        db.query(sql, [username, password], (err, data) => {
            if (data.length > 0) {
               // todo bien, que me envie a admin
                req.session.loggedin = true; // se setea como true que el usuario ingresó
                req.session.username = username // se setea el usuario según el mail de la base de datos
                res.redirect('/admin');
            } else {
                res.render("login", { titulo: "Login", error: "Nombre de usuario o contraseña incorrecto" })
            }

        })

    } else {
        res.render("login", { titulo: "Login", error: "Por favor escribe un nombre de usuario y contraseña" })
    }

}

const agregarGET = (req, res) => {
    // Chequear si se inició sesión
    if (req.session.loggedin) {
        res.render("agregar", { 
            titulo: "Agregar producto", 
            usuario: req.session.username,
            logueado: true
        })
    } else {
        res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" })
    }
}

const agregarPOST = (req, res) => {


    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Error de Multer al subir imagen
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).render('agregar', { 
                    error: `Imagen muy grande, por favor ahicar a ${maxSizeMB}`
                });
            }
            // Otros errores de Multer
            return res.status(400).render('agregar', { 
                error: `Ha pasado el siguiente error con Multer ${err.code}`
            });
        } else if (err) {
            // Otros errores ajenos a Multer
            return res.status(400).render('agregar', { 
                error: `Ha pasado el siguiente error: ${err}`
            });

        }
        // TODO OK! sigamos para adelante

        const productoDetalles = req.body;
        console.log("REQ FILE", req.file)
        const nombreImagen = req.file.filename;
        productoDetalles.imagen = nombreImagen
        console.log("PRODUCTO DETALLES", productoDetalles)

        let sql = 'INSERT INTO productos SET ?';
        db.query(sql, productoDetalles, (err, data) => {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            console.log("Información de cliente insertado correctamente ");
        })
        res.render("agregar", { 
            ok: "Producto agregado correctamente", 
            titulo: 'Agregar producto' 
        })


    })


}

const editarGET_ID = (req, res) => {

    if (req.session.loggedin) {
        const id = req.params.id; // Tomar ID del producto
        const sql=`SELECT * FROM productos WHERE id= ?`;
        db.query(sql, [id], (err, data) => {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            console.log("editarGET_ID - DATA", data)
            console.log("editarGET_ID - DATA[0]", data[0])
            if (data == "") {
                res.send(`
                        <h1>no existe producto con id ${id}</h1>
                        <a href="./admin/">Ver listado de productos</a>    
                `)
            } else {
                res.render('editar', { 
                    titulo: 'Editar producto',
                    data: data[0]
                })
            }
        })
    } else {
          res.render("login", { titulo: "Login", error: "Por favor loguearse para ver ésta página" })
    }

}

const editarPOST_ID = (req, res) => {

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Error de Multer al subir imagen
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).render('agregar', { 
                    error: `Imagen muy grande, por favor ahicar a ${maxSizeMB}`
                });
            }
            return res.status(400).render('agregar', { 
                error: `Ha pasado el siguiente error con Multer ${err.code}`
            });
        } else if (err) {
            return res.status(400).render('agregar', { 
                error: `Ha pasado el siguiente error: ${err}`
            });

        }

        const id = req.params.id;
        const productoDetalles = req.body;

        console.log("Producto Detalles ", productoDetalles)

        // chequear si la edición incluyó cambio de imagen
        if (req.hasOwnProperty("file")) {
            
            
            console.log("EditarPOST_ID - FILE", file)
            const nombreImagen = req.file.filename;
            productoDetalles.imagen = nombreImagen	
            
            // Se procede a borrar la imagen del servidor
            var borrarImagen = 'SELECT imagen FROM productos WHERE id = ?';
            db.query(borrarImagen, [id], function (err, data) {
                
                if (err) res.send(`Ocurrió un error ${err.code}`)
                
                console.log("EditarPOST_ID - DATA", data)
                fs.unlink('public/uploads/' + data[0].imagen, (err) => {
                    if (err) res.send(`Ocurrió un error ${err.code}`)
                    
                    var sql = `UPDATE productos SET ? WHERE id= ?`;
                    
                    db.query(sql, [productoDetalles, id], function (err, data) {
                        if (err) res.send(`Ocurrió un error ${err.code}`);
                        console.log(data.affectedRows + " registro(s) actualizado(s)");
                    });
                });		
            });	
        } 

        var sql = `UPDATE productos SET  ?WHERE id= ?`;
        
        db.query(sql, [productoDetalles, id], (err, data) => {
            if (err) res.send(`Ocurrió un error ${err.code}`);
            console.log(data.affectedRows + " registro actualizado");
        })

        res.redirect('/admin');

    })

}

const borrarGET_ID = (req, res) => { 

    const id= req.params.id;

    // Borrar fisicamente la imagen relacionada al producto
    var borrarImagen = 'SELECT imagen FROM productos WHERE id = ?';
    db.query(borrarImagen, [id], function (err, data) {

        console.log("borrarGET_ID - data[0].imagen", data[0].imagen)
        if (err) res.send(`Ocurrió un error ${err.code}`);

        fs.unlink('public/uploads/' + data[0].imagen, (err) => { // Borro fisicamente la imagen
            if (err) res.send(`Ocurrió un error ${err.code}`);
            console.log(`La imagen del ID ${id} ha sido borrada`);
        });
    });


    // Borrar el registro de la base de datos
    let  sql = 'DELETE FROM productos WHERE id = ?';
    db.query(sql, [id], (err, data) => {
        if (err) res.send(`Ocurrió un error ${err.code}`);
        console.log(data.affectedRows + " registro borrado");
    })

     res.redirect('/admin');
}

// GET Logout 
const logoutGET = (req,res)=> {
    console.log("req session", req.session)

	req.session.destroy((err)=>{
        
    })

    // Al finalizar sesión vuelve al inicio
	let sql='SELECT * FROM productos';
    db.query(sql, function (err, data, fields) {
        if (err) res.send(`Ocurrió un error ${err.code}`);

        res.render('inicio', { 
            titulo: "Mi emprendimiento",
            data
        })
    });
}

module.exports = {
    adminGET,
    loginGET,
    loginPOST,
    agregarGET,
    agregarPOST,
    editarGET_ID,
    editarPOST_ID,
    borrarGET_ID,
    logoutGET
}