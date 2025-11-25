/**
 * @fileoverview Módulo de autenticación del frontend
 * Maneja el registro e inicio de sesión de usuarios con validación de formularios
 * y comunicación con la API REST del backend
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// javascript/auth.js
import Swal from 'sweetalert2'

// URL base de la API de autenticación obtenida de las variables de entorno
const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Muestra un mensaje de error en un campo de formulario específico
 * Aplica estilos de Bootstrap para indicar error y busca el contenedor
 * de feedback de forma robusta en la jerarquía del DOM
 * 
 * @param {HTMLElement} inputElement - El elemento input donde mostrar el error
 * @param {string} mensaje - El mensaje de error a mostrar
 * @returns {void}
 * 
 * @example
 * const emailInput = document.getElementById('email');
 * mostrarErrorCampo(emailInput, 'El email es inválido');
 */
function mostrarErrorCampo(inputElement, mensaje) {
    // Validación de entrada: si no hay elemento, salir temprano
    if (!inputElement) return;

    // 1. Agregar clase de Bootstrap para mostrar borde rojo en el input
    inputElement.classList.add('is-invalid');

    // 2. Buscar el div del texto de error de forma más robusta
    // Primero buscamos en el padre directo (.input-group)
    let padre = inputElement.closest('.input-group');
    let feedbackDiv = padre ? padre.querySelector('.invalid-feedback') : null;

    // Si no lo encuentra ahí, busca en el contenedor abuelo (.mb-3)
    if (!feedbackDiv) {
        padre = inputElement.closest('.mb-3');
        feedbackDiv = padre ? padre.querySelector('.invalid-feedback') : null;
    }

    // 3. Si encontramos el contenedor de feedback, mostramos el mensaje
    if (feedbackDiv) {
        feedbackDiv.textContent = mensaje;
        // Aseguramos que se vea (Bootstrap a veces necesita d-block si no es hermano directo)
        feedbackDiv.style.display = 'block';
    }
}

/**
 * Limpia todos los mensajes de error y estilos de validación de un formulario
 * Remueve las clases 'is-invalid' de todos los inputs y oculta los mensajes de feedback
 * 
 * @param {HTMLFormElement} form - El formulario a limpiar
 * @returns {void}
 * 
 * @example
 * const loginForm = document.getElementById('login-form');
 * limpiarErrores(loginForm);
 */
function limpiarErrores(form) {
    // Seleccionar todos los inputs con clase 'form-control'
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        // Remover la clase que indica error
        input.classList.remove('is-invalid');
    });

    // También ocultamos los mensajes de feedback manualmente
    const feedbacks = form.querySelectorAll('.invalid-feedback');
    feedbacks.forEach(div => div.style.display = 'none');
}

// ============================================================================
// INICIALIZACIÓN DEL DOM
// ============================================================================

/**
 * Event listener que se ejecuta cuando el DOM está completamente cargado
 * Configura los manejadores de eventos para los formularios de login y registro
 */
