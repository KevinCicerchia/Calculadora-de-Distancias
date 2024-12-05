// Variables para almacenar las distancias en memoria
const distancias = {
    Distancia1: null,
    Distancia2: null,
    Distancia3: null,
    Distancia4: null, // Total
};

// Inicializar el mapa
document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([-34.603722, -58.381592], 6); // Centrado en Buenos Aires
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map); // Grupo de marcadores

    document.getElementById('calcularDistancia').addEventListener('click', async () => {
        const origen = document.getElementById('origen').value;
        const destino = document.getElementById('destino').value;

        if (!origen || !destino) {
            document.getElementById('resultado').textContent = "Por favor, introduce origen y destino.";
            return;
        }

        try {
            // Geocodificar las direcciones a coordenadas
            const origenCoords = await geocodeAddress(origen);
            const destinoCoords = await geocodeAddress(destino);

            if (!origenCoords || !destinoCoords) {
                document.getElementById('resultado').textContent = "No se encontraron coordenadas para las direcciones ingresadas.";
                return;
            }

            // Calcular la distancia
            const distancia = calcularDistancia(origenCoords, destinoCoords);

            // Mostrar el resultado
            document.getElementById('resultado').textContent = `Distancia: ${distancia.toFixed(2)} km`;

            // Agregar marcadores al mapa
            markerGroup.clearLayers(); // Eliminar marcadores previos
            L.marker(origenCoords).addTo(markerGroup).bindPopup("Origen: " + origen).openPopup();
            L.marker(destinoCoords).addTo(markerGroup).bindPopup("Destino: " + destino);
            map.fitBounds([origenCoords, destinoCoords]); // Ajustar el mapa

            // Guardar distancia actual en memoria temporal para guardado
            distancias.current = distancia.toFixed(2); // Mantener la distancia calculada
        } catch (error) {
            document.getElementById('resultado').textContent = "Error al procesar las direcciones.";
            console.error(error);
        }
    });

    // Manejar el botón "Guardar Distancia"
    document.getElementById('guardarDistancia').addEventListener('click', () => {
        const guardarEn = document.getElementById('guardarEn').value;

        if (!distancias.current) {
            alert('No hay una distancia calculada para guardar.');
            return;
        }

        // Guardar la distancia en el lugar seleccionado
        distancias[guardarEn] = parseFloat(distancias.current);

        // Actualizar la tabla
        document.getElementById(guardarEn).textContent = `${distancias[guardarEn]} km`;

        // Calcular y actualizar la distancia total
        calcularDistanciaTotal();

        // Limpiar la distancia actual después de guardar
        distancias.current = null;
        document.getElementById('resultado').textContent = "Distancia guardada exitosamente.";
    });
});

// Calcular y actualizar la distancia total
function calcularDistanciaTotal() {
    const total = (distancias.Distancia1 || 0) +
                  (distancias.Distancia2 || 0) +
                  (distancias.Distancia3 || 0);
    distancias.Distancia4 = total;

    // Actualizar la celda de la tabla
    document.getElementById('Distancia4').textContent = `${total.toFixed(2)} km`;
}

  // Manejar el botón "Borrar Distancia"
  document.getElementById('borrarDistancia').addEventListener('click', () => {
    const borrarDe = document.getElementById('borrarDe').value;

    // Verificar si hay algo que borrar
    if (distancias[borrarDe] === null || distancias[borrarDe] === undefined) {
        alert('No hay ninguna distancia guardada en la selección.');
        return;
    }

    // Borrar la distancia seleccionada
    distancias[borrarDe] = null;

    // Actualizar la tabla
    document.getElementById(borrarDe).textContent = '-';

    // Recalcular la distancia total
    calcularDistanciaTotal();

    document.getElementById('resultado').textContent = `Distancia ${borrarDe} borrada exitosamente.`;
});

// Función para geocodificar una dirección
async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            return [parseFloat(lat), parseFloat(lon)];
        } else {
            return null; // Dirección no encontrada
        }
    } catch (error) {
        console.error("Error al geocodificar la dirección:", error);
        return null;
    }
}

// Función para calcular la distancia entre dos puntos usando la fórmula de Haversine
function calcularDistancia([lat1, lon1], [lat2, lon2]) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = degToRad(lat2 - lat1);
    const dLon = degToRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Convertir grados a radianes
function degToRad(deg) {
    return deg * (Math.PI / 180);
}
