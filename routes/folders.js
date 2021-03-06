const express = require('express');

const router = express.Router();

const knex = require('../knex');


// Get All folders
router.get('/folders', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .orderBy('id')
    .then(results => res.json(results))
    .catch(err => next(err));
});

// Get folders by id
router.get('/folders/:id', (req, res, next) => {
  const id = req.params.id;

  knex
    .select('id', 'name')
    .from('folders')
    .where('id', id)
    .orderBy('id')
    .then(results => {
      if(results) {
        res.json(results[0]);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

// Post - Create(insert) New Folder
router.post('/folders', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const newItem = {name};

  knex
    .insert(newItem, 'name')
    .into('folders')
    .then(results => {
      const result = results[0];
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});

// Put update an item
router.put('/:id', (req, res, next) => {
  const { name } = req.body;

  /***** Never trust users. Validate input *****/
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  const updateItem = { name };

  knex('folders')
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
    .catch(err => {
      next(err);
    });
});

router.delete('/folders/:id', (req, res, next) => {
  const { id } = req.params;

  knex('folders')
    .where('id', id)
    .del()
    .then(() => res.sendStatus(204).end())
    .catch(err => next(err));
});

module.exports = router;  