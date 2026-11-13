const AppError = require('../errors/AppError');
const categoriaRepository = require('../repositories/categoriaRepository');

function validarDados({ nome }) {
  if (!nome || !nome.trim()) {
    throw new AppError('O nome da categoria é obrigatório.');
  }
}

function normalizarDados({ nome, descricao }) {
  return {
    nome: nome.trim(),
    descricao: descricao?.trim() || null,
  };
}

async function garantirNomeUnico(nome, idAtual) {
  const existente = await categoriaRepository.buscarPorNome(nome.trim());
  if (existente && existente.id !== Number(idAtual)) {
    throw new AppError('Já existe uma categoria com esse nome.', 409);
  }
}

async function buscarOuFalhar(id) {
  const categoria = Number.isInteger(Number(id))
    ? await categoriaRepository.buscarPorId(id)
    : null;
  if (!categoria) {
    throw new AppError('Categoria não encontrada.', 404);
  }
  return categoria;
}

async function listar() {
  return categoriaRepository.listarTodas();
}

async function buscar(id) {
  return buscarOuFalhar(id);
}

async function criar(dados = {}) {
  validarDados(dados);
  await garantirNomeUnico(dados.nome);
  return categoriaRepository.criar(normalizarDados(dados));
}

async function atualizar(id, dados = {}) {
  await buscarOuFalhar(id);
  validarDados(dados);
  await garantirNomeUnico(dados.nome, id);
  return categoriaRepository.atualizar(id, normalizarDados(dados));
}

async function excluir(id) {
  await buscarOuFalhar(id);
  const totalPratos = await categoriaRepository.contarPratos(id);
  if (totalPratos > 0) {
    throw new AppError('Não é possível excluir: esta categoria ainda possui pratos.', 409);
  }
  await categoriaRepository.excluir(id);
}

module.exports = { listar, buscar, criar, atualizar, excluir };
