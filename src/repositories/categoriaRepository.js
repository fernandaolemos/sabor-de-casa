const pool = require('../database/connection');

async function listarTodas() {
  const { rows } = await pool.query(`
    SELECT c.id, c.nome, c.descricao, COUNT(p.id)::int AS total_pratos
    FROM categorias c
    LEFT JOIN pratos p ON p.categoria_id = c.id
    GROUP BY c.id
    ORDER BY c.nome
  `);
  return rows;
}

async function buscarPorId(id) {
  const { rows } = await pool.query('SELECT * FROM categorias WHERE id = $1', [id]);
  return rows[0];
}

async function buscarPorNome(nome) {
  const { rows } = await pool.query(
    'SELECT * FROM categorias WHERE LOWER(nome) = LOWER($1)',
    [nome]
  );
  return rows[0];
}

async function contarPratos(id) {
  const { rows } = await pool.query(
    'SELECT COUNT(*)::int AS total FROM pratos WHERE categoria_id = $1',
    [id]
  );
  return rows[0].total;
}

async function criar({ nome, descricao }) {
  const { rows } = await pool.query(
    'INSERT INTO categorias (nome, descricao) VALUES ($1, $2) RETURNING *',
    [nome, descricao]
  );
  return rows[0];
}

async function atualizar(id, { nome, descricao }) {
  const { rows } = await pool.query(
    'UPDATE categorias SET nome = $1, descricao = $2 WHERE id = $3 RETURNING *',
    [nome, descricao, id]
  );
  return rows[0];
}

async function excluir(id) {
  await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
}

module.exports = {
  listarTodas,
  buscarPorId,
  buscarPorNome,
  contarPratos,
  criar,
  atualizar,
  excluir,
};
