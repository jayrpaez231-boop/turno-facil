// Datos de ejemplo. En un SaaS real esto vendría de una base de datos
const servicios = [
    { id: 1, nombre: "Corte de Cabello", precio: "$20.000" },
    { id: 2, nombre: "Barba", precio: "$12.000" },
    { id: 3, nombre: "Corte + Barba", precio: "$28.000" }
];
const horasDisponibles = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

let servicioSeleccionado = null;
let horaSeleccionada = null;

// Cargar servicios
function cargarServicios() {
    const contenedor = document.getElementById('servicios');
    servicios.forEach(s => {
        contenedor.innerHTML += `
            <div class="servicio" onclick="seleccionarServicio(${s.id})">
                <b>${s.nombre}</b> - ${s.precio}
            </div>
        `;
    });
}

// Cargar horarios según la fecha
document.getElementById('fecha').addEventListener('change', (e) => {
    cargarHorarios(e.target.value);
});

function cargarHorarios(fecha) {
    const contenedor = document.getElementById('horarios');
    contenedor.innerHTML = '';
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    const horasOcupadas = citas.filter(c => c.fecha === fecha).map(c => c.hora);

    horasDisponibles.forEach(hora => {
        const ocupado = horasOcupadas.includes(hora);
        contenedor.innerHTML += `
            <span class="horario ${ocupado? 'ocupado' : ''}"
                  onclick="${ocupado? '' : `seleccionarHora('${hora}')`}">
                ${hora}
            </span>
        `;
    });
}

function seleccionarServicio(id) {
    servicioSeleccionado = id;
    alert(`Seleccionaste: ${servicios.find(s => s.id === id).nombre}`);
}

function seleccionarHora(hora) {
    document.querySelectorAll('.horario').forEach(h => h.classList.remove('seleccionado'));
    event.target.classList.add('seleccionado');
    horaSeleccionada = hora;
}

// Guardar cita
document.getElementById('btnReservar').addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const fecha = document.getElementById('fecha').value;
    const mensaje = document.getElementById('mensaje');

    if (!servicioSeleccionado ||!horaSeleccionada ||!nombre ||!telefono ||!fecha) {
        mensaje.innerHTML = "⚠️ Por favor completa todos los campos";
        mensaje.style.color = "red";
        return;
    }

    const nuevaCita = { id: Date.now(), servicio: servicioSeleccionado, fecha, hora: horaSeleccionada, nombre, telefono };

    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.push(nuevaCita);
    localStorage.setItem('citas', JSON.stringify(citas));

    mensaje.innerHTML = `✅ ¡Cita reservada para ${fecha} a las ${horaSeleccionada}!`;
    mensaje.style.color = "green";

    cargarHorarios(fecha); // Recargar horarios
});

// Iniciar
cargarServicios();
// Poner fecha de hoy por defecto
document.getElementById('fecha').valueAsDate = new Date();
cargarHorarios(new Date().toISOString().split('T')[0]);