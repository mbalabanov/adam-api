// Define the constants for the express server (needed to serve the API), the body parser (needed to parse the requests) and morgan (updates the server and reloads when code changes).
const express = require( 'express' );
const bp = require( 'body-parser' );
const morgan = require('morgan');

// These are the functions for the API, they are called depending on the type of request (GET, POST, PUT, DELETE) and the URL.
const { instructions, getAll, getItems, getItem, getNewsItem, getComplianceItem, deleteItem, createItem, editItem, editFeatured, editNews, editCompliance, loadInstructions } = require('./controller');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 5003;

// Prevents cross origin issues
app.use(cors());

// Definitions for Body Parser
app.use( bp.json());
app.use( bp.urlencoded({ extended:false}) );

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

app.use(bp.urlencoded({ extended: false }));
app.use(morgan('common', { immediate: true }));

// Loads the text of the instructions that are served when API URL is called without any parameters.
loadInstructions();

// Launches servers and listens to port
app.listen(port);
console.log('Express started on port ' + port);

// Delivers API instructions as a response if the API URL is called without any parameters
app.get('/', function(request, response) {
  instructions(request, response);
});

// Responds with all data for artifacts, persons and events
app.get('/all', function(request, response) {
  getAll(request, response);
});

// Responds only with the data for either artifacts, persons or events
app.get(['/artifacts', '/artifacts/','/persons', '/persons/', '/events', '/events/', '/featured', '/featured/', '/news/', '/news', '/compliance', '/compliance/'], function(request, response) {
  getItems(request, response);
});

// Responds with a single archive item based on its ID for either artifacts, persons or events
app.get(['/artifacts/:id','/persons/:id','/events/:id'], function(request, response) {
  getItem(request, response);
});

// Responds with a single news item based on its ID
app.get('/news/:id', function(request, response) {
  getNewsItem(request, response);
});

// Responds with a single compliance item based on its ID
app.get('/compliance/:id', function(request, response) {
  getComplianceItem(request, response);
});

// Deletes a archive news item based on its ID
app.delete(['/artifacts/:id', '/persons/:id', '/events/:id'], function(request, response) {
  deleteItem(request, response);
});

// Changes the entry of the archive item based on the ID
app.put(['/artifacts/:id', '/persons/:id', '/events/:id'], function(request, response) {
  editItem(request, response);
});

// Creates a new archive item
app.post(['/artifacts/', '/artifacts', '/persons/', '/persons', '/events/', '/events'], function(request, response) {
  createItem(request, response);
});

// Changes all news item
app.put(['/news/', '/news'], function(request, response) {
  editNews(request, response);
});

// Changes all featured item
app.put(['/featured/', '/featured'], function(request, response) {
  editFeatured(request, response);
});

// Changes all compliance item
app.put(['/compliance/', '/compliance'], function(request, response) {
  editCompliance(request, response);
});
