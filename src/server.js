require('dotenv').config();
const express = require('express');
const path = require('path');
const AppError = require('./errors/AppError');
const categoriaRoutes = require('./routes/categoriaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/categorias', categoriaRoutes);

app.use((erro, req, res, next) => {
  if (erro instanceof AppError) {
    return res.status(erro.status).json({ erro: erro.message });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno no servidor. Tente novamente.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
