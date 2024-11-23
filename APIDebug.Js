// Función para guardar manualmente un valor en la tabla
function guardarValorDebug() {
    const valor = document.getElementById('valorDebug').value; // Número ingresado por el usuario
    const campoSeleccionado = document.getElementById('guardarEn').value; // Campo seleccionado
    const celda = document.getElementById(campoSeleccionado);

    if (!valor) {
        alert('Por favor, introduce un valor numérico.');
        return;
    }

    if (celda) {
        celda.textContent = `${valor} km`; // Guarda el valor en la celda seleccionada
        alert(`El valor ${valor} ha sido guardado en ${campoSeleccionado}.`);
    } else {
        alert('Error: No se pudo encontrar el campo seleccionado.');
    }
}

// Evento para el botón de depuración
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('guardarDebug').addEventListener('click', guardarValorDebug);
});