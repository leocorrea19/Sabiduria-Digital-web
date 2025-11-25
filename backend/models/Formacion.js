/**
 * @fileoverview Modelo de Formación (Formacion) para MongoDB
 * Define el esquema de datos para formaciones académicas (cursos, carreras, etc.)
 * Incluye sub-esquema para instituciones donde se puede estudiar
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// backend/models/Formacion.js
import mongoose from 'mongoose';

// ============================================================================
// SUB-ESQUEMA DE INSTITUCIONES
// ============================================================================

/**
 * Sub-esquema para instituciones educativas
 * Define la estructura de cada institución dentro del array 'instituciones'
 * No genera _id propio para mantener simplicidad
 * 
 * @typedef {Object} InstitucionSchema
 * @property {string} url - URL del sitio web de la institución
 * @property {string} nombre_instituto - Nombre oficial de la institución
 * @property {string} mensaje - Descripción o mensaje adicional sobre la institución
 */
const InstitucionSchema = new mongoose.Schema({
    /**
     * URL del sitio web de la institución
     * - Requerido
     * - Debe ser una URL válida
     */
    url: {
        type: String,
        required: true
    },

    /**
     * Nombre oficial de la institución educativa
     * - Requerido
     * - Ejemplo: "Universidad de Buenos Aires", "UTN FRBA"
     */
    nombre_instituto: {
        type: String,
        required: true
    },

    /**
     * Mensaje o descripción adicional sobre la institución
     * - Opcional
     * - Puede incluir información sobre modalidad, duración, etc.
     */
    mensaje: {
        type: String
    }
}, {
    /**
     * Opciones del sub-esquema
     * _id: false - No crear _id automático para cada sub-documento
     * Esto simplifica la estructura ya que no necesitamos identificar
     * individualmente cada institución
     */
    _id: false
});

// ============================================================================
// ESQUEMA PRINCIPAL DE FORMACIÓN
// ============================================================================

/**
 * Esquema de Mongoose para el modelo Formacion
 * Define la estructura de formaciones académicas (carreras, cursos, tecnicaturas, etc.)
 * 
 * @typedef {Object} FormacionSchema
 * @property {string} categoria - Tipo de formación (curso, ingenieria, licenciatura, tecnicatura)
 * @property {string} titulo - Título o nombre de la formación
 * @property {string} descripcion - Descripción detallada de la formación
 * @property {number} original_id - ID original del archivo JavaScript (para migración)
 * @property {Institucion[]} instituciones - Array de instituciones donde se puede estudiar
 * @property {Date} createdAt - Fecha de creación (automático)
 * @property {Date} updatedAt - Fecha de última actualización (automático)
 */
const FormacionSchema = new mongoose.Schema({
    /**
     * Categoría de la formación
     * - Requerido
     * - Solo permite valores específicos (enum)
     * - Usado para filtrar formaciones por tipo
     */
    categoria: {
        type: String,
        required: true,
        enum: ['curso', 'ingenieria', 'licenciatura', 'tecnicatura']
    },

    /**
     * Título de la formación
     * - Requerido
     * - Ejemplo: "Ingeniería en Sistemas", "Curso de Python"
     * - Corresponde al campo 'titulo_carrera' en los archivos originales
     */
    titulo: {
        type: String,
        required: true
    },

    /**
     * Descripción detallada de la formación
     * - Requerido
     * - Contiene información sobre el contenido, objetivos, perfil del egresado, etc.
     * - Corresponde al campo 'informacion_de_la_carrera' en los archivos originales
     */
    descripcion: {
        type: String,
        required: true
    },

    /**
     * ID original del archivo JavaScript
     * - Opcional
     * - Se usa para mantener referencia al ID original durante la migración
     * - Útil para debugging y trazabilidad
     */
    original_id: {
        type: Number
    },

    /**
     * Array de instituciones donde se puede estudiar esta formación
     * - Cada elemento sigue la estructura de InstitucionSchema
     * - Permite múltiples instituciones por formación
     * - Relación uno-a-muchos embebida (no referenciada)
     */
    instituciones: [InstitucionSchema]
}, {
    /**
     * Opciones del esquema
     * timestamps: true - Añade automáticamente campos createdAt y updatedAt
     * Útil para auditoría y tracking de cambios
     */
    timestamps: true
});

// ============================================================================
// EXPORTACIÓN DEL MODELO
// ============================================================================

/**
 * Exportar el modelo Formacion
 * Mongoose crea automáticamente la colección 'formacions' (plural)
 * 
 * @exports Formacion
 * @type {mongoose.Model}
 * 
 * @example
 * // Crear una nueva formación
 * const nuevaFormacion = new Formacion({
 *     categoria: 'ingenieria',
 *     titulo: 'Ingeniería en Sistemas',
 *     descripcion: 'Formación en desarrollo de software...',
 *     instituciones: [
 *         {
 *             url: 'https://www.utn.edu.ar',
 *             nombre_instituto: 'UTN FRBA',
 *             mensaje: 'Modalidad presencial - 5 años'
 *         }
 *     ]
 * });
 * await nuevaFormacion.save();
 */
export default mongoose.model('Formacion', FormacionSchema);