const express = require( 'express' );
const bp = require( 'body-parser' );
const morgan = require('morgan');
const { instructions, getAll, getArtifacts, getPersons, getEvents, getNews, getFeatured, getCompliance, getArtifact, getPerson, getEvent, getNewsitem, getCompliancepage, deleteItem, editItem, editFeatured, editNews, editCompliance, loadInstructions } = require('./controller');
const app = express();
var cors = require('cors');
const port = process.env.PORT || 5003;

app.use(cors());

app.use( bp.json());
app.use( bp.urlencoded({ extended:false}) );

function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

app.use(bp.urlencoded({ extended: false }));
app.use(morgan('common', { immediate: true }));

/* Server-Port */
app.listen(port);
console.log('Express started on port ' + port);

app.get('/', function(request, response) {
  loadInstructions();
  instructions(request, response);
});
app.get('/all', function(request, response) {
  getAll(request, response);
});
app.get(['/artifacts', '/artifacts/'], function(request, response) {
  getArtifacts(request, response);
});
app.get(['/persons', '/persons/'], function(request, response) {
  getPersons(request, response);
});
app.get(['/events', '/events/',], function(request, response) {
  getEvents(request, response);
});
app.get(['/featured', '/featured/'], function(request, response) {
  getFeatured(request, response);
});
app.get(['/news/', '/news'], function(request, response) {
  getNews(request, response);
});
app.get(['/compliance', '/compliance/'], function(request, response) {
  getCompliance(request, response);
});

app.get('/artifact/:id', function(request, response) {
  getArtifact(request, response);
});

app.get('/person/:id', function(request, response) {
  getPerson(request, response);
});

app.get('/event/:id', function(request, response) {
  getEvent(request, response);
});

app.get('/newsitem/:id', function(request, response) {
  getNewsitem(request, response);
});

app.get('/compliancepage/:id', function(request, response) {
  getCompliancepage(request, response);
});

app.delete(['/artifacts/:id', '/persons/:id', '/events/:id'], function(request, response) {
  deleteItem(request, response);
});

app.put(['/artifacts/:id', '/persons/:id', '/events/:id'], function(request, response) {
  editItem(request, response);
});

app.post(['/artifacts/:id', '/persons/:id', '/events/:id'], function(request, response) {
  editItem(request, response);
});

app.put(['/news/', '/news'], function(request, response) {
  editNews(request, response);
});

app.put(['/featured/', '/featured'], function(request, response) {
  editFeatured(request, response);
});

app.put(['/compliance/', '/compliance'], function(request, response) {
  editCompliance(request, response);
});
