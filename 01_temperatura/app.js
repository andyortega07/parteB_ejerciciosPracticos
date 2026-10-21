// Referencias a los elementos del formulario y del resultado.
const formulario = document.querySelector("#formulario");
const error = document.querySelector("#error");

function limpiarResultado() {
  const salidas = document.querySelectorAll("#resultado strong");
  for (const salida of salidas) {
    salida.textContent = "—";
  }
}

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();
  limpiarResultado();
  error.textContent = "";
  const textoCelsius = document.querySelector("#celsius").value.trim();
  if (textoCelsius === "") {
    error.textContent = "Ingresa la temperatura en Celsius.";
    return;
  }

  // Number convierte el texto del formulario en un número.
  const celsius = Number(textoCelsius);
  if (!Number.isFinite(celsius) || celsius < -273.15) {
    error.textContent = "La temperatura debe ser un número igual o mayor que -273.15 °C.";
    return;
  }

  const fahrenheit = celsius * 9 / 5 + 32;
  const kelvin = celsius + 273.15;
  if (!Number.isFinite(fahrenheit) || !Number.isFinite(kelvin)) {
    error.textContent = "El valor es demasiado grande para realizar la conversión.";
    return;
  }

  // textContent muestra texto en la página; toFixed(2) fija dos decimales.
  document.querySelector("#salida-celsius").textContent = `${celsius.toFixed(2)} °C`;
  document.querySelector("#salida-fahrenheit").textContent = `${fahrenheit.toFixed(2)} °F`;
  document.querySelector("#salida-kelvin").textContent = `${kelvin.toFixed(2)} K`;
});

// El botón Limpiar restablece los campos y elimina mensajes anteriores.
formulario.addEventListener("reset", () => {
  limpiarResultado();
  error.textContent = "";
});
