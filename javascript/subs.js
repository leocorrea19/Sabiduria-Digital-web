document.addEventListener('DOMContentLoaded', function() {
    const tarjetaSuscribirse = document.getElementById('tarjeta-suscribirse');
    const formularioPago = document.getElementById('formulario-pago');

    if (tarjetaSuscribirse) {
        tarjetaSuscribirse.addEventListener('click', function() {
            formularioPago.style.display = 'block'; // Muestra el formulario
        });
    }
});
