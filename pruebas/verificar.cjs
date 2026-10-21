const fs = require('fs');
const vm = require('vm');
const path = require('path');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const report = [];

// Este entorno mínimo comprueba la lógica real de app.js, sin simular un navegador completo.
function load(folder) {
  const elements = {};
  const handlers = {};
  const html = fs.readFileSync(path.join(root, folder, 'index.html'), 'utf8');
  assert.match(html, /<script src="app\.js" defer><\/script>/);
  for (const match of html.matchAll(/id="([^"]+)"/g)) {
    elements['#' + match[1]] = { value: '', textContent: '—' };
  }
  elements['#error'].textContent = '';
  elements['#formulario'].addEventListener = (type, handler) => { handlers[type] = handler; };
  const document = {
    querySelector: selector => {
      assert.ok(elements[selector], 'Existe el elemento ' + selector);
      return elements[selector];
    },
    querySelectorAll: () => Object.entries(elements).filter(([key]) => key.startsWith('#salida-')).map(([,value]) => value)
  };
  const code = fs.readFileSync(path.join(root, folder, 'app.js'), 'utf8');
  assert.match(code, /Number\(/);
  assert.doesNotMatch(code, /\bvar\s|\balert\s*\(/);
  vm.runInNewContext(code, { document }, { filename: folder + '/app.js' });
  return {
    run(values, expected, errorExpected = false) {
      for (const [id, el] of Object.entries(elements)) if ('value' in el) el.value = '';
      for (const [id, value] of Object.entries(values)) elements['#' + id].value = String(value);
      handlers.submit({ preventDefault() {} });
      if (errorExpected) {
        assert.notEqual(elements['#error'].textContent, '');
        for (const [id, el] of Object.entries(elements)) if (id.startsWith('#salida-')) assert.equal(el.textContent, '—');
      } else {
        assert.equal(elements['#error'].textContent, '');
        for (const [id, value] of Object.entries(expected)) assert.equal(elements['#' + id].textContent, value);
      }
      report.push({ ejercicio: folder, entrada: values, resultado: errorExpected ? elements['#error'].textContent : expected, estado: 'Correcto' });
    },
    reset() {
      handlers.reset();
      assert.equal(elements['#error'].textContent, '');
      for (const [id, el] of Object.entries(elements)) if (id.startsWith('#salida-')) assert.equal(el.textContent, '—');
      report.push({ejercicio: folder, prueba:'Restablecer salidas y mensaje mediante el evento reset', estado:'Correcto'});
    }
  };
}
const temp = load('01_temperatura');
temp.run({celsius:25}, {'salida-celsius':'25.00 °C','salida-fahrenheit':'77.00 °F','salida-kelvin':'298.15 K'});
temp.run({celsius:0}, {'salida-fahrenheit':'32.00 °F','salida-kelvin':'273.15 K'});
temp.run({celsius:-40}, {'salida-fahrenheit':'-40.00 °F','salida-kelvin':'233.15 K'});
temp.run({celsius:-273.15}, {'salida-kelvin':'0.00 K'});
temp.run({celsius:''}, {}, true);
temp.run({celsius:-274}, {}, true);
temp.run({celsius:'abc'}, {}, true);
temp.run({celsius:'1e309'}, {}, true);
temp.run({celsius:'1e308'}, {}, true);
temp.reset();

const avg = load('02_promedio');
avg.run({nota1:8,nota2:9,nota3:10}, {'salida-promedio':'9.00 / 10'});
avg.run({nota1:7.5,nota2:8.2,nota3:9}, {'salida-promedio':'8.23 / 10'});
avg.run({nota1:0,nota2:0,nota3:0}, {'salida-promedio':'0.00 / 10'});
avg.run({nota1:10,nota2:10,nota3:10}, {'salida-promedio':'10.00 / 10'});
avg.run({nota1:8,nota2:'',nota3:10}, {}, true);
avg.run({nota1:11,nota2:9,nota3:10}, {}, true);
avg.run({nota1:-1,nota2:9,nota3:10}, {}, true);
avg.run({nota1:'abc',nota2:9,nota3:10}, {}, true);
avg.reset();

const bill = load('03_cuenta');
bill.run({total:100,porcentaje:10,personas:4}, {'salida-propina':'$10.00','salida-total':'$110.00','salida-persona':'$27.50'});
bill.run({total:80,porcentaje:0,personas:2}, {'salida-propina':'$0.00','salida-total':'$80.00','salida-persona':'$40.00'});
bill.run({total:10,porcentaje:0,personas:3}, {'salida-propina':'$0.00','salida-total':'$10.00','salida-persona':'$3.33'});
bill.run({total:0,porcentaje:10,personas:1}, {'salida-propina':'$0.00','salida-total':'$0.00','salida-persona':'$0.00'});
bill.run({total:100,porcentaje:10,personas:0}, {}, true);
bill.run({total:100,porcentaje:10,personas:2.5}, {}, true);
bill.run({total:-1,porcentaje:10,personas:2}, {}, true);
bill.run({total:100,porcentaje:-10,personas:2}, {}, true);
bill.run({total:100,porcentaje:'',personas:2}, {}, true);
bill.run({total:'1e308',porcentaje:100,personas:2}, {}, true);
bill.reset();

fs.mkdirSync(path.join(root, 'evidencias'), {recursive:true});
fs.writeFileSync(path.join(root, 'evidencias', 'pruebas_logica.json'), JSON.stringify({
  metodo:'Ejecución de los app.js originales con Node.js y un entorno DOM mínimo. No es una prueba en navegador ni una captura de pantalla.',
  total:report.length, resultados:report
}, null, 2));
console.log(`${report.length} comprobaciones correctas. Sin excepciones al ejecutar los tres app.js.`);
