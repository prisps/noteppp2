// Require the necessary modules for this file.

// Create a new NoteService class which takes a file as a dependency, this means whenever we are creating new instances of the noteService, we need to pass in a path to a file (this is the file that we will read, write and edit etc.)
class NoteService {
    constructor(knex) {
      this.knex = knex;
    }

    async add(note, user) {
      let query = await this.knex
      .select('id')
      .from('users')
      .where('users.username', user);

      console.log(query);

      if (query.length === 1) {
        await this.knex
          .insert({
            content: note,
            user_id: query[0].id,
          })
          .into('notes');
      }else {
        throw new Error("Cannot add a note to a user that doesn't exist")
      }
    }

    list(user) {
      //check if user is there and then add notes
      if (typeof user !== "undefined") {
        let query = this.knex
          .select('notes.id', 'notes.content')
          .from('notes')
          .innerJoin('users', 'notes.user_id', 'users.id')
          .where('users.username', user)
          .orderBy('notes.id', 'asc');

          return query.then((rows) => {
            console.log(rows,"pp");
            return rows.map((row) => ({
              id: row.id,
              content: row.content,
            }));
          });

      } else {
        let query = this.knex
        .select('users.username', 'notes.id', 'content')
        .from('notes')
        .innerJoin('users', 'notes.user_id', 'users.id');

        return query.then((rows) => {
          console.log(rows);
          const result = {};
          rows.forEach((row) => {
            if (typeof result[row.username] === 'undefined') {
              result[row.username] = [];
            }
            result[row.username].push({
              id: row.id,
              content: row.content,
            });
          })
            return result;
        })
      }
    }

    update(id, note, user) {
      let query = this.knex
      .select('id')
      .from('users')
      .where('users.username', user);

      return query.then((rows) => {
        if (rows.length === 1) {
          return this.knex('notes')
          .where('id', id)
          .update({
            content: note,
          });
        } else {
          throw new Error ("Cannot update a note if user doesn't exist!");
        }
      });
    }

    remove(id, user) {
      let query = this.knex
      .select('id')
      .from('users')
      .where('users.username', user);

      return query.then((rows) => {
        if(rows.length === 1) {
          return this.knex('notes').where('id', id).del();
        } else {
          throw new Error ("Cannot update a note if user doesn't exist!");
        }
      });
    }
  
    /* // The init promise only needs to run once, when it runs, this.read resolves with this.notes (the notes from our json file) as a globally available variable.
    // the init promise is not concerned with resolving data - it just needs to run once to ensure persistence of the notes within our JSON file.
    init() {
      if (this.initPromise === null) {
        this.initPromise = new Promise((resolve, reject) => {
          this.read()
            .then(() => {
              resolve();
            })
            .catch(() => {
              this.notes = {};
              this.write().then(resolve).catch(reject);
            });
        });
      }
      return this.initPromise;
    }
  
    // The method below is utilized to read out notes from our json file, once we have the data from the file, we store the parsed notes in an instance variable called this.notes the read method then resolves with this.notes
    read() {
      return new Promise((resolve, reject) => {
        this.fs.readFile(this.file, "utf-8", (err, data) => {
          if (err) {
            reject(err);
          }
          try {
            this.notes = JSON.parse(data);
            console.log(this.notes);
          } catch (e) {
            return reject(e);
          }
          return resolve(this.notes);
        });
      });
    }
  
    // The write method is used to update our JSON file. It resolves with this.notes, our full array of notes.
    write() {
      console.log(4);
      return new Promise((resolve, reject) => {
        this.fs.writeFile(this.file, JSON.stringify(this.notes), (err) => {
          if (err) {
            return reject(err);
          }
          resolve(this.notes);
        });
      });
    }
  
    // List note is a function which is very important for the application, it retrieves the notes for a specific user. The user is accessed via req.auth.user within our router.
    list(user) {
        console.log(5);
        console.log("Listing");
        if (typeof user !== "undefined") {
          return this.init() //just checks to see if it has run once.
            .then(() => {
              return this.read();
            })
            .then(() => {
              if (typeof this.notes[user] === "undefined") {
                return [];
              } else {
                console.log("success");
                return this.notes[user];
              }
            });
        } else {
          return this.init().then(() => {
            return this.read();
          });
        }
    }
  
    // This method add notes updates the users notes, by adding the new note to this.notes, it then calls this.write, to update our JSON file with the newest notes.
    add(note, user) {
      console.log(3);
      return this.init().then(() => {
        if (typeof this.notes[user] === "undefined") {
          this.notes[user] = [];
        }
        this.notes[user].push(note);
        return this.write();
      });
    }
  
    // This method will be used to update a specific note in our application, it also handles some errors for our application. Then it calls this.write to update the JSON file.
    update(index, note, user) {
      return this.init().then(() => {
        if (typeof this.notes[user] === "undefined") {
          throw new Error("Cannot update a note, if the user doesn't exist");
        }
        if (this.notes[user].length <= index) {
          throw new Error("Cannot update a note that doesn't exist");
        }
        this.notes[user][index] = note;
        return this.write();
      });
    }
  
    // This method will remove a particular note from our this.notes. Then it calls this.write to update our JSON file.
    remove(index, user) {
      return this.init().then(() => {
        if (typeof this.notes[user] === "undefined") {
          throw new Error("Cannot remove a note, if the user doesn't exist");
        }
        if (this.notes[user].length <= index) {
          throw new Error("Cannot remove a note that doesn't exist");
        }
        return this.read().then(() => {
          this.notes[user].splice(index, 1);
          return this.write();
        });
      });
    } */
  }
  
  module.exports = NoteService;
  