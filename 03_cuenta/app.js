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
  const textoTotal = document.querySelector("#total").value.trim();
  const textoPorcentaje = document.querySelector("#porcentaje").value.trim();
  const textoPersonas = document.querySelector("#personas").value.trim();
  if (textoTotal === "" || textoPorcentaje === "" || textoPersonas === "") {
    error.textContent = "Completa el total, la propina y el número de personas.";
    return;
  }

  const total = Number(textoTotal);
  const porcentaje = Number(textoPorcentaje);
  const personas = Number(textoPersonas);
  if (!Number.isFinite(total) || total < 0 ||
      !Number.isFinite(porcentaje) || porcentaje < 0) {
    error.textContent = "El total y el porcentaje deben ser números iguales o mayores que cero.";
    return;
  }
  if (!Number.isSafeInteger(personas) || personas < 1) {
    error.textContent = "El número de personas debe ser un entero mayor o igual que 1.";
    return;
  }

  // Se conserva la precisión de los cálculos y se redondea solo al mostrar.
  const propina = total * (porcentaje / 100);
  const totalConPropina = total + propina;
  const pagoPorPersona = totalConPropina / personas;
  if (!Number.isFinite(propina) || !Number.isFinite(totalConPropina)) {
    error.textContent = "Los valores son demasiado grandes para realizar el cálculo.";
    return;
  }

  document.querySelector("#salida-propina").textContent = `$${propina.toFixed(2)}`;
  document.querySelector("#salida-total").textContent = `$${totalConPropina.toFixed(2)}`;
  document.querySelector("#salida-persona").textContent = `$${pagoPorPersona.toFixed(2)}`;
});

// El botón Limpiar restablece los campos y elimina mensajes anteriores.
formulario.addEventListener("reset", () => {
  limpiarResultado();
  error.textContent = "";
});
