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
  const textoNota1 = document.querySelector("#nota1").value.trim();
  const textoNota2 = document.querySelector("#nota2").value.trim();
  const textoNota3 = document.querySelector("#nota3").value.trim();
  if (textoNota1 === "" || textoNota2 === "" || textoNota3 === "") {
    error.textContent = "Completa las tres notas.";
    return;
  }

  // Las notas se convierten antes de sumarlas para evitar concatenar texto.
  const nota1 = Number(textoNota1);
  const nota2 = Number(textoNota2);
  const nota3 = Number(textoNota3);
  const notas = [nota1, nota2, nota3];
  for (const nota of notas) {
    if (!Number.isFinite(nota) || nota < 0 || nota > 10) {
      error.textContent = "Cada nota debe ser un número entre 0 y 10.";
      return;
    }
  }

  const promedio = (nota1 + nota2 + nota3) / 3;
  document.querySelector("#salida-promedio").textContent = `${promedio.toFixed(2)} / 10`;
});

// El botón Limpiar restablece los campos y elimina mensajes anteriores.
formulario.addEventListener("reset", () => {
  limpiarResultado();
  error.textContent = "";
});
