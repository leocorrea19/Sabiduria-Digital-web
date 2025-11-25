/**
 * @fileoverview Servidor principal de la aplicación
 * Configura Express, conecta a MongoDB y define las rutas de la API
 * Punto de entrada del backend
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// backend/server.js

// ============================================================================
// IMPORTACIONES
// ============================================================================

import 'dotenv/config'; // Cargar variables de entorno desde .env
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import formacionRoutes from './routes/formacionRoutes.js';

// ============================================================================
// CONFIGURACIÓN INICIAL
// ============================================================================

/**
 * Crear instancia de la aplicación Express
 * @type {express.Application}
 */
const app = express();

/**
 * Puerto en el que correrá el servidor
 * @constant {number}
 */
const PORT = 3000;

/**
 * URI de conexión a MongoDB
 * Obtenida de las variables de entorno (.env)
 * @constant {string}
 */
const MONGO_URI = process.env.MONGO_URI;

// ============================================================================
// MIDDLEWARES GLOBALES
// ============================================================================

/**
 * Middleware para parsear JSON en el body de las peticiones
 * Permite leer req.body en formato JSON
 * 
 * Sin este middleware, req.body sería undefined
 */
app.use(express.json());

/**
 * Middleware CORS (Cross-Origin Resource Sharing)
 * Permite que el frontend (en otro puerto/dominio) haga peticiones a esta API
 * 
 * { origin: true } permite peticiones desde cualquier origen
 * En producción, se debería especificar el dominio exacto del frontend
 * 
 * @example
 * // Configuración más segura para producción:
 * app.use(cors({ origin: 'https://mi-frontend.com' }));
 */
app.use(cors({ origin: true }));

// ============================================================================
// RUTAS
// ============================================================================

/**
 * Ruta raíz de la API
 * Proporciona información básica sobre el estado del servidor
 * 
 * @route GET /
 * @access Público
 * 
 * @returns {Object} JSON con mensaje y estado de la base de datos
 * 
 * @example
 * // Respuesta exitosa:
 * {
 *   "message": "API Sabiduría Digital Operativa",
 *   "database": "Conectada"
 * }
 */
app.get('/', (req, res) => {
    res.json({
        message: 'API Sabiduría Digital Operativa',
        /**
         * mongoose.connection.readyState indica el estado de la conexión:
         * 0 = desconectado
         * 1 = conectado
         * 2 = conectando
         * 3 = desconectando
         */
        database: mongoose.connection.readyState === 1 ? 'Conectada' : 'Desconectada'
    });
});

/**
 * Montar rutas de autenticación
 * Todas las rutas definidas en authRoutes estarán bajo /api/auth
 * 
 * Ejemplos:
 * - POST /api/auth/register
 * - POST /api/auth/login
 */
app.use('/api/auth', authRoutes);

/**
 * Montar rutas de usuario
 * Todas las rutas definidas en userRoutes estarán bajo /api/users
 * 
 * Ejemplos:
 * - PUT /api/users/save-course/:courseId
 * - GET /api/users/saved-courses
 */
app.use('/api/users', userRoutes);

/**
 * Montar rutas de formaciones
 * Todas las rutas definidas en formacionRoutes estarán bajo /api/formaciones
 * 
 * Ejemplos:
 * - GET /api/formaciones
 * - GET /api/formaciones?categoria=ingenieria
 * - GET /api/formaciones/:id
 */
app.use('/api/formaciones', formacionRoutes);

// ============================================================================
// CONEXIÓN A BASE DE DATOS E INICIO DEL SERVIDOR
// ============================================================================

/**
 * Conectar a MongoDB y luego iniciar el servidor Express
 * 
 * Este patrón asegura que el servidor solo comience a aceptar peticiones
 * después de que la conexión a la base de datos esté establecida
 * 
 * mongoose.connect() retorna una Promise que se resuelve cuando la conexión es exitosa
 */
mongoose.connect(MONGO_URI)
    .then(() => {
        /**
         * Callback ejecutado cuando la conexión a MongoDB es exitosa
         */
        console.log('✅ Conectado a MongoDB local');

        /**
         * Iniciar el servidor Express en el puerto especificado
         * app.listen() comienza a escuchar peticiones HTTP
         */
        app.listen(PORT, () => {
            console.log(`🚀 Servidor Express corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        /**
         * Callback ejecutado si la conexión a MongoDB falla
         * 
         * Posibles causas de error:
         * - MongoDB no está corriendo
         * - URI de conexión incorrecta
         * - Problemas de red
         * - Credenciales inválidas (si usa autenticación)
         */
        console.error('❌ Error de conexión a MongoDB:', error.message);
    });