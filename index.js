// Require all of the libraries needed

// In-built Node Modules

const path = require("path");

// NPM installed modules
const basicAuth = require("express-basic-auth");
const {engine} = require("express-handlebars");
//const handlebars = require("express-handlebars");

const bodyParser = require("body-parser");

const express = require("express");
const app = express();
require("dotenv").config();
const config = require("./config.json").development;
// Get all user generated modules into the application

/* no need? const config = require("./stores/config.json")["development"];  */

// We use all the development paths
const AuthChallenger = require("./AuthChallenger");
const NoteService = require("./NoteService/NoteService");
const NoteRouter = require("./NoteRouter/NoteRouter");

//new added here

//connect to knex and knex.file
const knexConfig = require("./knexfile").development;
const knex = require("knex")(knexConfig);

const viewsPath = path.join(__dirname, "./views");

// Set up handlebars as our view engine - handlebars will responsible for rendering our HTML
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set('views', viewsPath);

//console.log(`View Engine is: ${app.get("view engine")} `);

// Serves the public directory to the root of our server
app.use(express.static("public"));

// Set up middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up basic auth
app.use(
  basicAuth({
    authorizeAsync: true,
    authorizer: AuthChallenger(knex),
    challenge: true,
    realm: "Note taking with knex",
  })
);

// Create a new instance of noteService and pass the file path/to/the/file where you want the service to read from and write to.
//const noteService = new NoteService(path.join(__dirname, config.notes), fs);

// Handle initial get request using this middleware which just console.logs Getting.
/* app.get("/", (req, res, next) => {
  console.log("Getting");
  next();
}); */

// Responsible for sending our index page back to our user.
/* app.get("/", (req, res) => {
  console.log(req.auth.user, req.auth.password);
  noteService.list(req.auth.user).then((data) => {
    console.log(data);
    res.render("index", {
      user: req.auth.user,
      notes: data,
    });
  });
}); */
const noteService = new NoteService(knex);
app.get("/", (req, res) => {
  console.log("get request");
  console.log(req.auth.user);
  res.render("index", {
    user: req.auth.user,
  });
})


// Set up the NoteRouter - handle the requests and responses in the note, read from a file and return the actual data, get the note from your JSON file and return to the clients browser.
app.use("/api/notes/", new NoteRouter(noteService).router()); //sending our data

// Set up the port that we are going to run the application on, therefore the port that we can view the application from our browser.
app.listen(config.port, () =>
  console.log(`Note Taking application listening to port ${config.port}`)
);

module.exports = app;
