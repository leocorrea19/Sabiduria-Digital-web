/**
 * @fileoverview Módulo de menú hamburguesa responsivo
 * Controla la apertura/cierre del menú de navegación en dispositivos móviles
 * y cambia el ícono entre hamburguesa y X
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// javascript/menu.js

/**
 * Event listener que se ejecuta cuando el DOM está completamente cargado
 * Configura la funcionalidad del menú hamburguesa para navegación móvil
 */
document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los elementos del DOM
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');

    // Verificar que ambos elementos existen antes de agregar funcionalidad
    if (hamburgerMenu && navLinks) {

        /**
         * Manejador de clic para el botón hamburguesa
         * Alterna la visibilidad del menú y cambia el ícono
         */
        hamburgerMenu.addEventListener('click', () => {
            // Alternar la clase 'active' para mostrar/ocultar el menú
            navLinks.classList.toggle('active');

            // Obtener el elemento del ícono dentro del botón
            const icon = hamburgerMenu.querySelector('i');

            // Cambiar el ícono según el estado del menú
            if (navLinks.classList.contains('active')) {
                // Menú abierto: mostrar ícono de X
                icon.classList.remove('bx-menu');
                icon.classList.add('bx-x');
            } else {
                // Menú cerrado: mostrar ícono de hamburguesa
                icon.classList.remove('bx-x');
                icon.classList.add('bx-menu');
            }
        });

        /**
         * Cerrar el menú automáticamente al hacer clic en cualquier enlace
         * Mejora la UX en dispositivos móviles y SPAs (Single Page Applications)
         */
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Solo cerrar si el menú está abierto
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');

                    // Restaurar el ícono de hamburguesa
                    hamburgerMenu.querySelector('i').classList.remove('bx-x');
                    hamburgerMenu.querySelector('i').classList.add('bx-menu');
                }
            });
        });
    }
});