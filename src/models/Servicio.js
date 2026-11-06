const pool = require('../config/database');

class Servicio {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            'SELECT * FROM servicios'
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query(
            'SELECT * FROM servicios WHERE id = ?',
            [id]
        );
        return filas[0] || null;
    }

    static async crear({ nombre, descripcion, precio, estado = 'activo' }) {
        const [resultado] = await pool.query(
            'INSERT INTO servicios (nombre, descripcion, precio, estado) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, precio, estado]
        );
        return resultado.insertId;
    }

    static async actualizar(id, { nombre, descripcion, precio, estado }) {
        const [resultado] = await pool.query(
            'UPDATE servicios SET nombre = ?, descripcion = ?, precio = ?, estado = ? WHERE id = ?',
            [nombre, descripcion, precio, estado, id]
        );
        return resultado.affectedRows;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query(
            'DELETE FROM servicios WHERE id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

module.exports = Servicio;
