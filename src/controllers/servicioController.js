const Servicio = require('../models/Servicio');

class ServicioController {

    static async obtenerTodos(req, res) {
        try {
            const servicios = await Servicio.obtenerTodos();
            res.json(servicios);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al consultar los servicios'
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

            const servicio = await Servicio.obtenerPorId(id);

            if (!servicio) {
                return res.status(404).json({
                    mensaje: 'Servicio no encontrado'
                });
            }

            res.json(servicio);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al consultar el servicio'
            });
        }
    }

    static async crear(req, res) {
        try {
            const { nombre, descripcion, precio, estado } = req.body;

            if (!nombre || precio === undefined || precio === null) {
                return res.status(400).json({
                    mensaje: 'El nombre y el precio son obligatorios'
                });
            }

            if (typeof nombre !== 'string' ||
                !Number.isFinite(Number(precio)) ||
                Number(precio) < 0) {
                return res.status(400).json({
                    mensaje: 'Los datos del servicio no son válidos'
                });
            }

            const estadoFinal = estado || 'activo';

            if (!['activo', 'inactivo'].includes(estadoFinal)) {
                return res.status(400).json({
                    mensaje: 'El estado no es válido'
                });
            }

            const id = await Servicio.crear({
                nombre: nombre.trim(),
                descripcion,
                precio: Number(precio),
                estado: estadoFinal
            });

            res.status(201).json({
                mensaje: 'Servicio creado correctamente',
                id
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al crear el servicio'
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

            const { nombre, descripcion, precio, estado } = req.body;

            if (!nombre || precio === undefined || precio === null || !estado) {
                return res.status(400).json({
                    mensaje: 'Faltan datos obligatorios del servicio'
                });
            }

            if (typeof nombre !== 'string' ||
                !Number.isFinite(Number(precio)) ||
                Number(precio) < 0 ||
                !['activo', 'inactivo'].includes(estado)) {
                return res.status(400).json({
                    mensaje: 'Los datos del servicio no son válidos'
                });
            }

            const servicioExistente = await Servicio.obtenerPorId(id);

            if (!servicioExistente) {
                return res.status(404).json({
                    mensaje: 'Servicio no encontrado'
                });
            }

            await Servicio.actualizar(id, {
                nombre: nombre.trim(),
                descripcion,
                precio: Number(precio),
                estado
            });

            res.json({
                mensaje: 'Servicio actualizado correctamente'
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al actualizar el servicio'
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

            const servicio = await Servicio.obtenerPorId(id);

            if (!servicio) {
                return res.status(404).json({
                    mensaje: 'Servicio no encontrado'
                });
            }

            await Servicio.eliminar(id);

            res.json({
                mensaje: 'Servicio eliminado correctamente'
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al eliminar el servicio'
            });
        }
    }
}

module.exports = ServicioController;
