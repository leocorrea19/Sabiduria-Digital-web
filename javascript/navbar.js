/**
 * @fileoverview Módulo de gestión de la barra de navegación dinámica
 * Controla la visualización de botones según el estado de autenticación del usuario
 * Muestra Login/Registro para usuarios no autenticados y Perfil/Cerrar Sesión para autenticados
 * @author Sabiduría Digital
 * @version 2.0.0
 */

// javascript/navbar.js

/**
 * Event listener que se ejecuta cuando el DOM está completamente cargado
 * Modifica dinámicamente la barra de navegación según el estado de autenticación
 */
document.addEventListener('DOMContentLoaded', () => {

    // Verificar si existe un token de autenticación en localStorage
    // El token indica que el usuario ha iniciado sesión
    const token = localStorage.getItem('token');

    // Buscar la barra de navegación principal dentro del header
    const nav = document.querySelector('header nav');

    // Validación: si no existe el nav, registrar error y salir
    if (!nav) {
        console.error('Error: No se encontró el <nav> principal en el header.');
        return;
    }

    // ========================================================================
    // SELECCIÓN DE BOTONES POR ID (Método robusto)
    // ========================================================================

    // Buscar los botones de login y registro usando IDs únicos
    const loginBtn = nav.querySelector('#loginBtn');
    const registerBtn = nav.querySelector('#registerBtn');

    // Validación: si los botones no existen, salir silenciosamente
    // Esto es normal en páginas que no tienen estos botones (ej: sesion.html)
    if (!loginBtn || !registerBtn) {
        return;
    }

    // ========================================================================
    // LÓGICA CONDICIONAL SEGÚN ESTADO DE AUTENTICACIÓN
    // ========================================================================

    if (token) {
        // ====================================================================
        // USUARIO AUTENTICADO
        // ====================================================================

        // Ocultar botones de login y registro
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';

        // Prevenir duplicación de botones si la página se recarga
        // Solo crear los botones si no existen ya
        if (!nav.querySelector('#perfilBtn')) {

            /**
             * Crear botón "Mi Perfil"
             * Permite al usuario acceder a su página de perfil personal
             */
            const perfilBtn = document.createElement('a');
            perfilBtn.href = "/views/perfil.html";
            perfilBtn.textContent = 'Mi Perfil';
            perfilBtn.classList.add('login');
            perfilBtn.classList.add('estoy-aqui'); // Clase para estilos especiales
            perfilBtn.id = 'perfilBtn'; // ID único para prevenir duplicados

            /**
             * Crear botón "Cerrar Sesión"
             * Elimina el token y redirige al usuario a la página principal
             */
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.textContent = 'Cerrar Sesión';
            logoutBtn.classList.add('login');

            /**
             * Manejador de clic para cerrar sesión
             * Elimina el token de autenticación y redirige al inicio
             */
            logoutBtn.addEventListener('click', (e) => {
                // Prevenir navegación por defecto del enlace
                e.preventDefault();

                // Eliminar token de localStorage (cerrar sesión)
                localStorage.removeItem('token');

                // Notificar al usuario
                alert('¡Sesión cerrada! Te estamos redirigiendo al inicio.');

                // Redirigir a la página principal
                window.location.href = '/index.html';
            });

            // Añadir los nuevos botones al nav
            nav.appendChild(perfilBtn);
            nav.appendChild(logoutBtn);
        }

    } else {
        // ====================================================================
        // USUARIO NO AUTENTICADO
        // ====================================================================

        // Mostrar botones de login y registro
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
    }
});