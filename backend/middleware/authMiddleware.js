/**
 * @fileoverview Middleware de Autenticación
 * Protege rutas verificando y validando tokens JWT
 * Adjunta el usuario autenticado al objeto request
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// backend/middleware/authMiddleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// ============================================================================
// MIDDLEWARE DE PROTECCIÓN DE RUTAS
// ============================================================================

/**
 * Middleware para proteger rutas que requieren autenticación
 * Verifica el token JWT y adjunta el usuario autenticado a req.user
 * 
 * @async
 * @function protect
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.headers - Headers de la petición HTTP
 * @param {string} req.headers.authorization - Header de autorización con formato "Bearer <token>"
 * @param {Object} res - Objeto de respuesta de Express
 * @param {Function} next - Función para pasar al siguiente middleware
 * @returns {Promise<void>}
 * 
 * @description
 * Este middleware implementa el flujo de autenticación JWT:
 * 
 * 1. Verificar que existe el header Authorization
 * 2. Extraer el token del header (formato: "Bearer eyJhbGci...")
 * 3. Verificar y decodificar el token usando la clave secreta
 * 4. Buscar el usuario por el ID contenido en el token
 * 5. Adjuntar el usuario a req.user (sin la contraseña)
 * 6. Llamar a next() para continuar con el siguiente middleware/controlador
 * 
 * Si cualquier paso falla, responde con error 401 (Unauthorized)
 * 
 * @example
 * // Uso en rutas de Express:
 * router.get('/protected-route', protect, controllerFunction);
 * 
 * @example
 * // Header de autorización requerido:
 * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
export const protect = async (req, res, next) => {
    // Variable para almacenar el token
    let token;

    // ========================================================================
    // VERIFICACIÓN Y EXTRACCIÓN DEL TOKEN
    // ========================================================================

    /**
     * Verificar que existe el header Authorization y que comienza con "Bearer"
     * 
     * Formato esperado del header:
     * Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     * 
     * req.headers.authorization contiene el valor completo del header
     * startsWith('Bearer') verifica que use el esquema correcto
     */
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // ================================================================
            // EXTRACCIÓN DEL TOKEN
            // ================================================================

            /**
             * Extraer el token del header
             * 
             * El header tiene formato: "Bearer eyJhbGci..."
             * split(' ') divide en: ["Bearer", "eyJhbGci..."]
             * [1] obtiene el segundo elemento (el token)
             */
            token = req.headers.authorization.split(' ')[1];

            // ================================================================
            // VERIFICACIÓN Y DECODIFICACIÓN DEL TOKEN
            // ================================================================

            /**
             * Verificar y decodificar el token JWT
             * 
             * jwt.verify() hace dos cosas:
             * 1. Verifica que el token fue firmado con nuestra clave secreta
             * 2. Verifica que el token no ha expirado
             * 3. Decodifica el payload del token
             * 
             * Si el token es inválido o expiró, lanza un error
             * 
             * El payload decodificado contiene:
             * {
             *   id: "507f1f77bcf86cd799439011",  // ID del usuario
             *   iat: 1516239022,                  // Issued at (timestamp)
             *   exp: 1516325422                   // Expiration (timestamp)
             * }
             */
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // ================================================================
            // BÚSQUEDA Y ADJUNCIÓN DEL USUARIO
            // ================================================================

            /**
             * Buscar el usuario por el ID contenido en el token
             * 
             * findById(decoded.id) busca el usuario usando el ID del payload
             * .select('-password') excluye el campo password del resultado
             * 
             * Esto es importante por seguridad: nunca exponemos la contraseña
             * hasheada en las respuestas, ni siquiera en req.user
             * 
             * El usuario resultante se adjunta a req.user, haciéndolo disponible
             * en todos los controladores que usen este middleware
             */
            req.user = await User.findById(decoded.id).select('-password');

            // ================================================================
            // CONTINUAR AL SIGUIENTE MIDDLEWARE
            // ================================================================

            /**
             * Llamar a next() para pasar al siguiente middleware o controlador
             * En este punto, req.user contiene el usuario autenticado
             */
            next();

        } catch (error) {
            // ================================================================
            // MANEJO DE ERRORES DE VERIFICACIÓN
            // ================================================================

            /**
             * Si ocurre algún error durante la verificación:
             * - Token inválido (firma incorrecta)
             * - Token expirado
             * - Token malformado
             * - Usuario no encontrado
             * 
             * Registrar el error en consola para debugging
             */
            console.error('Error de autenticación:', error.message);

            /**
             * Responder con error 401 (Unauthorized)
             * No revelar detalles específicos del error por seguridad
             */
            res.status(401).json({
                msg: 'No autorizado, token falló'
            });
        }
    }

    // ========================================================================
    // VALIDACIÓN DE PRESENCIA DEL TOKEN
    // ========================================================================

    /**
     * Si no se encontró el header Authorization o no tiene formato Bearer
     * responder con error 401 (Unauthorized)
     * 
     * Nota: Este bloque se ejecuta solo si no se entró al if anterior
     * Es decir, si no existe el header o no comienza con "Bearer"
     */
    if (!token) {
        return res.status(401).json({
            msg: 'No autorizado, no hay token'
        });
    }
};