/**
 * @fileoverview Módulo de perfil de usuario
 * Muestra las formaciones/cursos guardados por el usuario autenticado
 * Requiere autenticación mediante token JWT
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// javascript/perfil.js

/**
 * Event listener asíncrono que se ejecuta cuando el DOM está completamente cargado
 * Carga y muestra los cursos guardados del usuario autenticado
 */
document.addEventListener('DOMContentLoaded', async () => {

    // ========================================================================
    // VERIFICACIÓN DE AUTENTICACIÓN
    // ========================================================================

    // Obtener el token JWT de localStorage
    const token = localStorage.getItem('token');

    // Si no hay token, el usuario no está autenticado
    // Redirigir a la página de inicio de sesión
    if (!token) {
        alert('Necesitas iniciar sesión para ver esta página.');
        window.location.href = '/views/sesion.html';
        return;
    }

    // ========================================================================
    // OBTENCIÓN DEL CONTENEDOR
    // ========================================================================

    // Buscar el contenedor donde se renderizarán los cursos guardados
    const container = document.getElementById('saved-courses-container');

    // Si no existe el contenedor, salir (página incorrecta)
    if (!container) return;

    try {
        // ====================================================================
        // PETICIÓN A LA API PROTEGIDA
        // ====================================================================

        /**
         * Realizar petición GET a la ruta protegida de cursos guardados
         * El token se envía en el header Authorization para autenticación
         */
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users/saved-courses`, {
            method: 'GET',
            headers: {
                // IMPORTANTE: Enviar el token en formato Bearer para autenticación
                'Authorization': `Bearer ${token}`
            }
        });

        // Validar la respuesta del servidor
        if (!response.ok) {
            // Si el token es inválido o expiró, el servidor responderá con error
            // Limpiar el token corrupto/expirado
            localStorage.removeItem('token');
            throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        }

        // Parsear la respuesta JSON con los cursos guardados
        const savedCourses = await response.json();

        // ====================================================================
        // RENDERIZADO DE CURSOS
        // ====================================================================

        /**
         * Verificar si el usuario tiene cursos guardados
         * Si no hay cursos, mostrar mensaje informativo
         */
        if (savedCourses.length === 0) {
            container.innerHTML = '<p>Aún no has guardado ninguna formación.</p>';
            return;
        }

        /**
         * Iterar sobre cada curso guardado y crear su elemento HTML
         * Cada curso se muestra como una tarjeta con título, descripción y enlace
         */
        savedCourses.forEach(curso => {
            // Crear elemento contenedor para el curso
            const cursoElement = document.createElement('div');
            cursoElement.classList.add('curso-guardado-item');

            /**
             * Generar HTML del curso
             * - Título completo del curso
             * - Descripción truncada a 150 caracteres
             * - Enlace para ver detalles completos (con anchor al ID del curso)
             */
            cursoElement.innerHTML = `
                <h3>${curso.titulo}</h3>
                <p>${curso.descripcion.substring(0, 150)}...</p>
                <a href="/views/avanzado.html#${curso._id}">Ver más detalles</a>
            `;

            // Añadir el elemento al contenedor
            container.appendChild(cursoElement);
        });

    } catch (error) {
        // ====================================================================
        // MANEJO DE ERRORES
        // ====================================================================

        /**
         * Si ocurre algún error (sesión expirada, error de red, etc.)
         * Mostrar mensaje al usuario y redirigir a la página de login
         */
        alert(error.message);
        window.location.href = '/views/sesion.html';
    }
});