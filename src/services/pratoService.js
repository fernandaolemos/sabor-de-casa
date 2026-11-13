const AppError = require('../errors/AppError');
const pratoRepository = require('../repositories/pratoRepository');
const categoriaService = require('./categoriaService');
const { ehIdValido, textoPreenchido } = require('./validacoes');

function validarDados({ nome, preco }) {
  if (!textoPreenchido(nome)) {
    throw new AppError('O nome do prato é obrigatório.');
  }
  if (preco === undefined || preco === null || preco === '') {
    throw new AppError('O preço do prato é obrigatório.');
  }
  if (!Number.isFinite(Number(preco)) || Number(preco) <= 0) {
    throw new AppError('O preço deve ser maior que zero.');
  }
}

function normalizarDados({ nome, descricao, preco, disponivel }, categoriaId) {
  return {
    nome: nome.trim(),
    descricao: descricao?.trim() || null,
    preco: Number(preco),
    disponivel: disponivel !== false,
    categoriaId: Number(categoriaId),
  };
}

async function buscarOuFalhar(id) {
  const prato = ehIdValido(id) ? await pratoRepository.buscarPorId(id) : null;
  if (!prato) {
    throw new AppError('Prato não encontrado.', 404);
  }
  return prato;
}

async function listarPorCategoria(categoriaId) {
  await categoriaService.buscar(categoriaId);
  return pratoRepository.listarPorCategoria(categoriaId);
}

async function buscar(id) {
  return buscarOuFalhar(id);
}

async function criar(categoriaId, dados = {}) {
  await categoriaService.buscar(categoriaId);
  validarDados(dados);
  return pratoRepository.criar(normalizarDados(dados, categoriaId));
}

async function atualizar(id, dados = {}) {
  const pratoAtual = await buscarOuFalhar(id);
  const categoriaId = dados.categoriaId ?? pratoAtual.categoria_id;
  await categoriaService.buscar(categoriaId);
  validarDados(dados);
  return pratoRepository.atualizar(id, normalizarDados(dados, categoriaId));
}

async function excluir(id) {
  await buscarOuFalhar(id);
  await pratoRepository.excluir(id);
}

module.exports = { listarPorCategoria, buscar, criar, atualizar, excluir };
