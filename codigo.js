class Divisas {
    constructor(nombre, valor) {
        this.nombre = nombre;
        this.valor = valor;
    }
}

const dolares = [
    new Divisas('Oficial', 600),
    new Divisas('Blue', 800),
    new Divisas('Tarjeta', 642),
    new Divisas('CCL', 768),
    new Divisas('MEP', 670),
    new Divisas('Mayorista', 349),
];

const divisas = [
    new Divisas('Euro', 700),
    new Divisas('Real', 100),
    new Divisas('Yuan', 90),
    new Divisas('Libra', 440),
    new Divisas('Franco', 395),
    new Divisas('Yen', 70),
];

const navLogin = document.querySelector('#navLogin');
const form = document.querySelector('#formConversor');
const inputCantidad = document.querySelector('#inputCantidad');
const alertaCompleta = document.querySelector('#alertaCompleta');

const submitDolar = document.querySelector('#submitDolar');
const submitDivisas = document.querySelector('#submitDivisas');
const submitPeso = document.querySelector('#submitPeso');

const paridad = document.querySelector('#paridad');

const divisaDolarOficial = document.querySelector('#divisaDolarOficial');
const divisaDolarBlue = document.querySelector('#divisaDolarBlue');
const divisaDolarTarjeta = document.querySelector('#divisaDolarTarjeta');
const divisaDolarCCL = document.querySelector('#divisaDolarCCL');
const divisaDolarMEP = document.querySelector('#divisaDolarMEP');
const divisaDolarMayorista = document.querySelector('#divisaDolarMayorista');

function formatearNumero(numero) {
    const partes = numero.toFixed(2).toString().split('.');
    const parteEntera = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const parteDecimal = partes[1];
    return parteEntera + ',' + parteDecimal;
}

const resultadosDolares = {};
const resultadosDivisas = {};
const resultadosPesos = {};

submitDolar.addEventListener('click', (event) => {
    event.preventDefault();
    actualizarResultadosDolares();
});

submitDivisas.addEventListener('click', (event) => {
    event.preventDefault();
    actualizarResultadosDivisas();
});

submitPeso.addEventListener('click', (event) => {
    event.preventDefault();
    actualizarResultadosPesos();
});

function actualizarResultadosDolares() {
    paridad.innerHTML = 'USD - ARS';
    actualizarEtiquetasDivisas('Oficial', 'Blue', 'Tarjeta', 'CCL', 'MEP', 'Mayorista');
    calcularYMostrarResultados(dolares, resultadosDolares);
}

function actualizarResultadosDivisas() {
    paridad.innerHTML = 'DVS - ARS';
    actualizarEtiquetasDivisas('Euro', 'Real', 'Yuan', 'Libra', 'Franco', 'Yen');
    calcularYMostrarResultados(divisas, resultadosDivisas);
}

function actualizarResultadosPesos() {
    paridad.innerHTML = 'ARS - USD';
    actualizarEtiquetasDivisas('Oficial', 'Blue', 'Tarjeta', 'CCL', 'MEP', 'Mayorista');
    calcularYMostrarResultados(dolares, resultadosPesos, true);
}

function actualizarEtiquetasDivisas(...nombresDivisas) {
    const etiquetasDivisas = [
        divisaDolarOficial, divisaDolarBlue, divisaDolarTarjeta,
        divisaDolarCCL, divisaDolarMEP, divisaDolarMayorista
    ];

    nombresDivisas.forEach((nombre, index) => {
        etiquetasDivisas[index].innerHTML = nombre;
    });
}

function calcularYMostrarResultados(arrayDivisas, resultados, convertirAPesos = false) {
    const cantidad = parseFloat(inputCantidad.value);
    if (!isNaN(cantidad)) {
        if (cantidad !== 0) {
            arrayDivisas.forEach((divisa) => {
                resultados[divisa.nombre] = convertirAPesos ? cantidad / divisa.valor : cantidad * divisa.valor;
                alertaCompleta.innerHTML = '';
            });
        } else {
            alertaCompleta.innerHTML = 'El valor no puede ser 0.';
            arrayDivisas.forEach((divisa) => {
                resultados[divisa.nombre] = 0;
            });
        }
    } else {
        alertaCompleta.innerHTML = 'Completa el campo con un valor numérico.';
        arrayDivisas.forEach((divisa) => {
            resultados[divisa.nombre] = 0;
        });
    }

    mostrarResultadosEnDOM(resultados);
}

function mostrarResultadosEnDOM(resultados) {
    for (const divisa in resultados) {
        const valorElement = document.querySelector(`#valorDolar${divisa}`);
        valorElement.innerHTML = '$' + formatearNumero(resultados[divisa]);
    }
}
const btnGuardarEnHistorial = document.querySelector('#agregarConversionAlHistorial');

btnGuardarEnHistorial.addEventListener('click', () => {
    const cantidad = parseFloat(inputCantidad.value);
    const monedaOrigen = paridad.innerHTML;
    const monedaDestino = resultadosPesos ? 'ARS' : 'USD';

    agregarConversionAlHistorial(cantidad, monedaOrigen, monedaDestino);

    mostrarHistorialEnDOM();
});

function agregarConversionAlHistorial(cantidad, monedaOrigen, monedaDestino) {
    const nuevaConversion = {
        cantidad: cantidad,
        monedaOrigen: monedaOrigen,
        monedaDestino: monedaDestino,
        fecha: new Date().toLocaleString(),
    };

    const historialExistente = localStorage.getItem('conversionHistory') || '[]';
    const conversionHistory = JSON.parse(historialExistente);

    conversionHistory.push(nuevaConversion);

    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
}

function mostrarHistorialEnDOM() {
    const historialExistente = localStorage.getItem('conversionHistory') || '[]';
    const conversionHistory = JSON.parse(historialExistente);

    const historialContainer = document.querySelector('#historialContainer');

    historialContainer.innerHTML = '';

    conversionHistory.forEach((conversion) => {
        const conversionItem = document.createElement('div');
        conversionItem.innerHTML = `
            <p>Fecha: ${conversion.fecha}</p>
            <p>Cantidad: ${conversion.cantidad} ${conversion.monedaOrigen} a ${conversion.monedaDestino}</p>
        `;
        historialContainer.appendChild(conversionItem);
    });
}

mostrarResultadosEnDOM(resultadosDolares);
mostrarHistorialEnDOM();
