/**
 * @fileoverview Controlador de Autenticación
 * Maneja la lógica de negocio para registro e inicio de sesión de usuarios
 * Incluye validaciones, encriptación de contraseñas y generación de tokens JWT
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// backend/controllers/authController.js

import User from '../models/User.js'; // Importar modelo de Usuario
import jwt from 'jsonwebtoken'; // Librería para generar tokens JWT
import bcrypt from 'bcryptjs'; // Librería para comparar contraseñas encriptadas

// ============================================================================
// FUNCIÓN AUXILIAR - GENERACIÓN DE TOKENS
// ============================================================================

/**
 * Crea un token JWT (JSON Web Token) para autenticación
 * El token contiene el ID del usuario y expira en 3 días
 * 
 * @function createToken
 * @param {string} id - ID del usuario de MongoDB
 * @returns {string} Token JWT firmado
 * 
 * @example
 * const token = createToken('507f1f77bcf86cd799439011');
 * // Retorna: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 */
const createToken = (id) => {
    /**
     * jwt.sign() crea y firma un token
     * - Payload: { id } - Datos que se incluyen en el token
     * - Secret: process.env.JWT_SECRET - Clave secreta para firmar (del .env)
     * - Options: { expiresIn: '3d' } - El token expira en 3 días
     */
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '3d' // El token expira en 3 días
    });
};


// ============================================================================
// CONTROLADOR DE REGISTRO
// ============================================================================

/**
 * Registra un nuevo usuario en el sistema
 * Realiza validaciones de contraseña, verifica duplicados y crea el usuario
 * 
 * @async
 * @function registerUser
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.username - Nombre de usuario
 * @param {string} req.body.email - Correo electrónico
 * @param {string} req.body.password - Contraseña en texto plano
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>}
 * 
 * @description
 * Proceso de registro:
 * 1. Validar longitud de contraseña (mínimo 8 caracteres)
 * 2. Validar complejidad de contraseña (mayúscula + número)
 * 3. Verificar que el email no esté registrado
 * 4. Verificar que el username no esté en uso
 * 5. Crear usuario (la contraseña se encripta automáticamente en el modelo)
 * 6. Generar token JWT
 * 7. Responder con token y datos del usuario
 * 
 * @route POST /api/auth/register
 * @access Público
 */
export const registerUser = async (req, res) => {
    // Extraer datos del cuerpo de la petición
    const { username, email, password } = req.body;

    try {
        // ====================================================================
        // VALIDACIONES DE CONTRASEÑA (Backend)
        // ====================================================================

        /**
         * Validación 1: Longitud mínima de 8 caracteres
         * Previene contraseñas débiles
         */
        if (password.length < 8) {
            return res.status(400).json({
                msg: 'La contraseña debe tener al menos 8 caracteres.'
            });
        }

        /**
         * Validación 2: Complejidad de contraseña
         * Debe contener al menos:
         * - Una letra mayúscula (?=.*[A-Z])
         * - Un número (?=.*\d)
         */
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                msg: 'La contraseña debe contener al menos una mayúscula y un número.'
            });
        }

        // ====================================================================
        // VALIDACIÓN DE DUPLICADOS
        // ====================================================================

        /**
         * Verificar si el email ya está registrado
         * findOne() busca un documento que coincida con el filtro
         */
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                msg: 'Ese correo electrónico ya está registrado.'
            });
        }

        /**
         * Verificar si el username ya está en uso
         */
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                msg: 'Ese nombre de usuario ya está en uso.'
            });
        }

        // ====================================================================
        // CREACIÓN DEL USUARIO
        // ====================================================================

        /**
         * Crear nuevo usuario en la base de datos
         * La contraseña se encripta automáticamente gracias al hook pre-save del modelo
         */
        const user = await User.create({ username, email, password });

        /**
         * Generar token JWT para el nuevo usuario
         */
        const token = createToken(user._id);

        // ====================================================================
        // RESPUESTA EXITOSA
        // ====================================================================

        /**
         * Responder con código 201 (Created)
         * Incluir token y datos básicos del usuario (sin contraseña)
         */
        res.status(201).json({
            msg: 'Registro exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        // ====================================================================
        // MANEJO DE ERRORES
        // ====================================================================

        /**
         * Registrar error en consola para debugging
         */
        console.error(error);

        /**
         * Responder con error 500 (Internal Server Error)
         */
        res.status(500).json({
            msg: 'Error en el servidor al registrar',
            error: error.message
        });
    }
};

// ============================================================================
// CONTROLADOR DE LOGIN
// ============================================================================

/**
 * Autentica un usuario existente
 * Verifica credenciales y genera token JWT si son correctas
 * 
 * @async
 * @function loginUser
 * @param {Object} req - Objeto de petición de Express
 * @param {Object} req.body - Cuerpo de la petición
 * @param {string} req.body.email - Correo electrónico
 * @param {string} req.body.password - Contraseña en texto plano
 * @param {Object} res - Objeto de respuesta de Express
 * @returns {Promise<void>}
 * 
 * @description
 * Proceso de login:
 * 1. Validar que email y password no estén vacíos
 * 2. Buscar usuario por email
 * 3. Comparar contraseña enviada con la hasheada en DB
 * 4. Generar token JWT si las credenciales son correctas
 * 5. Responder con token y datos del usuario
 * 
 * @route POST /api/auth/login
 * @access Público
 */
export const loginUser = async (req, res) => {
    // Extraer email y password del cuerpo de la petición
    const { email, password } = req.body;

    try {
        // ====================================================================
        // VALIDACIÓN DE CAMPOS REQUERIDOS
        // ====================================================================

        /**
         * Verificar que ambos campos estén presentes
         */
        if (!email || !password) {
            return res.status(400).json({
                msg: 'Por favor, ingrese email y contraseña'
            });
        }

        // ====================================================================
        // BÚSQUEDA DEL USUARIO
        // ====================================================================

        /**
         * Buscar usuario por email en la base de datos
         */
        const user = await User.findOne({ email });

        /**
         * Si no existe el usuario, responder con error genérico
         * Nota: Usamos mensaje genérico por seguridad (no revelar si el email existe)
         */
        if (!user) {
            return res.status(400).json({
                msg: 'Credenciales inválidas'
            });
        }

        // ====================================================================
        // VERIFICACIÓN DE CONTRASEÑA
        // ====================================================================

        /**
         * Comparar la contraseña enviada con la hasheada en la base de datos
         * bcrypt.compare() compara el texto plano con el hash de forma segura
         */
        const isMatch = await bcrypt.compare(password, user.password);

        /**
         * Si la contraseña no coincide, responder con error genérico
         * Nota: Mismo mensaje que cuando el usuario no existe (seguridad)
         */
        if (!isMatch) {
            return res.status(400).json({
                msg: 'Credenciales inválidas'
            });
        }

        // ====================================================================
        // GENERACIÓN DE TOKEN Y RESPUESTA
        // ====================================================================

        /**
         * Si las credenciales son correctas, crear token JWT
         */
        const token = createToken(user._id);

        /**
         * Responder con código 200 (OK)
         * Incluir token y datos del usuario (sin contraseña)
         */
        res.status(200).json({
            msg: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        // ====================================================================
        // MANEJO DE ERRORES
        // ====================================================================

        /**
         * Responder con error 500 (Internal Server Error)
         */
        res.status(500).json({
            msg: 'Error en el servidor durante el login',
            error: error.message
        });
    }
};