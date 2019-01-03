const express = require('express');

const router = express.Router();

const knex = require('../knex');


// Get All folders
router.get('/folders', (req, res, next) => {
  knex.select('id', 'name')
    .from('folders')
    .orderBy('id')
    .then(results => {
      res.json(results);
    })
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
    .then(results => res.json(results[0]))
    .catch(err => next(err));
});

// Put update an item
router.put('/folders/:id', (req, res, next) => {
  const { id } = req.params;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateableField = ['name'];

  updateableField.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  /***** Never trust users - validate input *****/
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex('folders')
    .where('id', id)
    .update(updateObj, 'name')
    .then(results => res.json(results[0]))
    .catch(err => next(err));
});

// Post - Create(insert) New Folder
router.post('/folders', (req, res, next) => {
  const { name } = req.body;

  const newItem = {name};

  /***** Never trust users - validate input *****/
  if (!newItem.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }

  knex
    .insert(newItem, 'name')
    .into('folders')
    .then(results => res.json(results[0]))
    .catch(err => next(err));
});

router.delete('/folders/:id', (req, res, next) => {
  const { id } = req.params;

  knex('folders')
    .where('id', id)
    .del()
    .then(results => res.sendStatus(204))
    .catch(err => next(err));
});


module.exports = router;  