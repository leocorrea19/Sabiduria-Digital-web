// backend/routes/authRoutes.js

import express from 'express';
// Importamos AMBAS funciones del controlador
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Ruta de Registro (ya la tenías)
router.post('/register', registerUser);

// --- AÑADE ESTA NUEVA RUTA ---
// Ruta de Login
router.post('/login', loginUser);

export default router;