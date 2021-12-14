
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('notes')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('users')
      .del()
      .then(function () {
        return knex('users')
      .insert([
        {username: 'Pris', password: "pris"},
        {username: 'Morlala', password: "morlala"},
        {username: 'Bipbip', password: "bipbip"},
      ])
      .then(function() {
        return knex("notes")
        .insert([
          {content: 'one', user_id: 1 },
          {content: 'two', user_id: 2 },
        ])
      })
     })
    });
};
