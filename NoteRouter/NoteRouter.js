const express = require("express");

// Setup a NoteRouter class which takes the note service as a dependency, that was we can inject the NoteService when we use our Router. As this is not a hard coded value we will need to inject the noteService for every instance of the note router.
class NoteRouter {
  constructor(noteService) {
    this.noteService = noteService;
  }

  // This utilises the express Router method, basically we are binding the path/ request to each restful verb
  router() {
    let router = express.Router();

    router.get("/", this.get.bind(this));
    router.post("/", this.post.bind(this));
    router.put("/:id", this.put.bind(this));
    router.delete("/:id", this.delete.bind(this));
    return router;
  }

  // Here we handle what will occur when we have been sent down a particular path, this path is '/' - we will just list all of the notes, that match our(req.auth.user)
  get(req, res) {
    console.log(req.auth.user);
    return this.noteService
      .list(req.auth.user) // The method we use from the service, we pass in the user so we get back specific notes for that user.
      .then((notes) => {
        console.log("Getting");
        console.log(notes);
        res.json(notes);
      }) 
      .catch((err) => res.status(500).json(err)); // This .catch is to handle any errors that may befall our project.
  }

  post(req, res) {
    console.log("POSTing");
    return this.noteService
      .add(req.body.note, req.auth.user)
      .then(() =>  this.noteService.list(req.auth.user))
      .then((notes) => res.json(notes))
      .catch((err) => res.status(500).json(err));
  }

  // Here we handle our put request, which has an id as a parameter (req.params.id), the body of the updated note (req.body.note) and the user who's note we want to update (req.auth.user)
  put(req, res) {
    return this.noteService
      .update(req.params.id, req.body.note, req.auth.user)
      .then(() => this.noteService.list(req.auth.user))
      .then((notes) => res.json(notes))
      .catch((err) => res.status(500).json(err));
  }

  delete(req, res) {
    return this.noteService
      .remove(req.params.id, req.auth.user)
      .then(() => this.noteService.list(req.auth.user))
      .then((notes) => res.json(notes))
      .catch((err) => res.status(500).json(err));
  }
}

module.exports = NoteRouter;
