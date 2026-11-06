require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/database');

const PORT = process.env.PORT || 3000;

async function iniciarServidor() {
    try {
        const conexion = await pool.getConnection();

        console.log('Conexion a MySQL exitosa');

        conexion.release();

        app.listen(PORT, () => {
            console.log(`API REST Ventartelyen funcionando en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('Error al conectar con MySQL:', error.message);
        process.exit(1);
    }
}

iniciarServidor();
