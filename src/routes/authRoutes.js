const express = require('express');
const AuthController = require('../controllers/authController');
const {
    verificarToken
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/registro', AuthController.registrar);
router.post('/login', AuthController.iniciarSesion);
router.get('/verificar', verificarToken, AuthController.verificarSesion);
router.put('/password', verificarToken, AuthController.cambiarPassword);
router.delete('/logout', verificarToken, AuthController.cerrarSesion);

module.exports = router;
