// backend/routes/formacionRoutes.js
import express from 'express';
import { getFormaciones, getFormacionById } from '../controllers/formacionController.js';

const router = express.Router();

// GET /api/formaciones (para todas o filtradas)
router.route('/').get(getFormaciones);

// GET /api/formaciones/:id (para una sola)
router.route('/:id').get(getFormacionById);

// No necesitamos 'protect', estas rutas son públicas
export default router;