const express = require('express');
const pratoService = require('../services/pratoService');

const router = express.Router();

router.get('/categorias/:categoriaId/pratos', async (req, res) => {
  res.json(await pratoService.listarPorCategoria(req.params.categoriaId));
});

router.post('/categorias/:categoriaId/pratos', async (req, res) => {
  res.status(201).json(await pratoService.criar(req.params.categoriaId, req.body));
});

router.get('/pratos/:id', async (req, res) => {
  res.json(await pratoService.buscar(req.params.id));
});

router.put('/pratos/:id', async (req, res) => {
  res.json(await pratoService.atualizar(req.params.id, req.body));
});

router.delete('/pratos/:id', async (req, res) => {
  await pratoService.excluir(req.params.id);
  res.status(204).end();
});

module.exports = router;
