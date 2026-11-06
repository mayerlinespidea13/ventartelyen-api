const express = require('express');
const ServicioController = require('../controllers/servicioController');
const {
    verificarToken,
    verificarAdministrador
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', ServicioController.obtenerTodos);
router.get('/:id', ServicioController.obtenerPorId);

router.post('/', verificarToken, verificarAdministrador, ServicioController.crear);
router.put('/:id', verificarToken, verificarAdministrador, ServicioController.actualizar);
router.delete('/:id', verificarToken, verificarAdministrador, ServicioController.eliminar);

module.exports = router;
