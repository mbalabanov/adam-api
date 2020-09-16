const express = require( 'express' );
const bp = require( 'body-parser' );
const morgan = require('morgan');
const { instructions, getAll, getItems, getItem, getNewsItem, getComplianceItem, deleteItem, createItem, editItem, editFeatured, editNews, editCompliance, loadInstructions } = require('./controller');
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

loadInstructions();

/* Server-Port */
app.listen(port);
console.log('Express started on port ' + port);

app.get('/', function(request, response) {
  instructions(request, response);
});
app.get('/all', function(request, response) {
  getAll(request, response);
});
app.get(['/artifacts', '/artifacts/','/persons', '/persons/', '/events', '/events/', '/featured', '/featured/', '/news/', '/news', '/compliance', '/compliance/'], function(request, response) {
  getItems(request, response);
});

app.get(['/artifacts/:id','/persons/:id','/events/:id'], function(request, response) {
  getItem(request, response);
});

app.get('/news/:id', function(request, response) {
  getNewsItem(request, response);
});

app.get('/compliance/:id', function(request, response) {
  getComplianceItem(request, response);
});

app.delete(['/artifacts/:id', '/persons/:id', '/events/:id'], function(request, response) {
  deleteItem(request, response);
});

app.put(['/artifacts/:id', '/persons/:id', '/events/:id'], function(request, response) {
  editItem(request, response);
});

app.post(['/artifacts/', '/artifacts', '/persons/', '/persons', '/events/', '/events'], function(request, response) {
  createItem(request, response);
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
