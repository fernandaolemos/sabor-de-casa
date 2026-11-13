const CHAVE_MENSAGEM_SALVA = 'sabor-de-casa:mensagem';

export function mostrarMensagem(texto, tipo = 'erro') {
  const caixa = document.getElementById('mensagem');
  caixa.textContent = texto;
  caixa.className = `mensagem mensagem--${tipo}`;
  caixa.hidden = false;
  caixa.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

export function esconderMensagem() {
  document.getElementById('mensagem').hidden = true;
}

export function guardarMensagemParaProximaTela(texto) {
  try {
    sessionStorage.setItem(CHAVE_MENSAGEM_SALVA, texto);
  } catch {
    // Sem armazenamento disponível: a próxima tela apenas não mostra o aviso.
  }
}

export function exibirMensagemGuardada() {
  try {
    const texto = sessionStorage.getItem(CHAVE_MENSAGEM_SALVA);
    if (texto) {
      sessionStorage.removeItem(CHAVE_MENSAGEM_SALVA);
      mostrarMensagem(texto, 'sucesso');
    }
  } catch {
    // Sem armazenamento disponível: nada a exibir.
  }
}

export function mostrarErroCampo(campo, texto) {
  campo.setAttribute('aria-invalid', 'true');
  document.getElementById(`erro-${campo.id}`).textContent = texto;
}

export function limparErrosCampos(formulario) {
  formulario.querySelectorAll('[aria-invalid]').forEach((campo) => {
    campo.removeAttribute('aria-invalid');
  });
  formulario.querySelectorAll('.erro-campo').forEach((erro) => {
    erro.textContent = '';
  });
}

export function criarElemento(tag, { classe, texto, atributos = {} } = {}, filhos = []) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  Object.entries(atributos).forEach(([nome, valor]) => elemento.setAttribute(nome, valor));
  elemento.append(...filhos);
  return elemento;
}

export function criarLink(texto, href, classe = 'botao botao--secundario') {
  return criarElemento('a', { classe, texto, atributos: { href } });
}

export function criarBotao(texto, aoClicar, classe = 'botao botao--secundario') {
  const botao = criarElemento('button', { classe, texto, atributos: { type: 'button' } });
  botao.addEventListener('click', aoClicar);
  return botao;
}

export function criarCelula(rotulo, conteudo) {
  const filhos = typeof conteudo === 'string' ? [] : [conteudo];
  const texto = typeof conteudo === 'string' ? conteudo : undefined;
  return criarElemento('td', { texto, atributos: { 'data-rotulo': rotulo } }, filhos);
}

export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function lerParametroDaUrl(nome) {
  return new URLSearchParams(window.location.search).get(nome);
}
