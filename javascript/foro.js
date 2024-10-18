// Selecciona el botón y la sección donde se añadirán las opiniones
const botonAgregarOpinion = document.querySelector('.agregar-opinion');
const seccionOpiniones = document.querySelector('.opiniones');

// Selecciona el formulario y configúralo para que esté oculto inicialmente
const formulario = document.getElementById('formulario-opinion');
formulario.style.display = 'none';

// Mostrar el formulario al hacer clic en el botón y ocultar el botón al abrir el formulario
botonAgregarOpinion.addEventListener('click', function() {
    formulario.style.display = 'block';
    botonAgregarOpinion.style.display = 'none';
});

// Agregar la nueva opinión a la lista al enviar el formulario
const form = document.getElementById('nueva-opinion-form');
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que se recargue la página

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const linkedin = document.getElementById('linkedin').value;
    const opinion = document.getElementById('opinion').value;

    // Crear una nueva tarjeta de opinión
    const nuevaTarjeta = document.createElement('div');
    nuevaTarjeta.classList.add('opinion-tarjeta');

    // Si el usuario ingresó un enlace de LinkedIn, inclúyelo
    const linkedinHtml = linkedin ? `<a href="${linkedin}" target="_blank">Ver usuario en LinkedIn.</a>` : '';

    nuevaTarjeta.innerHTML = `
        <img src="image/usuario_default2.png" alt="Foto del usuario">
        <div class="opinion-contenido">
            <h3>${nombre}</h3>
            <p>${opinion}</p>
            ${linkedinHtml} <br>
            <span class="fecha">Fecha: ${new Date().toLocaleDateString()}</span>
        </div>
    `;

    // Agregar la nueva tarjeta a la sección de opiniones
    seccionOpiniones.appendChild(nuevaTarjeta);

    // Limpiar y ocultar el formulario
    form.reset();
    formulario.style.display = 'none';

    // Mostrar de nuevo el botón "Agregar Opinión"
    botonAgregarOpinion.style.display = 'block'
});


