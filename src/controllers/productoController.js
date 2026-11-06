const Producto = require('../models/Producto');

class ProductoController {

    static async obtenerTodos(req, res) {
        try {
            const productos = await Producto.obtenerTodos();
            res.json(productos);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al consultar los productos'
            });
        }
    }

    static async obtenerPorId(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    mensaje: 'El ID no es válido'
                });
            }

            const producto = await Producto.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            res.json(producto);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al consultar el producto'
            });
        }
    }

    static async crear(req, res) {
        try {
            const {
                nombre,
                descripcion,
                precio,
                stock,
                categoria,
                imagen,
                estado
            } = req.body;

            if (!nombre || precio === undefined || precio === null) {
                return res.status(400).json({
                    mensaje: 'El nombre y el precio son obligatorios'
                });
            }

            if (typeof nombre !== 'string' ||
                !Number.isFinite(Number(precio)) ||
                Number(precio) < 0) {
                return res.status(400).json({
                    mensaje: 'Los datos del producto no son válidos'
                });
            }

            const stockFinal = stock === undefined ? 0 : Number(stock);
            const estadoFinal = estado || 'activo';

            if (!Number.isInteger(stockFinal) || stockFinal < 0) {
                return res.status(400).json({
                    mensaje: 'El stock debe ser un número entero igual o mayor que cero'
                });
            }

            if (!['activo', 'inactivo'].includes(estadoFinal)) {
                return res.status(400).json({
                    mensaje: 'El estado no es válido'
                });
            }

            const id = await Producto.crear({
                nombre: nombre.trim(),
                descripcion,
                precio: Number(precio),
                stock: stockFinal,
                categoria,
                imagen,
                estado: estadoFinal
            });

            res.status(201).json({
                mensaje: 'Producto creado correctamente',
                id
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al crear el producto'
            });
        }
    }

    static async actualizar(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    mensaje: 'El ID no es válido'
                });
            }

            const {
                nombre,
                descripcion,
                precio,
                stock,
                categoria,
                imagen,
                estado
            } = req.body;

            if (!nombre || precio === undefined || precio === null ||
                stock === undefined || !estado) {
                return res.status(400).json({
                    mensaje: 'Faltan datos obligatorios del producto'
                });
            }

            if (typeof nombre !== 'string' ||
                !Number.isFinite(Number(precio)) ||
                Number(precio) < 0 ||
                !Number.isInteger(Number(stock)) ||
                Number(stock) < 0 ||
                !['activo', 'inactivo'].includes(estado)) {
                return res.status(400).json({
                    mensaje: 'Los datos del producto no son válidos'
                });
            }

            const productoExistente = await Producto.obtenerPorId(id);

            if (!productoExistente) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            await Producto.actualizar(id, {
                nombre: nombre.trim(),
                descripcion,
                precio: Number(precio),
                stock: Number(stock),
                categoria,
                imagen,
                estado
            });

            res.json({
                mensaje: 'Producto actualizado correctamente'
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al actualizar el producto'
            });
        }
    }

    static async eliminar(req, res) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    mensaje: 'El ID no es válido'
                });
            }

            const producto = await Producto.obtenerPorId(id);

            if (!producto) {
                return res.status(404).json({
                    mensaje: 'Producto no encontrado'
                });
            }

            await Producto.eliminar(id);

            res.json({
                mensaje: 'Producto eliminado correctamente'
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al eliminar el producto'
            });
        }
    }
}

module.exports = ProductoController;
