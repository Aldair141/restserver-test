const jwt = require('jsonwebtoken');

let validaToken = (request, response, next) => {
    let token = request.get('Authorization');
    jwt.verify(token, process.env.SIDE, (_error, _decoded) => {
        if (_error) {
            return response.status(401).json({
                ok: false,
                error: 'Token no válido'
            });
        }

        request.payload = _decoded;
        next();
    });
};

let usuarioAdmin = (request, response, next) => {
    let rol = request.payload.usuario.rol;
    if (rol !== "ADMIN_ROLE") {
        response.status(401).json({
            ok: false,
            error: 'Solo los administradores pueden ejecutar esta acción'
        });
    } else {
        next();
    }
}

module.exports = {
    validaToken,
    usuarioAdmin
}