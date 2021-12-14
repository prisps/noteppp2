

const AuthChallenger = (knex) => {
    // This will return True or False
    return (username, password, cb) => {
      // This is the password and username that we receive when prompted by our HTML file.
      let query = knex
          .select('username')
          .from('users')
          .where('username', username)
          .where('password', password);
      
      query
        .then((rows) => {
          if (rows.length === 1) {
            cb(null, true);

          }else {
            cb(null, false);
          }
        })
        .catch((error) => {
          console.log(error)
        })
      /* return (
        typeof users[username] !== "undefined" && users[username] === password
      ); */ // Logic to see if we can match the username given to a username stored in our JSON file, and if the password matches
    };
  };
  // This code exports the function we hae just defined.
  module.exports = AuthChallenger;
  