const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const crypto = require('crypto');

async function verificarToken(req, res, next) {
    try {
        const encabezado = req.headers.authorization;

        if (!encabezado || !encabezado.startsWith('Bearer ')) {
            return res.status(401).json({
                mensaje: 'Debes iniciar sesión para continuar'
            });
        }

        const token = encabezado.split(' ')[1];

        const datosToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const tokenHash = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const [sesiones] = await pool.query(
            'SELECT usuario_id FROM sesiones WHERE token_hash = ? AND fecha_expiracion > NOW()',
            [tokenHash]
        );

        if (sesiones.length === 0) {
            return res.status(401).json({
                mensaje: 'La sesión no existe o ha expirado'
            });
        }

        const [usuarios] = await pool.query(
            'SELECT id, nombre, correo, rol FROM usuarios WHERE id = ?',
            [datosToken.id]
        );

        if (
            usuarios.length === 0 ||
            usuarios[0].id !== sesiones[0].usuario_id
        ) {
            return res.status(401).json({
                mensaje: 'Usuario no válido'
            });
        }

        req.usuario = usuarios[0];
        req.token = token;

        next();

    } catch (error) {
        console.error('ERROR AL VERIFICAR TOKEN:', error.message);

        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
}

function verificarAdministrador(req, res, next) {
    if (!req.usuario || req.usuario.rol !== 'administrador') {
        return res.status(403).json({
            mensaje: 'No tienes permisos para realizar esta acción'
        });
    }

    next();
}

module.exports = {
    verificarToken,
    verificarAdministrador
};