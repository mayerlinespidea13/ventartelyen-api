const Usuario = require('../models/Usuario');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthController {

    static async registrar(req, res) {
        try {
            const { nombre, correo, password } = req.body;

            if (!nombre || !correo || !password) {
                return res.status(400).json({
                    mensaje: 'Todos los campos son obligatorios'
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

            const correoNormalizado = correo.trim().toLowerCase();

            const usuarioExistente = await Usuario.obtenerPorCorreo(
                correoNormalizado
            );

            if (usuarioExistente) {
                return res.status(409).json({
                    mensaje: 'Este correo ya está registrado'
                });
            }

            const passwordEncriptada = await bcrypt.hash(password, 10);

            const id = await Usuario.crear({
                nombre: nombre.trim(),
                correo: correoNormalizado,
                password: passwordEncriptada,
                rol: 'cliente'
            });

            res.status(201).json({
                mensaje: 'Registro realizado correctamente',
                usuario: {
                    id,
                    nombre: nombre.trim(),
                    correo: correoNormalizado,
                    rol: 'cliente'
                }
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al registrar el usuario'
            });
        }
    }

    static async iniciarSesion(req, res) {
        try {
            const { correo, password } = req.body;

            if (!correo || !password) {
                return res.status(400).json({
                    mensaje: 'Correo y contraseña son obligatorios'
                });
            }

            const usuario = await Usuario.obtenerPorCorreo(
                correo.trim().toLowerCase()
            );

            if (!usuario) {
                return res.status(401).json({
                    mensaje: 'Credenciales incorrectas'
                });
            }

            const passwordCorrecta = await bcrypt.compare(
                password,
                usuario.password
            );

            if (!passwordCorrecta) {
                return res.status(401).json({
                    mensaje: 'Credenciales incorrectas'
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    rol: usuario.rol
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
                }
            );

            const tokenHash = crypto
                .createHash('sha256')
                .update(token)
                .digest('hex');

            const fechaExpiracion = new Date(
                jwt.decode(token).exp * 1000
            );

            await pool.query(
                'INSERT INTO sesiones (usuario_id, token_hash, fecha_expiracion) VALUES (?, ?, ?)',
                [usuario.id, tokenHash, fechaExpiracion]
            );

            res.json({
                mensaje: 'Inicio de sesión correcto',
                token,
                usuario: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    rol: usuario.rol
                }
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al iniciar sesión'
            });
        }
    }

    static async verificarSesion(req, res) {
        res.json({
            mensaje: 'Sesión válida',
            usuario: req.usuario
        });
    }

    static async cerrarSesion(req, res) {
        try {
            const tokenHash = crypto
                .createHash('sha256')
                .update(req.token)
                .digest('hex');

            await pool.query(
                'DELETE FROM sesiones WHERE token_hash = ?',
                [tokenHash]
            );

            res.json({
                mensaje: 'Sesión cerrada correctamente'
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al cerrar la sesión'
            });
        }
    }

    static async cambiarPassword(req, res) {
        try {
            const { passwordActual, passwordNueva } = req.body;

            if (!passwordActual || !passwordNueva) {
                return res.status(400).json({
                    mensaje: 'Debes indicar la contraseña actual y la nueva'
                });
            }

            if (passwordNueva.length < 8) {
                return res.status(400).json({
                    mensaje: 'La nueva contraseña debe tener al menos 8 caracteres'
                });
            }

            const usuario = await Usuario.obtenerPorCorreo(
                req.usuario.correo
            );

            const passwordCorrecta = await bcrypt.compare(
                passwordActual,
                usuario.password
            );

            if (!passwordCorrecta) {
                return res.status(401).json({
                    mensaje: 'La contraseña actual es incorrecta'
                });
            }

            const passwordEncriptada = await bcrypt.hash(
                passwordNueva,
                10
            );

            await pool.query(
                'UPDATE usuarios SET password = ? WHERE id = ?',
                [passwordEncriptada, req.usuario.id]
            );

            res.json({
                mensaje: 'Contraseña actualizada correctamente'
            });

        } catch (error) {
            res.status(500).json({
                mensaje: 'Error al cambiar la contraseña'
            });
        }
    }
}

module.exports = AuthController;
