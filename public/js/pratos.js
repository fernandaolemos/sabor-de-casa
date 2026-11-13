import { categoriaApi, pratoApi } from './api.js';
import {
  mostrarMensagem,
  esconderMensagem,
  mostrarErroCampo,
  limparErrosCampos,
  criarElemento,
  criarBotao,
  criarCelula,
  formatarPreco,
  lerParametroDaUrl,
} from './ui.js';

const categoriaId = lerParametroDaUrl('categoriaId');
const nomeCategoria = document.getElementById('nome-categoria');
const formulario = document.getElementById('formulario-prato');
const tituloFormulario = document.getElementById('titulo-formulario');
const campoNome = document.getElementById('nome');
const campoDescricao = document.getElementById('descricao');
const campoPreco = document.getElementById('preco');
const campoDisponivel = document.getElementById('disponivel');
const botaoSalvar = document.getElementById('botao-salvar');
const botaoCancelar = document.getElementById('botao-cancelar');
const corpoTabela = document.getElementById('lista-pratos');
const tabela = document.getElementById('tabela-pratos');
const estadoVazio = document.getElementById('estado-vazio');

let pratoEmEdicao = null;

function lerDadosDoFormulario() {
  return {
    nome: campoNome.value,
    descricao: campoDescricao.value,
    preco: campoPreco.value === '' ? '' : Number(campoPreco.value),
    disponivel: campoDisponivel.checked,
  };
}

function validarFormulario(dados) {
  limparErrosCampos(formulario);
  let valido = true;
  if (!dados.nome.trim()) {
    mostrarErroCampo(campoNome, 'O nome do prato é obrigatório.');
    valido = false;
  }
  if (dados.preco === '') {
    mostrarErroCampo(campoPreco, 'O preço do prato é obrigatório.');
    valido = false;
  } else if (!(dados.preco > 0)) {
    mostrarErroCampo(campoPreco, 'O preço deve ser maior que zero.');
    valido = false;
  }
  return valido;
}

function iniciarEdicao(prato) {
  pratoEmEdicao = prato;
  limparErrosCampos(formulario);
  campoNome.value = prato.nome;
  campoDescricao.value = prato.descricao ?? '';
  campoPreco.value = prato.preco;
  campoDisponivel.checked = prato.disponivel;
  tituloFormulario.textContent = `Editar prato: ${prato.nome}`;
  botaoCancelar.hidden = false;
  formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
  campoNome.focus();
}

function encerrarEdicao() {
  pratoEmEdicao = null;
  formulario.reset();
  campoDisponivel.checked = true;
  limparErrosCampos(formulario);
  tituloFormulario.textContent = 'Novo prato';
  botaoCancelar.hidden = true;
}

function criarSeloDisponibilidade(disponivel) {
  return criarElemento('span', {
    classe: disponivel ? 'selo selo--disponivel' : 'selo selo--indisponivel',
    texto: disponivel ? 'Disponível' : 'Esgotado',
  });
}

function criarLinhaPrato(prato) {
  const acoes = criarElemento('div', { classe: 'acoes' }, [
    criarBotao('Editar', () => iniciarEdicao(prato)),
    criarBotao('Excluir', () => excluirPrato(prato), 'botao botao--perigo'),
  ]);

  return criarElemento('tr', {}, [
    criarCelula('Prato', criarElemento('strong', { texto: prato.nome })),
    criarCelula('Descrição', prato.descricao || '—'),
    criarCelula('Preço', formatarPreco(prato.preco)),
    criarCelula('Situação', criarSeloDisponibilidade(prato.disponivel)),
    criarCelula('Ações', acoes),
  ]);
}

async function carregarPratos() {
  const pratos = await pratoApi.listarPorCategoria(categoriaId);
  corpoTabela.replaceChildren(...pratos.map(criarLinhaPrato));
  tabela.hidden = pratos.length === 0;
  estadoVazio.hidden = pratos.length > 0;
}

async function salvarPrato(evento) {
  evento.preventDefault();
  esconderMensagem();
  const dados = lerDadosDoFormulario();
  if (!validarFormulario(dados)) {
    return;
  }

  botaoSalvar.disabled = true;
  try {
    if (pratoEmEdicao) {
      await pratoApi.atualizar(pratoEmEdicao.id, dados);
    } else {
      await pratoApi.criar(categoriaId, dados);
    }
    mostrarMensagem(`Prato "${dados.nome.trim()}" salvo com sucesso.`, 'sucesso');
    encerrarEdicao();
    await carregarPratos();
  } catch (erro) {
    mostrarMensagem(erro.message);
  } finally {
    botaoSalvar.disabled = false;
  }
}

async function excluirPrato(prato) {
  if (!confirm(`Deseja excluir o prato "${prato.nome}"?`)) {
    return;
  }
  try {
    await pratoApi.excluir(prato.id);
    if (pratoEmEdicao?.id === prato.id) {
      encerrarEdicao();
    }
    mostrarMensagem(`Prato "${prato.nome}" excluído com sucesso.`, 'sucesso');
    await carregarPratos();
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

async function iniciarTela() {
  try {
    const categoria = await categoriaApi.buscar(categoriaId);
    nomeCategoria.textContent = categoria.nome;
    document.title = `${categoria.nome} | Sabor de Casa`;
    await carregarPratos();
  } catch (erro) {
    mostrarMensagem(erro.message);
    formulario.hidden = true;
  }
}

formulario.addEventListener('submit', salvarPrato);
botaoCancelar.addEventListener('click', encerrarEdicao);
iniciarTela();
