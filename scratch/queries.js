'use strict';

const knex = require('../knex');

let searchTerm = 'gaga';
knex
  .select('notes.id', 'title', 'content')
  .from('notes')
  .modify(queryBuilder => {
    if (searchTerm) {
      queryBuilder.where('title', 'like', `%${searchTerm}%`);
    }
  })
  .orderBy('notes.id')
  .then(results => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch(err => {
    console.error(err);
  });

const noteParam = 1001;
knex
  .select('id', 'title', 'content')
  .from('notes')
  .where('id', noteParam)
  .orderBy('id')
  .then(results => console.log(results[0]))
  .catch(err => console.log(err));

const updateData = {
  title: 'This is an updated titled',
  content: 'This is updated content'
};

knex('notes')
  .where({id: noteParam})
  .update(updateData, ['id', 'title', 'content'])
  .then(results => console.log(results))
  .catch(err => console.log(err));

knex
  .insert({
    title: 'This title has been inserted using Knex', 
    content: 'inserted content'
  }, ['id', 'title', 'content'])
  .into('notes')
  .then(results => console.log(results[0]))
  .catch(err => console.log(err));

const deleteId = 1010;
knex('notes')
  .where('id', deleteId)
  .del()
  .then(results => console.log(results));

