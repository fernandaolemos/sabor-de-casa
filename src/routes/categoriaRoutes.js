const express = require('express');
const categoriaService = require('../services/categoriaService');

const router = express.Router();

router.get('/', async (req, res) => {
  res.json(await categoriaService.listar());
});

router.get('/:id', async (req, res) => {
  res.json(await categoriaService.buscar(req.params.id));
});

router.post('/', async (req, res) => {
  res.status(201).json(await categoriaService.criar(req.body));
});

router.put('/:id', async (req, res) => {
  res.json(await categoriaService.atualizar(req.params.id, req.body));
});

router.delete('/:id', async (req, res) => {
  await categoriaService.excluir(req.params.id);
  res.status(204).end();
});

module.exports = router;
