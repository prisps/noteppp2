
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', (table) => {
      table.unique('username');
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.alterTable('users', (table) => {
        table.dropUnique('username');
    })
};
