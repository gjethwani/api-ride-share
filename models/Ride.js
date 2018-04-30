const bookshelf = require('./../bookshelf');

module.exports = bookshelf.Model.extend({
  tableName: 'rides',
  idAttribute: 'id'
});
