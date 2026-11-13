const BASE_URL = '/api';

async function requisitar(caminho, { metodo = 'GET', dados } = {}) {
  const opcoes = { method: metodo, headers: {} };
  if (dados !== undefined) {
    opcoes.headers['Content-Type'] = 'application/json';
    opcoes.body = JSON.stringify(dados);
  }

  let resposta;
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, opcoes);
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
  }

  if (resposta.status === 204) {
    return null;
  }
  const corpo = await resposta.json().catch(() => null);
  if (!resposta.ok) {
    throw new Error(corpo?.erro || 'Ocorreu um erro inesperado. Tente novamente.');
  }
  return corpo;
}

export const categoriaApi = {
  listar: () => requisitar('/categorias'),
  buscar: (id) => requisitar(`/categorias/${id}`),
  criar: (dados) => requisitar('/categorias', { metodo: 'POST', dados }),
  atualizar: (id, dados) => requisitar(`/categorias/${id}`, { metodo: 'PUT', dados }),
  excluir: (id) => requisitar(`/categorias/${id}`, { metodo: 'DELETE' }),
};

export const pratoApi = {
  listarPorCategoria: (categoriaId) => requisitar(`/categorias/${categoriaId}/pratos`),
  criar: (categoriaId, dados) =>
    requisitar(`/categorias/${categoriaId}/pratos`, { metodo: 'POST', dados }),
  atualizar: (id, dados) => requisitar(`/pratos/${id}`, { metodo: 'PUT', dados }),
  excluir: (id) => requisitar(`/pratos/${id}`, { metodo: 'DELETE' }),
};
