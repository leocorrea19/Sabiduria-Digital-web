// backend/routes/userRoutes.js
import express from 'express';
import { saveCourse, getSavedCourses } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js'; // Importamos el "guardia"

const router = express.Router();

// Esta ruta usará el "guardia" (protect)
router.route('/save-course/:courseId').put(protect, saveCourse);
// Ruta para obtener los cursos guardados (protegida)
router.route('/saved-courses').get(protect, getSavedCourses);

export default router;