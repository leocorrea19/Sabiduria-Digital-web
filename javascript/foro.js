document.addEventListener('DOMContentLoaded', function() {

    // Selecciona el botón y la sección donde se añadirán las opiniones
    const botonAgregarOpinion = document.querySelector('.agregar-opinion');
    const seccionOpiniones = document.querySelector('.opiniones');
    const botonCancelar = document.querySelector('.cancelar');

    // Selecciona el formulario y configúralo para que esté oculto inicialmente
    const formulario = document.getElementById('formulario-opinion');
    formulario.style.display = 'none';

    // Mostrar el formulario al hacer clic en el botón y ocultar el botón al abrir el formulario
    botonAgregarOpinion.addEventListener('click', function() {
        formulario.style.display = 'block';
        botonAgregarOpinion.style.display = 'none';
    });

    botonCancelar.addEventListener('click', function() {
        form.reset();
        formulario.style.display = 'none';

        botonAgregarOpinion.style.display = 'block'

        limpiarClasificacion()
    });

    /* Seccion clasificacion */
const clasificacionIngreso = document.querySelectorAll('.clasificacion-ingreso');

let clasificacionSeleccionada = -1; // Variable para almacenar la clasificación seleccionada

function clasificacionFinal() {
    clasificacionIngreso.forEach(function(clasificaciones, index) {
        clasificaciones.addEventListener('click', function() {
            // Se pintan y despintan los cerebros según el índice seleccionado
            for (let i = 0; i <= index; i++) {
                clasificacionIngreso[i].classList.add('checked'); 
            }
            for (let i = index + 1; i < clasificacionIngreso.length; i++) {
                clasificacionIngreso[i].classList.remove('checked');
            }

            clasificacionSeleccionada = index; // Guarda el índice seleccionado
        });
    });
}
clasificacionFinal();

/* Segun el indice pasado se pasa el html con la cantidad de cerebros pintados(clasifiacion del usuario)  */
function obtenerClasificacionHtml() {
    switch (clasificacionSeleccionada) {
        case 0:
            return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>`;
        case 1:
            return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>`;
        case 2:
            return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>`;
        case 3:
            return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm'></i>`;
        case 4:
            return `<i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>
                    <i class='bx bx-brain bx-sm' style='color:#f0a73a'></i>`;
        default:
            return `<i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>
                    <i class='bx bx-brain bx-sm'></i>`;
    }
}

/* Limpia los cerebros seleccionados */
function limpiarClasificacion() {
    clasificacionIngreso.forEach((clasificacion) => {
        clasificacion.classList.remove('checked');
    });
    clasificacionSeleccionada = -1; // Restablece la selección
}

    // Agregar la nueva opinión a la lista al enviar el formulario
    const form = document.getElementById('nueva-opinion-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que se recargue la página

        // Obtener los valores de los campos del formulario
        const nombre = 'Leonel Correa';
        const linkedin = 'https://www.linkedin.com/in/leonel-javier-correa/';
        const opinion = document.getElementById('opinion').value;

        // Crear una nueva tarjeta de opinión
        const nuevaTarjeta = document.createElement('div');
        nuevaTarjeta.classList.add('opinion-tarjeta');

        // Si el usuario ingresó un enlace de LinkedIn, inclúyelo
        const linkedinHtml = linkedin ? `<a href="${linkedin}" target="_blank"><i class="bx bxl-linkedin-square bx-sm" ></i> LinkedIn.</a>` : '';

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

        // Limpiar y ocultar el formulario
        form.reset();
        formulario.style.display = 'none';

        limpiarClasificacion()

        // Mostrar de nuevo el botón "Agregar Opinión"
        botonAgregarOpinion.style.display = 'block'
    });

});