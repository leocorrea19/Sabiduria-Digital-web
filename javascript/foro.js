/**
 * @fileoverview Módulo de foro de opiniones
 * Permite a los usuarios agregar opiniones con clasificación por cerebros
 * Incluye sistema de calificación visual y gestión de formularios
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// javascript/foro.js

/**
 * Event listener que se ejecuta cuando el DOM está completamente cargado
 * Inicializa el sistema de opiniones y clasificación
 */
document.addEventListener('DOMContentLoaded', function () {

    // ========================================================================
    // SELECCIÓN DE ELEMENTOS DEL DOM
    // ========================================================================

    // Botón para mostrar el formulario de nueva opinión
    const botonAgregarOpinion = document.querySelector('.agregar-opinion');

    // Contenedor donde se mostrarán todas las opiniones
    const seccionOpiniones = document.querySelector('.opiniones');

    // Botón para cancelar y cerrar el formulario
    const botonCancelar = document.querySelector('.cancelar');

    // Formulario de nueva opinión
    const formulario = document.getElementById('formulario-opinion');

    // Ocultar el formulario inicialmente
    formulario.style.display = 'none';

    // ========================================================================
    // MANEJADORES DE EVENTOS PARA EL FORMULARIO
    // ========================================================================

    /**
     * Mostrar el formulario al hacer clic en "Agregar Opinión"
     * Oculta el botón mientras el formulario está visible
     */
    botonAgregarOpinion.addEventListener('click', function () {
        formulario.style.display = 'block';
        botonAgregarOpinion.style.display = 'none';
    });

    /**
     * Cancelar y cerrar el formulario
     * Limpia los campos y restaura el estado inicial
     */
    botonCancelar.addEventListener('click', function () {
        // Resetear todos los campos del formulario
        form.reset();

        // Ocultar el formulario
        formulario.style.display = 'none';

        // Mostrar nuevamente el botón "Agregar Opinión"
        botonAgregarOpinion.style.display = 'block'

        // Limpiar la clasificación de cerebros seleccionada
        limpiarClasificacion()
    });

    // ========================================================================
    // SISTEMA DE CLASIFICACIÓN POR CEREBROS
    // ========================================================================

    /**
     * Seleccionar todos los elementos de clasificación (cerebros)
     * Cada cerebro representa un nivel de calificación
     */
    const clasificacionIngreso = document.querySelectorAll('.clasificacion-ingreso');

    /**
     * Variable para almacenar el índice de la clasificación seleccionada
     * -1 indica que no hay clasificación seleccionada
     * 0-4 representa la cantidad de cerebros seleccionados
     */
    let clasificacionSeleccionada = -1;

    /**
     * Inicializa el sistema de clasificación por cerebros
     * Permite al usuario seleccionar una calificación haciendo clic en los cerebros
     * Los cerebros se "pintan" hasta el índice seleccionado
     * 
     * @function clasificacionFinal
     * @returns {void}
     */
    function clasificacionFinal() {
        clasificacionIngreso.forEach(function (clasificaciones, index) {
            clasificaciones.addEventListener('click', function () {

                // Pintar todos los cerebros desde el inicio hasta el seleccionado
                for (let i = 0; i <= index; i++) {
                    clasificacionIngreso[i].classList.add('checked');
                }

                // Despintar los cerebros posteriores al seleccionado
                for (let i = index + 1; i < clasificacionIngreso.length; i++) {
                    clasificacionIngreso[i].classList.remove('checked');
                }

                // Guardar el índice seleccionado
                clasificacionSeleccionada = index;
            });
        });
    }

    // Inicializar el sistema de clasificación
    clasificacionFinal();

    /**
     * Genera el HTML de los cerebros según la clasificación seleccionada
     * Retorna íconos de cerebros pintados (color naranja) según el nivel
     * 
     * @function obtenerClasificacionHtml
     * @returns {string} HTML con los íconos de cerebros correspondientes
     * 
     * @example
     * // Si clasificacionSeleccionada = 2, retorna 3 cerebros pintados y 2 sin pintar
     * obtenerClasificacionHtml(); // "<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>..."
     */
    function obtenerClasificacionHtml() {
        switch (clasificacionSeleccionada) {
            case 0:
                // 1 cerebro pintado
                return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>`;
            case 1:
                // 2 cerebros pintados
                return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>`;
            case 2:
                // 3 cerebros pintados
                return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>`;
            case 3:
                // 4 cerebros pintados
                return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm'></i>`;
            case 4:
                // 5 cerebros pintados (máxima calificación)
                return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                        <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>`;
            default:
                // Sin clasificación seleccionada
                return `<i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>
                        <i class='bx bx-brain bx-sm'></i>`;
        }
    }

    /**
     * Limpia la clasificación seleccionada
     * Remueve la clase 'checked' de todos los cerebros y resetea la variable
     * 
     * @function limpiarClasificacion
     * @returns {void}
     */
    function limpiarClasificacion() {
        clasificacionIngreso.forEach((clasificacion) => {
            clasificacion.classList.remove('checked');
        });
        // Restablecer a sin selección
        clasificacionSeleccionada = -1;
    }

    // ========================================================================
    // ENVÍO DEL FORMULARIO DE OPINIÓN
    // ========================================================================

    /**
     * Manejador del evento submit del formulario
     * Crea y agrega una nueva tarjeta de opinión a la sección de opiniones
     */
    const form = document.getElementById('nueva-opinion-form');
    form.addEventListener('submit', function (event) {
        // Prevenir recarga de la página
        event.preventDefault();

        // ====================================================================
        // OBTENCIÓN DE DATOS DEL FORMULARIO
        // ====================================================================

        // Datos del usuario (actualmente hardcodeados)
        // TODO: Obtener estos datos del usuario autenticado
        const nombre = 'Leonel Correa';
        const linkedin = 'https://www.linkedin.com/in/leonel-javier-correa/';

        // Obtener el texto de la opinión
        const opinion = document.getElementById('opinion').value;

        // ====================================================================
        // CREACIÓN DE LA TARJETA DE OPINIÓN
        // ====================================================================

        /**
         * Crear elemento div para la nueva tarjeta de opinión
         */
        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.classList.add('opinion-tarjeta');

        /**
         * Generar HTML del enlace de LinkedIn si existe
         * Incluye ícono de LinkedIn y enlace externo
         */
        const linkedinHtml = linkedin ? `<a href="${linkedin}" target="_blank"><i class="bx bxl-linkedin-square bx-sm" ></i> LinkedIn.</a>` : '';

        /**
         * Construir el HTML completo de la tarjeta
         * Incluye: imagen de perfil, nombre, opinión, fecha, LinkedIn y clasificación
         */
        nuevaTarjeta.innerHTML = `
            <img src="/image/perfil-icono.webp" alt="Foto del usuario">
            <div class="opinion-contenido">
                <h3>${nombre}</h3>
                <p>${opinion}</p>
                <div class="fecha-linkedin-clasificacion">
                    <span class="fecha">Fecha: ${new Date().toLocaleDateString()}</span>

                    ${linkedinHtml}
                    
                    <div class="clasificacion">
                        ${obtenerClasificacionHtml()}
                    </div>
                </div>
            </div>
        `;

        // Agregar la nueva tarjeta a la sección de opiniones
        seccionOpiniones.appendChild(nuevaTarjeta);

        // ====================================================================
        // LIMPIEZA Y CIERRE DEL FORMULARIO
        // ====================================================================

        // Limpiar todos los campos del formulario
        form.reset();

        // Ocultar el formulario
        formulario.style.display = 'none';

        // Limpiar la clasificación de cerebros
        limpiarClasificacion()

        // Mostrar nuevamente el botón "Agregar Opinión"
        botonAgregarOpinion.style.display = 'block'
    });

});