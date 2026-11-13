const pool = require('../database/connection');

const COLUNAS = 'id, nome, descricao, preco::float AS preco, disponivel, categoria_id';

async function listarPorCategoria(categoriaId) {
  const { rows } = await pool.query(
    `SELECT ${COLUNAS} FROM pratos WHERE categoria_id = $1 ORDER BY nome`,
    [categoriaId]
  );
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query(`SELECT ${COLUNAS} FROM pratos WHERE id = $1`, [id]);
  return rows[0];
}

async function criar({ nome, descricao, preco, disponivel, categoriaId }) {
  const { rows } = await pool.query(
    `INSERT INTO pratos (nome, descricao, preco, disponivel, categoria_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUNAS}`,
    [nome, descricao, preco, disponivel, categoriaId]
  );
  return rows[0];
}

async function atualizar(id, { nome, descricao, preco, disponivel, categoriaId }) {
  const { rows } = await pool.query(
    `UPDATE pratos
     SET nome = $1, descricao = $2, preco = $3, disponivel = $4, categoria_id = $5
     WHERE id = $6
     RETURNING ${COLUNAS}`,
    [nome, descricao, preco, disponivel, categoriaId, id]
  );
  return rows[0];
}

async function excluir(id) {
  await pool.query('DELETE FROM pratos WHERE id = $1', [id]);
}

module.exports = {
  listarPorCategoria,
  buscarPorId,
  criar,
  atualizar,
  excluir,
};
