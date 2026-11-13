import { categoriaApi } from './api.js';
import {
  mostrarMensagem,
  exibirMensagemGuardada,
  criarElemento,
  criarLink,
  criarBotao,
  criarCelula,
} from './ui.js';

const corpoTabela = document.getElementById('lista-categorias');
const tabela = document.getElementById('tabela-categorias');
const estadoVazio = document.getElementById('estado-vazio');

function textoTotalPratos(total) {
  return total === 1 ? '1 prato' : `${total} pratos`;
}

function criarLinhaCategoria(categoria) {
  const acoes = criarElemento('div', { classe: 'acoes' }, [
    criarLink('Ver pratos', `pratos.html?categoriaId=${categoria.id}`, 'botao botao--primario'),
    criarLink('Editar', `categoria-form.html?id=${categoria.id}`),
    criarBotao('Excluir', () => excluirCategoria(categoria), 'botao botao--perigo'),
  ]);

  return criarElemento('tr', {}, [
    criarCelula('Nome', criarElemento('strong', { texto: categoria.nome })),
    criarCelula('Descrição', categoria.descricao || '—'),
    criarCelula('Pratos', textoTotalPratos(categoria.total_pratos)),
    criarCelula('Ações', acoes),
  ]);
}

async function excluirCategoria(categoria) {
  if (!confirm(`Deseja excluir a categoria "${categoria.nome}"?`)) {
    return;
  }
  try {
    await categoriaApi.excluir(categoria.id);
    mostrarMensagem(`Categoria "${categoria.nome}" excluída com sucesso.`, 'sucesso');
    await carregarCategorias();
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

async function carregarCategorias() {
  try {
    const categorias = await categoriaApi.listar();
    corpoTabela.replaceChildren(...categorias.map(criarLinhaCategoria));
    tabela.hidden = categorias.length === 0;
    estadoVazio.hidden = categorias.length > 0;
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
}

exibirMensagemGuardada();
carregarCategorias();
