import { categoriaApi } from './api.js';
import {
  mostrarMensagem,
  esconderMensagem,
  guardarMensagemParaProximaTela,
  mostrarErroCampo,
  limparErrosCampos,
  lerParametroDaUrl,
} from './ui.js';

const idCategoria = lerParametroDaUrl('id');
const formulario = document.getElementById('formulario-categoria');
const titulo = document.getElementById('titulo-formulario');
const campoNome = document.getElementById('nome');
const campoDescricao = document.getElementById('descricao');
const botaoSalvar = document.getElementById('botao-salvar');

function lerDadosDoFormulario() {
  return {
    nome: campoNome.value,
    descricao: campoDescricao.value,
  };
}

function validarFormulario(dados) {
  limparErrosCampos(formulario);
  if (!dados.nome.trim()) {
    mostrarErroCampo(campoNome, 'O nome da categoria é obrigatório.');
    campoNome.focus();
    return false;
  }
  return true;
}

async function preencherParaEdicao() {
  titulo.textContent = 'Editar categoria';
  document.title = 'Editar categoria | Sabor de Casa';
  try {
    const categoria = await categoriaApi.buscar(idCategoria);
    campoNome.value = categoria.nome;
    campoDescricao.value = categoria.descricao ?? '';
  } catch (erro) {
    mostrarMensagem(erro.message);
    botaoSalvar.disabled = true;
  }
}

async function salvarCategoria(evento) {
  evento.preventDefault();
  esconderMensagem();
  const dados = lerDadosDoFormulario();
  if (!validarFormulario(dados)) {
    return;
  }

  botaoSalvar.disabled = true;
  try {
    if (idCategoria) {
      await categoriaApi.atualizar(idCategoria, dados);
    } else {
      await categoriaApi.criar(dados);
    }
    guardarMensagemParaProximaTela(`Categoria "${dados.nome.trim()}" salva com sucesso.`);
    window.location.href = 'index.html';
  } catch (erro) {
    mostrarMensagem(erro.message);
    botaoSalvar.disabled = false;
  }
}

formulario.addEventListener('submit', salvarCategoria);
if (idCategoria) {
  preencherParaEdicao();
}
