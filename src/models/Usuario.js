const pool = require('../config/database');

class Usuario {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            'SELECT id, nombre, correo, rol, fecha_creacion FROM usuarios'
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query(
            'SELECT id, nombre, correo, rol, fecha_creacion FROM usuarios WHERE id = ?',
            [id]
        );
        return filas[0] || null;
    }

    static async obtenerPorCorreo(correo) {
        const [filas] = await pool.query(
            'SELECT id, nombre, correo, password, rol, fecha_creacion FROM usuarios WHERE correo = ?',
            [correo]
        );
        return filas[0] || null;
    }

    static async crear({ nombre, correo, password, rol = 'cliente' }) {
        const [resultado] = await pool.query(
            'INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)',
            [nombre, correo, password, rol]
        );
        return resultado.insertId;
    }

    static async actualizar(id, { nombre, correo, rol }) {
        const [resultado] = await pool.query(
            'UPDATE usuarios SET nombre = ?, correo = ?, rol = ? WHERE id = ?',
            [nombre, correo, rol, id]
        );
        return resultado.affectedRows;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query(
            'DELETE FROM usuarios WHERE id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

module.exports = Usuario;
