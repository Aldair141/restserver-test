const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const app = express();
const port = process.env.PORT || 1500;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB = '';

if (process.env.NODE_ENV === "dev") {
    urlDB = 'mongodb://localhost:27017/cafe_test';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/usuario", (request, response) => {
    let desde = request.query.desde || 0;
    desde = Number(desde);

    let limite = request.query.limite || 5;
    limite = Number(limite);

    let _activo = request.query.activo || true;

    let _id = request.query.id || undefined;

    const criterio = {
        activo: _activo
    };

    if (_id) {
        criterio._id = _id;
    }

    Usuario.find(criterio, 'nombre correo clave').skip(desde).limit(limite).exec((err, data) => {
        if (err) {
            response.status(400).json({
                ok: false,
                error: err
            });
        } else {
            Usuario.countDocuments(criterio, (_error, _cantidad) => {
                if (_error) {
                    response.status(400).json({
                        ok: false,
                        error: _error
                    });
                } else {
                    response.json({
                        ok: true,
                        data: data,
                        cantidad: _cantidad
                    });
                }
            });
        }
    });
});

app.post("/usuario", (request, response) => {
    let body = request.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        clave: bcrypt.hashSync(body.clave, 10),
        rol: body.rol,
        activo: body.activo,
        img: body.img,
        google: body.google
    });

    usuario.save((err, data) => {
        if (err) {
            response.status(400).json({
                ok: false,
                error: err
            });
        } else {
            response.json({
                ok: true,
                usuario: data
            });
        }
    });
});

app.put("/usuario/:id?", (request, response) => {
    let id = request.params.id || undefined;

    if (id === undefined) {
        return response.status(400).json({
            ok: false,
            error: 'El id de usuario es requerido.'
        });
    }

    let body = _.pick(request.body, ['nombre', 'correo', 'clave', 'img']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, data) => {
        if (err) {
            response.status(400).json({
                ok: false,
                error: err
            });
        } else {
            response.json({
                ok: true,
                usuario: data
            });
        }
    });
});

app.delete("/usuario/:id?", (request, response) => {
    let id = request.params.id || undefined;

    if (id === undefined) {
        return response.status(400).json({
            ok: false,
            error: 'El id de usuario es requerido.'
        });
    }

    const editar = {
        activo: false
    };

    Usuario.findByIdAndUpdate(id, editar, { new: true }, (err, data) => {
        if (err) {
            response.status(400).json({
                ok: false,
                error: err
            });
        } else {
            response.json({
                ok: true,
                usuario: data
            });
        }
    });
});

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
};

mongoose.connect(process.env.URLDB, options, (err) => {
    if (err) throw err;
    console.log("Base de datos ONLINE");
})

app.listen(port, () => {
    console.log(`Escuchando el puerto ${ port }`);
});