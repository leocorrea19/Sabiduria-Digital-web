document.addEventListener('DOMContentLoaded', function() {
    const tarjetaSuscribirse = document.getElementById('tarjeta-suscribirse');
    const tarjetaDonacion = document.getElementById('tarjeta-donacion');
    const formularioPago = document.getElementById('formulario-pago');

    if (tarjetaSuscribirse) {
        tarjetaSuscribirse.addEventListener('click', function() {
            formularioPago.style.display = 'block'; // Muestra el formulario
        });
    }

    if (tarjetaDonacion) {
        tarjetaDonacion.addEventListener('click', function() {
            formularioPago.style.display = 'block'; // Muestra el formulario
        });
    }
});
