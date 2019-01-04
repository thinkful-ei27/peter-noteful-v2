const express = require('express');

// Create a router instance ("mini-app")
const router = express.Router();

// link to knex to query DB
const knex = require('../knex');

// GET all tags
router.get('/', (req, res, next) => {
  knex.select('id', 'name')
    .from('tags')
    .orderBy('id')
    .then(results => res.json(results))
    .catch(err => next(err));
});

// GET single tag by id
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  knex
    .select('id', 'name')
    .from('tags')
    .where('id', id)
    .orderBy('id')
    .then(results => res.json(results[0]))
    .catch(err => next(err));
});

// Create/POST(insert) a tag
router.post('/', (req, res, next) => {
  const { name } = req.body;

  /****** Never trust users. Validate input *******/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = { name };

  knex
    .insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then(results => {
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

// Update/PUT a single tag
router.put('/:id', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input ******/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateItem = { name };

  knex('tags')
    .update(updateItem)
    .where('id', req.params.id)
    .returning(['id', 'name'])
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// Delete a  single tag
module.exports = router;