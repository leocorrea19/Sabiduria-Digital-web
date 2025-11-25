/**
 * @fileoverview Controlador de Usuario
 * Maneja operaciones relacionadas con el perfil del usuario
 * Incluye funcionalidad para guardar y obtener formaciones guardadas
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// backend/controllers/userController.js

import User from '../models/User.js';
import Formacion from '../models/Formacion.js';

// ============================================================================
// GUARDAR FORMACIÓN
// ============================================================================

/**
 * Guarda una formación en la lista de cursos guardados del usuario
 * Utiliza $addToSet para evitar duplicados
 * 
 * @async
 * @function saveCourse
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.courseId - ID de la formación a guardar
 * @param {Object} req.user - Usuario autenticado (añadido por middleware 'protect')
 * @param {string} req.user._id - ID del usuario autenticado
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>}
 * 
 * @description
 * Proceso para guardar una formación:
 * 1. Extraer courseId de los parámetros de la URL
 * 2. Obtener userId del objeto req.user (añadido por middleware de autenticación)
 * 3. Verificar que la formación existe en la base de datos
 * 4. Añadir el ID de la formación al array saved_courses del usuario
 * 5. Usar $addToSet para evitar duplicados
 * 
 * @route PUT /api/users/save-course/:courseId
 * @access Privado (requiere autenticación)
 */
export const saveCourse = async (req, res) => {
    // Extraer el ID de la formación de los parámetros de la URL
    const { courseId } = req.params;

    /**
     * Obtener el ID del usuario autenticado
     * Este campo es añadido por el middleware 'protect' (authMiddleware.js)
     * que verifica el token JWT y adjunta el usuario a req.user
     */
    const userId = req.user._id;

    try {
        // ====================================================================
        // VERIFICACIÓN DE EXISTENCIA DE LA FORMACIÓN
        // ====================================================================

        /**
         * Buscar la formación por su ID en la base de datos
         * Esto asegura que el ID proporcionado corresponde a una formación válida
         */
        const formacion = await Formacion.findById(courseId);

        /**
         * Si la formación no existe, responder con error 404 (Not Found)
         */
        if (!formacion) {
            return res.status(404).json({
                msg: 'Formación no encontrada'
            });
        }

        // ====================================================================
        // ACTUALIZACIÓN DEL USUARIO
        // ====================================================================

        /**
         * Actualizar el usuario añadiendo la formación a su lista de guardados
         * 
         * findByIdAndUpdate() busca el usuario por ID y lo actualiza
         * $addToSet añade el elemento al array solo si no existe (evita duplicados)
         * 
         * Alternativa: $push añadiría el elemento siempre, permitiendo duplicados
         */
        await User.findByIdAndUpdate(userId, {
            $addToSet: { saved_courses: formacion._id }
        });

        // ====================================================================
        // RESPUESTA EXITOSA
        // ====================================================================

        /**
         * Responder con código 200 (OK) y mensaje de éxito
         */
        res.status(200).json({
            msg: 'Formación guardada exitosamente'
        });

    } catch (error) {
        // ====================================================================
        // MANEJO DE ERRORES
        // ====================================================================

        /**
         * Responder con error 500 (Internal Server Error)
         * Incluir mensaje de error para debugging
         */
        res.status(500).json({
            msg: 'Error en el servidor',
            error: error.message
        });
    }
};

// ============================================================================
// OBTENER FORMACIONES GUARDADAS
// ============================================================================

/**
 * Obtiene todas las formaciones guardadas por el usuario autenticado
 * Utiliza populate() para obtener los datos completos de cada formación
 * 
 * @async
 * @function getSavedCourses
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.user - Usuario autenticado (añadido por middleware 'protect')
 * @param {string} req.user._id - ID del usuario autenticado
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>}
 * 
 * @description
 * Proceso para obtener formaciones guardadas:
 * 1. Obtener userId del objeto req.user (añadido por middleware)
 * 2. Buscar el usuario por su ID
 * 3. Usar populate() para reemplazar los IDs de saved_courses con los documentos completos
 * 4. Responder con el array de formaciones completas
 * 
 * populate() es una característica de Mongoose que:
 * - Toma los ObjectIds del array saved_courses
 * - Busca los documentos correspondientes en la colección Formacion
 * - Reemplaza los IDs con los documentos completos
 * 
 * @route GET /api/users/saved-courses
 * @access Privado (requiere autenticación)
 * 
 * @example
 * // Respuesta exitosa:
 * [
 *   {
 *     _id: "507f1f77bcf86cd799439011",
 *     categoria: "ingenieria",
 *     titulo: "Ingeniería en Sistemas",
 *     descripcion: "Formación completa...",
 *     instituciones: [...]
 *   },
 *   ...
 * ]
 */
export const getSavedCourses = async (req, res) => {
    /**
     * Obtener el ID del usuario autenticado
     * Provisto por el middleware 'protect' que verifica el token JWT
     */
    const userId = req.user._id;

    try {
        // ====================================================================
        // BÚSQUEDA DEL USUARIO
        // ====================================================================

        /**
         * Buscar el usuario por su ID en la base de datos
         */
        const user = await User.findById(userId);

        /**
         * Si el usuario no existe, responder con error 404 (Not Found)
         * Esto es poco probable ya que el middleware ya verificó el token
         */
        if (!user) {
            return res.status(404).json({
                msg: 'Usuario no encontrado'
            });
        }

        // ====================================================================
        // POBLACIÓN DE FORMACIONES
        // ====================================================================

        /**
         * Usar populate() para obtener los datos completos de las formaciones
         * 
         * Antes de populate():
         * user.saved_courses = ["507f1f77bcf86cd799439011", "507f191e810c19729de860ea"]
         * 
         * Después de populate():
         * user.saved_courses = [
         *   { _id: "507f...", titulo: "Ing. Sistemas", descripcion: "...", ... },
         *   { _id: "507f...", titulo: "Lic. Informática", descripcion: "...", ... }
         * ]
         */
        await user.populate('saved_courses');

        // ====================================================================
        // RESPUESTA EXITOSA
        // ====================================================================

        /**
         * Responder con código 200 (OK)
         * Enviar solo el array de formaciones guardadas (con datos completos)
         */
        res.status(200).json(user.saved_courses);

    } catch (error) {
        // ====================================================================
        // MANEJO DE ERRORES
        // ====================================================================

        /**
         * Responder con error 500 (Internal Server Error)
         */
        res.status(500).json({
            msg: 'Error en el servidor',
            error: error.message
        });
    }
};