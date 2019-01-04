const express = require('express');

// Create a router instance ("mini-app")
const router = express.Router();

// link to knex to query DB
const knex = require('../knex');

// GET all tags
router.get('/tags', (req, res, next) => {
  knex.select('id', 'name')
    .from('tags')
    .orderBy('id')
    .then(results => res.json(results))
    .catch(err => next(err));
});

router.get('/tags/:id', (req, res, next) => {
  const { id } = req.params;

  knex
    .select('id', 'name')
    .from('tags')
    .where('id', id)
    .orderBy('id')
    .then(results => res.json(results[0]))
    .catch(err => next(err));
});


module.exports = router;