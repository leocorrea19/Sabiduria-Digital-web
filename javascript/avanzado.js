/**
 * @fileoverview Módulo de formaciones avanzadas
 * Renderiza sliders de formaciones académicas por categoría (ingeniería, licenciatura, tecnicatura, curso)
 * Incluye funcionalidad para guardar formaciones si el usuario está autenticado
 * @author Sabiduría Digital
 * @version 1.0.0
 */

// javascript/avanzado.js

import '../css/avanzado.css';

// URL base de la API de formaciones obtenida de las variables de entorno
const API_URL = `${import.meta.env.VITE_API_URL}/formaciones`;

// ============================================================================
// FUNCIÓN PRINCIPAL DE RENDERIZADO
// ============================================================================

/**
 * Función reutilizable para renderizar un slider completo de formaciones
 * Obtiene datos de la API, renderiza las tarjetas y configura la navegación del slider
 * 
 * @async
 * @function renderizarCategoria
 * @param {string} categoria - El nombre de la categoría (ej. "ingenieria", "licenciatura")
 * @param {string} sliderSelector - El ID del contenedor del slider (ej. "#id-slider-ingenieria")
 * @param {string} btnLeftSelector - El selector CSS del botón izquierdo de navegación
 * @param {string} btnRightSelector - El selector CSS del botón derecho de navegación
 * @returns {Promise<void>}
 * 
 * @example
 * renderizarCategoria(
 *     'ingenieria', 
 *     '#id-slider-ingenieria', 
 *     '.btn-left-ingenieria', 
 *     '.btn-right-ingenieria'
 * );
 */
