const { Schema, model } = require('mongoose');

const MensajeSchema = Schema({

    de: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    para: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    mensaje: {
        type: String,
        required: true
    }


}, {
    timestamps: true
});

// Esto sobreescribe el metodo toJSON, y hace que al transformarlo a JSON,
// no nos devuelva el __v, el _id ni el password, el _id lo devuelve como uid.=
MensajeSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    return object;
});

module.exports = model('Mensaje', MensajeSchema);