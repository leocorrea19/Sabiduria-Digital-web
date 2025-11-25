/**
 * @fileoverview Modelo de Usuario (User) para MongoDB
 * Define el esquema de datos para usuarios del sistema
 * Incluye encriptación automática de contraseñas con bcrypt
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// backend/models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Librería para encriptación de contraseñas

// ============================================================================
// DEFINICIÓN DEL ESQUEMA
// ============================================================================

/**
 * Esquema de Mongoose para el modelo User
 * Define la estructura y validaciones de los documentos de usuario en MongoDB
 * 
 * @typedef {Object} UserSchema
 * @property {string} username - Nombre de usuario único
 * @property {string} email - Correo electrónico único
 * @property {string} password - Contraseña encriptada
 * @property {string} role - Rol del usuario (student o admin)
 * @property {ObjectId[]} saved_courses - Array de IDs de formaciones guardadas
 * @property {Date} createdAt - Fecha de creación (automático)
 * @property {Date} updatedAt - Fecha de última actualización (automático)
 */
const UserSchema = new mongoose.Schema({
    /**
     * Nombre de usuario
     * - Requerido
     * - Único en toda la base de datos
     * - Se eliminan espacios al inicio y final
     */
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true,
        trim: true // Quita espacios en blanco al inicio y final
    },

    /**
     * Correo electrónico
     * - Requerido
     * - Único en toda la base de datos
     * - Se convierte automáticamente a minúsculas
     * - Se eliminan espacios al inicio y final
     */
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        lowercase: true, // Guarda todo en minúsculas
        trim: true
    },

    /**
     * Contraseña
     * - Requerida
     * - Mínimo 6 caracteres
     * - Se encripta automáticamente antes de guardar (ver hook pre-save)
     */
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },

    /**
     * Rol del usuario en el sistema
     * - Solo permite valores 'student' o 'admin'
     * - Valor por defecto: 'student'
     */
    role: {
        type: String,
        enum: ['student', 'admin'], // Solo permite estos valores
        default: 'student'
    },

    /**
     * Array de formaciones guardadas por el usuario
     * - Almacena referencias (ObjectId) a documentos de la colección 'Formacion'
     * - Permite relación muchos-a-muchos entre usuarios y formaciones
     */
    saved_courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Formacion' // Referencia al modelo Formacion
    }]
}, {
    /**
     * Opciones del esquema
     * timestamps: true - Añade automáticamente campos createdAt y updatedAt
     */
    timestamps: true
});

// ============================================================================
// MIDDLEWARE (HOOKS)
// ============================================================================

/**
 * Hook PRE-SAVE de Mongoose
 * Se ejecuta automáticamente ANTES de que un documento User se guarde en la base de datos
 * Encripta la contraseña usando bcrypt si ha sido modificada
 * 
 * @function
 * @param {Function} next - Callback para continuar con el siguiente middleware
 * @returns {void}
 * 
 * @example
 * // Al crear un nuevo usuario:
 * const user = new User({ username: 'john', email: 'john@example.com', password: 'password123' });
 * await user.save(); // La contraseña se encriptará automáticamente antes de guardar
 */
UserSchema.pre('save', async function (next) {
    /**
     * Verificar si la contraseña fue modificada
     * Si no se modificó (ej. solo se cambió el email), no hacer nada
     * Esto previene re-encriptar una contraseña ya encriptada
     */
    if (!this.isModified('password')) {
        return next();
    }

    /**
     * Generar el 'salt' (sal)
     * El salt es un valor aleatorio que se añade a la contraseña antes de encriptar
     * El número 10 indica el costo computacional (rounds)
     * Mayor número = más seguro pero más lento
     */
    const salt = await bcrypt.genSalt(10);

    /**
     * Hashear (encriptar) la contraseña
     * Combina la contraseña original con el salt y genera un hash irreversible
     * El hash resultante se guarda en la base de datos en lugar de la contraseña original
     */
    this.password = await bcrypt.hash(this.password, salt);

    // Continuar con el proceso de guardado
    next();
});

// ============================================================================
// EXPORTACIÓN DEL MODELO
// ============================================================================

/**
 * Exportar el modelo User
 * Mongoose crea automáticamente la colección 'users' (plural y minúsculas)
 * 
 * @exports User
 * @type {mongoose.Model}
 */
export default mongoose.model('User', UserSchema);