async function renderizarCategoria(categoria, sliderSelector, btnLeftSelector, btnRightSelector) {

    // ========================================================================
    // VERIFICACIÓN DE AUTENTICACIÓN
    // ========================================================================

    /**
     * Verificar si el usuario está logueado
     * El token JWT se usa para autenticar peticiones protegidas
     */
    const token = localStorage.getItem('token');

    // ========================================================================
    // OBTENCIÓN DE DATOS DE LA API
    // ========================================================================

    let formaciones = [];

    try {
        /**
         * Realizar petición GET a la API con filtro por categoría
         * Query parameter: ?categoria=ingenieria
         */
        const response = await fetch(`${API_URL}?categoria=${categoria}`);

        // Validar respuesta del servidor
        if (!response.ok) throw new Error(`Error al cargar ${categoria}`);

        // Parsear respuesta JSON
        formaciones = await response.json();

    } catch (error) {
        // Registrar error en consola y salir
        console.error(error);
        return;
    }

    // ========================================================================
    // PREPARACIÓN DEL CONTENEDOR
    // ========================================================================

    /**
     * Buscar el contenedor del slider en el DOM
     */
    const divSlider = document.querySelector(sliderSelector);

    // Si no existe el contenedor, salir
    if (!divSlider) return;

    // Limpiar contenido previo del slider
    divSlider.innerHTML = '';

    // ========================================================================
    // RENDERIZADO DE FORMACIONES
    // ========================================================================

    /**
     * Iterar sobre cada formación y crear su tarjeta en el slider
     */
    formaciones.forEach(dato => {

        // ====================================================================
        // CREACIÓN DE LA SECCIÓN DEL SLIDER
        // ====================================================================

        /**
         * Crear contenedor principal para cada formación
         * Cada sección representa una "slide" en el slider
         */
        const divSliderSection = document.createElement('div');
        divSliderSection.classList.add('slider-section', `slider-section-${categoria}`);

        // ====================================================================
        // ELEMENTOS DE INFORMACIÓN DE LA FORMACIÓN
        // ====================================================================

        /**
         * Crear elemento para el título de la formación
         */
        const nombreDeLaCarrera = document.createElement('h3');
        nombreDeLaCarrera.classList.add('titulo-de-la-carrera');
        nombreDeLaCarrera.textContent = dato.titulo;

        /**
         * Crear elemento para la descripción de la formación
         */
        const infoDeLaCarrera = document.createElement('p');
        infoDeLaCarrera.classList.add('info-sobre-la-carrera');
        infoDeLaCarrera.textContent = dato.descripcion;

        /**
         * Crear subtítulo para la lista de instituciones
         */
        const subTituloCarrera = document.createElement('h4');
        subTituloCarrera.classList.add('subtitulo-para-las-facultades');
        subTituloCarrera.textContent = "Lo podes estudiar en las siguientes instituciones";

        // Añadir elementos al contenedor de la sección
        divSliderSection.appendChild(nombreDeLaCarrera);
        divSliderSection.appendChild(infoDeLaCarrera);
        divSliderSection.appendChild(subTituloCarrera);

        // ====================================================================
        // BOTÓN GUARDAR FORMACIÓN (Solo para usuarios autenticados)
        // ====================================================================

        /**
         * Si el usuario está logueado, mostrar botón para guardar la formación
         * Permite al usuario agregar esta formación a su lista de guardados
         */
        if (token) {
            /**
             * Crear botón de guardar
             */
            const guardarBtn = document.createElement('button');
            guardarBtn.textContent = 'Guardar Formación';
            guardarBtn.classList.add('btn-guardar');

            // Almacenar el ID de la formación en un data attribute
            guardarBtn.dataset.formacionId = dato._id;

            /**
             * Manejador de clic para guardar la formación
             * Realiza petición PUT a la API para agregar a cursos guardados
             */
            guardarBtn.addEventListener('click', async (e) => {
                // Obtener el ID de la formación del data attribute
                const id = e.target.dataset.formacionId;

                try {
                    /**
                     * Realizar petición PUT a la API protegida
                     * Requiere token de autenticación en el header
                     */
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/save-course/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    // Validar respuesta
                    if (!response.ok) throw new Error('Error al guardar');

                    // Actualizar UI: cambiar texto y deshabilitar botón
                    e.target.textContent = '¡Guardado!';
                    e.target.disabled = true;

                } catch (error) {
                    // Mostrar error al usuario
                    alert(error.message);
                }
            });

            // Añadir botón a la sección
            // divSliderSection.appendChild(guardarBtn);
        }

        // ====================================================================
        // RENDERIZADO DE INSTITUCIONES
        // ====================================================================

        /**
         * Iterar sobre cada institución donde se puede estudiar la formación
         * Crear tarjetas para cada institución con nombre, enlace y mensaje
         */
        dato.instituciones.forEach(facultad => {
            /**
             * Crear contenedor para cada institución
             */
            const divSliderFacultades = document.createElement('div');
            divSliderFacultades.classList.add('slider-facultades');

            /**
             * Crear enlace al sitio web de la institución
             */
            const nombreFacultad = document.createElement('a');
            nombreFacultad.classList.add('nombre-de-la-facultad');
            nombreFacultad.textContent = facultad.nombre_instituto;
            nombreFacultad.href = facultad.url;
            nombreFacultad.target = "_blank"; // Abrir en nueva pestaña

            /**
             * Crear elemento para el mensaje/descripción de la institución
             */
            const mensajeCarrera = document.createElement('p');
            mensajeCarrera.classList.add('info-sobre-la-facultad');
            mensajeCarrera.textContent = facultad.mensaje;

            // Añadir elementos al contenedor de la institución
            divSliderFacultades.appendChild(nombreFacultad);
            divSliderFacultades.appendChild(mensajeCarrera);

            // Añadir institución a la sección de la formación
            divSliderSection.appendChild(divSliderFacultades);
        });

        // Añadir la sección completa al slider
        divSlider.appendChild(divSliderSection);
    });

    // ========================================================================
    // LÓGICA DE NAVEGACIÓN DEL SLIDER
    // ========================================================================

    /**
     * Configurar los botones de navegación izquierda/derecha
     * Permite al usuario navegar entre las diferentes formaciones
     */
    const btnLeft = document.querySelector(btnLeftSelector);
    const btnRight = document.querySelector(btnRightSelector);
    const sliderSection = divSlider.querySelectorAll('.slider-section');

    // Validar que existan los botones y las secciones
    if (!btnLeft || !btnRight || sliderSection.length === 0) return;

    /**
     * Variables de control del slider
     */
    let operacion = 0; // Porcentaje de desplazamiento actual
    let widthItem = 100 / sliderSection.length; // Ancho de cada slide en porcentaje
    let counter = 0; // Índice del slide actual

    /**
     * Función para mover el slider hacia la derecha
     * Avanza al siguiente slide con animación
     * 
     * @function moverALaDerecha
     * @returns {void}
     */
    function moverALaDerecha() {
        // Si estamos en el último slide, volver al primero (loop)
        if (counter >= sliderSection.length - 1) {
            counter = 0;
            operacion = 0;
        } else {
            // Avanzar al siguiente slide
            counter++;
            operacion = operacion + widthItem;
        }

        // Aplicar transformación CSS con animación
        divSlider.style.transform = `translate(-${operacion}%)`;
        divSlider.style.transition = 'transform ease 1s';
    }

    /**
     * Función para mover el slider hacia la izquierda
     * Retrocede al slide anterior con animación
     * 
     * @function moverALaIzquierda
     * @returns {void}
     */
    function moverALaIzquierda() {
        counter--;

        // Si estamos en el primer slide, ir al último (loop)
        if (counter < 0) {
            counter = sliderSection.length - 1;
            operacion = widthItem * (sliderSection.length - 1);
        } else {
            // Retroceder al slide anterior
            operacion = operacion - widthItem;
        }

        // Aplicar transformación CSS con animación
        divSlider.style.transform = `translate(-${operacion}%)`;
        divSlider.style.transition = 'transform ease 1s';
    }

    // Asignar event listeners a los botones de navegación
    btnLeft.addEventListener('click', moverALaIzquierda);
    btnRight.addEventListener('click', moverALaDerecha);
}


// ============================================================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================================================

/**
 * Event listener que se ejecuta cuando el DOM está completamente cargado
 * Inicializa todos los sliders de formaciones y funcionalidades adicionales
 */
window.addEventListener('DOMContentLoaded', function () {

    // ========================================================================
    // RENDERIZADO DE SLIDERS POR CATEGORÍA
    // ========================================================================

    /**
     * Renderizar slider de Ingenierías
     */
    renderizarCategoria(
        'ingenieria',
        '#id-slider-ingenieria',
        '.btn-left-ingenieria',
        '.btn-right-ingenieria'
    );

    /**
     * Renderizar slider de Licenciaturas
     */
    renderizarCategoria(
        'licenciatura',
        '#id-slider-licenciatura',
        '.btn-left-licenciatura',
        '.btn-right-licenciatura'
    );

    /**
     * Renderizar slider de Tecnicaturas
     */
    renderizarCategoria(
        'tecnicatura',
        '#id-slider-tecnicatura',
        '.btn-left-tecnicatura',
        '.btn-right-tecnicatura'
    );

    /**
     * Renderizar slider de Cursos
     */
    renderizarCategoria(
        'curso',
        '#id-slider-curso',
        '.btn-left-curso',
        '.btn-right-curso'
    );

    // ========================================================================
    // FUNCIONALIDAD DE SCROLL TO TOP
    // ========================================================================

    /**
     * Botón para volver al inicio de la página
     * Implementa scroll suave (smooth scrolling)
     */
    document.getElementById('btn-para-arriba').addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});