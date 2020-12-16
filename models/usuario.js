const { request } = require('express');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio.']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio.'],
        unique: true
    },
    clave: {
        type: String,
        required: [true, 'La clave es obligatoria.']
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        enum: {
            values: ['ADMIN_ROLE', 'USER_ROLE'],
            message: '{VALUE} no es un rol válido.'
        }
    },
    activo: {
        type: Boolean,
        default: true
    },
    img: {
        type: String,
        default: '../img/no-image.jpg'
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser un valor único.'
});


usuarioSchema.methods.toJSON = function() {
    let _objeto = this;
    let _objetoPARSE = _objeto.toObject();

    delete _objetoPARSE.clave;
    return _objetoPARSE;
}

module.exports = mongoose.model('Usuario', usuarioSchema);