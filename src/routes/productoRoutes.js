const express = require('express');
const ProductoController = require('../controllers/productoController');
const {
    verificarToken,
    verificarAdministrador
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', ProductoController.obtenerTodos);
router.get('/:id', ProductoController.obtenerPorId);

router.post('/', verificarToken, verificarAdministrador, ProductoController.crear);
router.put('/:id', verificarToken, verificarAdministrador, ProductoController.actualizar);
router.delete('/:id', verificarToken, verificarAdministrador, ProductoController.eliminar);

module.exports = router;