document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencias a los formularios
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // ========================================================================
    // MANEJADOR DE LOGIN
    // ========================================================================

    /**
     * Procesa el formulario de inicio de sesión
     * Valida credenciales y autentica al usuario contra la API
     */
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            // Prevenir el comportamiento por defecto del formulario
            e.preventDefault();

            // Limpiar errores previos antes de validar
            limpiarErrores(loginForm);

            // Obtener referencias a los campos del formulario
            const emailInput = document.getElementById('login-email');
            const passwordInput = document.getElementById('login-password');

            try {
                // Realizar petición POST a la API de login
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: emailInput.value,
                        password: passwordInput.value
                    })
                });

                // Parsear la respuesta JSON
                const data = await response.json();

                // Si la respuesta no es exitosa, lanzar error
                if (!response.ok) throw new Error(data.msg || 'Error al iniciar sesión');

                // Guardar el token JWT en localStorage para mantener la sesión
                localStorage.setItem('token', data.token);

                // Redirigir al usuario a la página principal
                window.location.href = '/index.html';

            } catch (error) {
                // Manejo de errores: mostrar mensaje específico según el tipo de error
                if (error.message.includes('Credenciales')) {
                    // Error de credenciales inválidas
                    mostrarErrorCampo(emailInput, ' ');
                    mostrarErrorCampo(passwordInput, 'Usuario o contraseña incorrectos');
                } else {
                    // Otros errores (servidor, red, etc.)
                    mostrarErrorCampo(passwordInput, 'Usuario o contraseña incorrectos');
                }
            }
        });
    }

    // ========================================================================
    // MANEJADOR DE REGISTRO
    // ========================================================================

    /**
     * Procesa el formulario de registro de nuevos usuarios
     * Realiza validaciones del lado del cliente antes de enviar al servidor
     * Implementa lógica de errores múltiples para mostrar todos los problemas a la vez
     */
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            // Prevenir el comportamiento por defecto del formulario
            e.preventDefault();

            // Limpiar errores previos
            limpiarErrores(registerForm);

            // Obtener referencias a los campos del formulario
            const userInput = document.getElementById('register-username');
            const emailInput = document.getElementById('register-email');
            const passInput = document.getElementById('register-password');
            const confirmInput = document.getElementById('register-password-confirm');

            // Extraer los valores de los campos
            const username = userInput.value;
            const email = emailInput.value;
            const password = passInput.value;
            const confirmPassword = confirmInput.value;

            // Variable bandera para acumular errores de validación
            // Permite mostrar múltiples errores simultáneamente
            let hayErrores = false;

            // ================================================================
            // VALIDACIONES DEL LADO DEL CLIENTE
            // ================================================================

            // Validación 1: Campo de usuario no puede estar vacío
            if (!username.trim()) {
                mostrarErrorCampo(userInput, "El usuario es obligatorio.");
                hayErrores = true;
            }

            // Validación 2: El usuario no debe contener espacios
            if (username.includes(' ')) {
                mostrarErrorCampo(userInput, "El usuario no puede contener espacios.");
                hayErrores = true;
            }

            // Validación 3: Campo de email no puede estar vacío
            if (!email.trim()) {
                mostrarErrorCampo(emailInput, "El email es obligatorio.");
                hayErrores = true;
            }

            // Validación 4: El email debe tener un formato válido
            // Expresión regular para validar formato de email:
            // - Debe contener caracteres antes del @
            // - Debe contener el símbolo @
            // - Debe contener un dominio después del @
            // - Debe contener un punto seguido de al menos 2 caracteres
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email.trim() && !emailRegex.test(email)) {
                mostrarErrorCampo(emailInput, "El email debe tener un formato válido (ejemplo@dominio.com).");
                hayErrores = true;
            }

            // Validación 5: Las contraseñas deben coincidir
            if (password !== confirmPassword) {
                mostrarErrorCampo(confirmInput, "Las contraseñas no coinciden.");
                hayErrores = true;
            }

            // Validación 6: Longitud mínima de contraseña (8 caracteres)
            if (password.length < 8) {
                mostrarErrorCampo(passInput, "Mínimo 8 caracteres.");
                hayErrores = true;
            }

            // Validación 7: Complejidad de contraseña (al menos 1 mayúscula y 1 número)
            // Expresión regular: (?=.*[A-Z]) = al menos una mayúscula
            //                   (?=.*\d) = al menos un dígito
            const passwordRegex = /^(?=.*[A-Z])(?=.*\d)/;
            if (!passwordRegex.test(password)) {
                // Si ya tiene error de longitud, concatenamos el mensaje
                if (passInput.classList.contains('is-invalid')) {
                    const feedback = passInput.closest('.mb-3').querySelector('.invalid-feedback');
                    feedback.textContent += " Mínimo una mayúscula y mínimo un número.";
                } else {
                    mostrarErrorCampo(passInput, "Mínimo una mayúscula y mínimo un número.");
                }
                hayErrores = true;
            }

            // Si hay errores de validación, detener el proceso
            // No enviar datos al servidor si las validaciones del cliente fallan
            if (hayErrores) {
                return;
            }

            // ================================================================
            // ENVÍO AL BACKEND
            // ================================================================

            try {
                // Realizar petición POST a la API de registro
                const response = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                // Parsear la respuesta del servidor
                const data = await response.json();

                // Si el servidor responde con error, lanzar excepción
                if (!response.ok) {
                    throw new Error(data.msg);
                }

                // Guardar el token JWT en localStorage
                localStorage.setItem('token', data.token);

                // Mostrar mensaje de éxito con SweetAlert2
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Se registro correctamente!¡Redirigiendo al inicio!",
                    showConfirmButton: false,
                    timer: 2000
                });

                // Redirigir al usuario a la página principal
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 2000);

            } catch (error) {
                // Manejo de errores del servidor (email/usuario duplicado, etc.)
                const mensaje = error.message.toLowerCase();

                // Mostrar error en el campo correspondiente según el mensaje
                if (mensaje.includes('correo') || mensaje.includes('email')) {
                    mostrarErrorCampo(emailInput, error.message);
                }
                else if (mensaje.includes('usuario') || mensaje.includes('user') || mensaje.includes('nombre')) {
                    mostrarErrorCampo(userInput, error.message);
                }
                else {
                    // Error genérico no relacionado con campos específicos
                    alert(error.message);
                }
            }
        });
    }
});