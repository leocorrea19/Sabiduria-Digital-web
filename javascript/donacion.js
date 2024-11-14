document.addEventListener('DOMContentLoaded', function() {
    const tarjetaDonacion = document.getElementById('tarjeta-donacion');
    const formularioPago = document.getElementById('formulario-pago');

    if (tarjetaDonacion) {
        tarjetaDonacion.addEventListener('click', function() {
            formularioPago.style.display = 'block'; // Muestra el formulario
        });
    }
});
