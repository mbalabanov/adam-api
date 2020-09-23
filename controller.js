const bp = require( 'body-parser' );
const fs = require( 'fs' );
const Mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://adamuser:letmein123nowpl33se@cluster0.xuhkf.mongodb.net/adamdb?retryWrites=true&w=majority';
const db = 'adamdb';

// Declaring the variable needed for the functions below.
let instructiontext = ``;
let allData = [];

// VSCode highlights these as inctive, because they are populated using eval(requestURL[1]) from the URL.
let artifacts = [];
let persons = [];
let events = [];
let news = [];
let compliance = [];
let featured = [];

// Provide instructions when the request has no parameters
function loadInstructions() {
    fs.readFile('data/instructions.html', 'utf8', function(err, contents) {
        instructiontext = contents;
    });
};

function instructions(request, response) {
    response.send(instructiontext);
}

// Gets Artifacts, Persons, and Events, combines them to an array and provides response with data.
function getAll(request, response) {
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();

            allData = [];

            const database = client.db(db);
            const artifactscollection = database.collection('artifacts');
            const artifactsdata = await artifactscollection.find();

            const eventscollection = database.collection('events');
            const eventsdata = await eventscollection.find();

            const personscollection = database.collection('persons');
            const personsdata = await personscollection.find();

            while(await artifactsdata.hasNext()) {
                const artifact = await artifactsdata.next();
                allData.push(artifact);
            }

            while(await eventsdata.hasNext()) {
                const event = await eventsdata.next();
                allData.push(event);
            }

            while(await personsdata.hasNext()) {
                const person = await personsdata.next();
                allData.push(person);
            }

            response.setHeader('Content-Type', 'application/json');
            response.send(allData);
      
        } catch (err) {
          console.log(err.stack);
        }

        await client.close();
    })();
};

// The request is split into an array containing the item type (artifacts, events, persons) and the ID. The ID is turned into an object ID. The collection is set by item type.
function getItems(request, response) {
    (async function() {
        var requestURL = request.url.split('/');

        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();
            artifacts = [];
            persons = [];
            events = [];
            news = [];
            compliance = [];
            featured = [];

            const database = client.db(db);
            const collection = database.collection(requestURL[1]);
            const data = await collection.find();

            while(await data.hasNext()) {
                const item = await data.next();
                eval(requestURL[1]).push(item);
            }

            response.setHeader('Content-Type', 'application/json');
            response.send(eval(requestURL[1]));
      
        } catch (err) {
          console.log(err.stack);
        }

        await client.close();
    })();

};

// Gets an archive item by its ID
function getItem(request, response) {
    var requestURL = request.url.split('/');
    var ObjectId = Mongo.ObjectId;
    let findId = new ObjectId(request.params.id);

    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection(requestURL[1]);
            const item = await collection.findOne({"_id" : findId});
            response.setHeader('Content-Type', 'application/json');
            response.send(item);
      
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

// Gets an individual news item by its unique name (used by each news page)
function getNewsItem(request, response) {
    var requestURL = request.url.split('/');
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('news');
            const item = await collection.findOne({'uniquename':requestURL[2]});
            response.setHeader('Content-Type', 'application/json');
            response.send(item);
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

// Gets a complaince page by category (used by each of the compliance pages)
function getComplianceItem(request, response) {
    var requestURL = request.url.split('/');
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('compliance');
            const item = await collection.findOne({"category":requestURL[2]});
            response.setHeader('Content-Type', 'application/json');
            response.send(item);
      
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

// Deletes an archive item by ID
function deleteItem(request, response) {
    (async function() {
        var requestURL = request.url.split('/');
        var ObjectId = Mongo.ObjectId;
        let deleteId = new ObjectId(requestURL[2]);
        const client = new MongoClient(uri, { useUnifiedTopology: true});
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection(requestURL[1]);
            await collection.deleteOne({"_id" : deleteId});

            response.setHeader('Content-Type', 'application/json');
            response.send('Successfully deleted!');
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

// Creates a new archive item
function createItem(request, response) {
    (async function() {
        var requestURL = request.url.split('/');
        const client = new MongoClient(uri, { useUnifiedTopology: true});
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection(requestURL[1]);
            await collection.insertOne(request.body);
            response.setHeader('Content-Type', 'application/json');
            response.send('Successfully created!');
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

// Edit an archive item by ID
function editItem(request, response) {
    (async function() {
        var requestURL = request.url.split('/');
        var ObjectId = Mongo.ObjectId;
        let editId = new ObjectId(request.params.id);
        const client = new MongoClient(uri, { useUnifiedTopology: true});
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection(requestURL[1]);
            await collection.updateOne({'_id' : editId}, {$set:
                {
                    'category': request.body.category,
                    'name': request.body.name,
                    'aliases': request.body.aliases,
                    'shortdescription': request.body.shortdescription,
                    'longdescription': request.body.longdescription,
                    'dates': request.body.dates,
                    'tags': request.body.tags,
                    'images': request.body.images,
                    'videos': request.body.videos,
                    'websiteURLs': request.body.websiteURLs,
                    'assets': request.body.assets,
                    'artifacts': request.body.artifacts,
                    'persons': request.body.persons,
                    'events': request.body.events
                }
            });
            response.setHeader('Content-Type', 'application/json');
            response.send('Successfully edited!');
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

function editFeatured(request, response) {
    let item = request.body;
    (async function() {
        var ObjectId = Mongo.ObjectId;
        const client = new MongoClient(uri, { useUnifiedTopology: true});
        let editId = new ObjectId(item._id);
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('featured');
            await collection.updateOne({'_id' : editId}, {$set:
                {
                    'image': item.image,
                    'title': item.title,
                    'description': item.description,
                    'link': item.link
                }
            });
            response.setHeader('Content-Type', 'application/json');
            response.send('Successfully edited!');
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();

};

// Edit a news item by ID
function editNews(request, response) {
    let item = request.body;
    (async function() {
        var ObjectId = Mongo.ObjectId;
        const client = new MongoClient(uri, { useUnifiedTopology: true});
        let editId = new ObjectId(item._id);
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('news');
            await collection.updateOne({'_id' : editId}, {$set:
                {
                    'uniquename': item.uniquename,
                    'title': item.title,
                    'image': item.image,
                    'largeimage': item.largeimage,
                    'shortdescription': item.shortdescription,
                    'articletext': item.articletext,
                }
            });
            response.setHeader('Content-Type', 'application/json');
            response.send('Successfully edited!');
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

// Edit a compliance page by ID
function editCompliance(request, response) {
    let item = request.body;
    (async function() {
        var ObjectId = Mongo.ObjectId;
        const client = new MongoClient(uri, { useUnifiedTopology: true});
        let editId = new ObjectId(item._id);
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('compliance');
            await collection.updateOne({'_id' : editId}, {$set:
                {
                    'category': item.category,
                    'title': item.title,
                    'firstimage': item.firstimage,
                    'secondimage': item.secondimage,
                    'articletext': item.articletext,
                }
            });
            response.setHeader('Content-Type', 'application/json');
            response.send('Successfully edited!');
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

module.exports = {
    instructions,
    getAll,
    getItems,
    getItem,
    getNewsItem,
    getComplianceItem,
    deleteItem,
    createItem,
    editItem,
    editFeatured,
    editNews,
    editCompliance,
    loadInstructions
};
