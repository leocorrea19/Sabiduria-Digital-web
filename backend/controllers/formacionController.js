/**
 * @fileoverview Controlador de Formaciones
 * Maneja operaciones de lectura para formaciones académicas
 * Incluye filtrado por categoría y búsqueda por ID
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// backend/controllers/formacionController.js

import Formacion from '../models/Formacion.js';

// ============================================================================
// OBTENER TODAS LAS FORMACIONES (CON FILTRO OPCIONAL)
// ============================================================================

/**
 * Obtiene todas las formaciones o las filtra por categoría
 * Permite consultas con o sin parámetro de query
 * 
 * @async
 * @function getFormaciones
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.query - Parámetros de query de la URL
 * @param {string} [req.query.categoria] - Categoría opcional para filtrar
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>}
 * 
 * @description
 * Esta función maneja dos casos de uso:
 * 
 * 1. Sin filtro (GET /api/formaciones):
 *    - Retorna TODAS las formaciones de la base de datos
 *    - Útil para mostrar catálogo completo
 * 
 * 2. Con filtro (GET /api/formaciones?categoria=ingenieria):
 *    - Retorna solo las formaciones de la categoría especificada
 *    - Útil para mostrar formaciones por tipo
 * 
 * El filtrado se implementa usando un objeto dinámico que se pasa a find()
 * 
 * @route GET /api/formaciones
 * @route GET /api/formaciones?categoria=curso
 * @access Público
 * 
 * @example
 * // Obtener todas las formaciones
 * GET /api/formaciones
 * 
 * @example
 * // Obtener solo ingenierías
 * GET /api/formaciones?categoria=ingenieria
 */
export const getFormaciones = async (req, res) => {
    try {
        // ====================================================================
        // PREPARACIÓN DEL FILTRO
        // ====================================================================

        /**
         * Crear objeto de filtro vacío
         * Este objeto se pasará a Mongoose para filtrar los resultados
         */
        const filtro = {};

        /**
         * Si el usuario envía un query parameter ?categoria=...
         * añadirlo al objeto de filtro
         * 
         * req.query contiene todos los parámetros de la URL
         * Ejemplo: /api/formaciones?categoria=curso&otro=valor
         * req.query = { categoria: 'curso', otro: 'valor' }
         */
        if (req.query.categoria) {
            filtro.categoria = req.query.categoria;
        }

        // ====================================================================
        // CONSULTA A LA BASE DE DATOS
        // ====================================================================

        /**
         * Buscar formaciones en la base de datos usando el filtro
         * 
         * Casos:
         * - Si filtro = {} (vacío): find() retorna TODOS los documentos
         * - Si filtro = { categoria: 'ingenieria' }: find() retorna solo ingenierías
         * 
         * Mongoose automáticamente convierte el objeto filtro en una query de MongoDB
         */
        const formaciones = await Formacion.find(filtro);

        // ====================================================================
        // RESPUESTA EXITOSA
        // ====================================================================

        /**
         * Responder con código 200 (OK)
         * Enviar array de formaciones (puede estar vacío si no hay resultados)
         */
        res.status(200).json(formaciones);

    } catch (error) {
        // ====================================================================
        // MANEJO DE ERRORES
        // ====================================================================

        /**
         * Responder con error 500 (Internal Server Error)
         * Incluir mensaje de error para debugging
         */
        res.status(500).json({
            msg: 'Error al obtener formaciones',
            error: error.message
        });
    }
};

// ============================================================================
// OBTENER UNA FORMACIÓN POR ID
// ============================================================================

/**
 * Obtiene una formación específica por su ID de MongoDB
 * Útil para mostrar detalles completos de una formación
 * 
 * @async
 * @function getFormacionById
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.params - Parámetros de la URL
 * @param {string} req.params.id - ID de MongoDB de la formación
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>}
 * 
 * @description
 * Busca una formación específica por su _id de MongoDB
 * Si no se encuentra, responde con error 404
 * 
 * @route GET /api/formaciones/:id
 * @access Público
 * 
 * @example
 * // Obtener formación con ID específico
 * GET /api/formaciones/507f1f77bcf86cd799439011
 * 
 * // Respuesta exitosa:
 * {
 *   _id: "507f1f77bcf86cd799439011",
 *   categoria: "ingenieria",
 *   titulo: "Ingeniería en Sistemas",
 *   descripcion: "Formación completa en desarrollo de software...",
 *   instituciones: [
 *     {
 *       url: "https://www.utn.edu.ar",
 *       nombre_instituto: "UTN FRBA",
 *       mensaje: "Modalidad presencial - 5 años"
 *     }
 *   ],
 *   createdAt: "2024-01-15T10:30:00.000Z",
 *   updatedAt: "2024-01-15T10:30:00.000Z"
 * }
 */
export const getFormacionById = async (req, res) => {
    try {
        // ====================================================================
        // BÚSQUEDA POR ID
        // ====================================================================

        /**
         * Buscar la formación por su _id de MongoDB
         * req.params.id contiene el ID de la URL
         * 
         * Ejemplo de URL: /api/formaciones/507f1f77bcf86cd799439011
         * req.params = { id: '507f1f77bcf86cd799439011' }
         * 
         * findById() es un método de Mongoose equivalente a:
         * find({ _id: req.params.id })
         */
        const formacion = await Formacion.findById(req.params.id);

        // ====================================================================
        // VALIDACIÓN DE EXISTENCIA
        // ====================================================================

        /**
         * Si no se encuentra la formación, responder con error 404 (Not Found)
         * Esto puede ocurrir si:
         * - El ID no existe en la base de datos
         * - El ID tiene formato inválido
         */
        if (!formacion) {
            return res.status(404).json({
                msg: 'Formación no encontrada'
            });
        }

        // ====================================================================
        // RESPUESTA EXITOSA
        // ====================================================================

        /**
         * Responder con código 200 (OK)
         * Enviar el documento completo de la formación
         */
        res.status(200).json(formacion);

    } catch (error) {
        // ====================================================================
        // MANEJO DE ERRORES
        // ====================================================================

        /**
         * Responder con error 500 (Internal Server Error)
         * 
         * Nota: Si el ID tiene formato inválido (no es un ObjectId válido),
         * Mongoose lanzará un CastError que será capturado aquí
         */
        res.status(500).json({
            msg: 'Error al obtener formación',
            error: error.message
        });
    }
};