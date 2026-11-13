function ehIdValido(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

function textoPreenchido(valor) {
  return typeof valor === 'string' && valor.trim() !== '';
}

module.exports = { ehIdValido, textoPreenchido };
