const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const {
    verificarToken,
    verificarAdministrador
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verificarToken);
router.use(verificarAdministrador);

router.get('/', UsuarioController.obtenerTodos);
router.get('/:id', UsuarioController.obtenerPorId);
router.post('/', UsuarioController.crear);
router.put('/:id', UsuarioController.actualizar);
router.delete('/:id', UsuarioController.eliminar);

module.exports = router;

