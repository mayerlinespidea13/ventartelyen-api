const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

class UsuarioController {

    static async obtenerTodos(req, res) {
        try {
            const usuarios = await Usuario.obtenerTodos();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al consultar los usuarios'
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

            const usuario = await Usuario.obtenerPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    mensaje: 'Usuario no encontrado'
                });
            }

            res.json(usuario);
        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al consultar el usuario'
            });
        }
    }

    static async crear(req, res) {
        try {
            const { nombre, correo, password, rol } = req.body;

            if (!nombre || !correo || !password) {
                return res.status(400).json({
                    mensaje: 'Nombre, correo y contraseña son obligatorios'
                });
            }

            if (typeof nombre !== 'string' ||
                typeof correo !== 'string' ||
                typeof password !== 'string') {
                return res.status(400).json({
                    mensaje: 'Los datos enviados no son válidos'
                });
            }

            if (password.length < 8) {
                return res.status(400).json({
                    mensaje: 'La contraseña debe tener al menos 8 caracteres'
                });
            }

            const rolUsuario = rol || 'cliente';

            if (!['administrador', 'cliente'].includes(rolUsuario)) {
                return res.status(400).json({
                    mensaje: 'El rol indicado no es válido'
                });
            }

            const correoExistente = await Usuario.obtenerPorCorreo(
                correo.trim().toLowerCase()
            );

            if (correoExistente) {
                return res.status(409).json({
                    mensaje: 'El correo ya está registrado'
                });
            }

            const passwordEncriptada = await bcrypt.hash(password, 10);

            const id = await Usuario.crear({
                nombre: nombre.trim(),
                correo: correo.trim().toLowerCase(),
                password: passwordEncriptada,
                rol: rolUsuario
            });

            res.status(201).json({
                mensaje: 'Usuario creado correctamente',
                id
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al crear el usuario'
            });
        }
    }

    static async actualizar(req, res) {
        try {
            const id = Number(req.params.id);
            const { nombre, correo, rol } = req.body;

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    mensaje: 'El ID no es válido'
                });
            }

            if (!nombre || !correo || !rol) {
                return res.status(400).json({
                    mensaje: 'Nombre, correo y rol son obligatorios'
                });
            }

            if (!['administrador', 'cliente'].includes(rol)) {
                return res.status(400).json({
                    mensaje: 'El rol indicado no es válido'
                });
            }

            const usuarioExistente = await Usuario.obtenerPorId(id);

            if (!usuarioExistente) {
                return res.status(404).json({
                    mensaje: 'Usuario no encontrado'
                });
            }

            const correoRegistrado = await Usuario.obtenerPorCorreo(
                correo.trim().toLowerCase()
            );

            if (correoRegistrado && correoRegistrado.id !== id) {
                return res.status(409).json({
                    mensaje: 'El correo ya pertenece a otro usuario'
                });
            }

            await Usuario.actualizar(id, {
                nombre: nombre.trim(),
                correo: correo.trim().toLowerCase(),
                rol
            });

            res.json({
                mensaje: 'Usuario actualizado correctamente'
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al actualizar el usuario'
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

            const usuario = await Usuario.obtenerPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    mensaje: 'Usuario no encontrado'
                });
            }

            await Usuario.eliminar(id);

            res.json({
                mensaje: 'Usuario eliminado correctamente'
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al eliminar el usuario'
            });
        }
    }
}

module.exports = UsuarioController;
