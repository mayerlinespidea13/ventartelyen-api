const pool = require('../config/database');

class Producto {

    static async obtenerTodos() {
        const [filas] = await pool.query(
            'SELECT * FROM productos'
        );
        return filas;
    }

    static async obtenerPorId(id) {
        const [filas] = await pool.query(
            'SELECT * FROM productos WHERE id = ?',
            [id]
        );
        return filas[0] || null;
    }

    static async crear({ nombre, descripcion, precio, stock = 0, categoria, imagen, estado = 'activo' }) {
        const [resultado] = await pool.query(
            'INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen, estado) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, stock, categoria, imagen, estado]
        );
        return resultado.insertId;
    }

    static async actualizar(id, { nombre, descripcion, precio, stock, categoria, imagen, estado }) {
        const [resultado] = await pool.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, categoria = ?, imagen = ?, estado = ? WHERE id = ?',
            [nombre, descripcion, precio, stock, categoria, imagen, estado, id]
        );
        return resultado.affectedRows;
    }

    static async eliminar(id) {
        const [resultado] = await pool.query(
            'DELETE FROM productos WHERE id = ?',
            [id]
        );
        return resultado.affectedRows;
    }
}

module.exports = Producto;
