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


function getNewsItem(request, response) {
    var requestURL = request.url.split('/');
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('news');
            const item = await collection.findOne({"uniquename":requestURL[2]});
            response.setHeader('Content-Type', 'application/json');
            response.send(item);
      
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

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
            await collection.updateOne({"_id" : editId}, {$set:
                {
                    "category": request.body.category,
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
    let editedFeatures = request.body;

    featured.content[0].id=editedFeatures[0].id;
    featured.content[0].image=editedFeatures[0].image;
    featured.content[0].title=editedFeatures[0].title;
    featured.content[0].description=editedFeatures[0].description;
    featured.content[0].link=editedFeatures[0].link;

    featured.content[1].id=editedFeatures[1].id;
    featured.content[1].image=editedFeatures[1].image;
    featured.content[1].title=editedFeatures[1].title;
    featured.content[1].description=editedFeatures[1].description;
    featured.content[1].link=editedFeatures[1].link;

    featured.content[2].id=editedFeatures[2].id;
    featured.content[2].image=editedFeatures[2].image;
    featured.content[2].title=editedFeatures[2].title;
    featured.content[2].description=editedFeatures[2].description;
    featured.content[2].link=editedFeatures[2].link;

    featured.content[3].id=editedFeatures[3].id;
    featured.content[3].image=editedFeatures[3].image;
    featured.content[3].title=editedFeatures[3].title;
    featured.content[3].description=editedFeatures[3].description;
    featured.content[3].link=editedFeatures[3].link;

    fs.writeFile( 'data/featured.json', JSON.stringify( featured ), function(err) {
        response.status(200).end('OK');
    });

};

function editNews(request, response) {
    let editedNews = request.body;

    news.content[0].id=editedNews.content[0].id;
    news.content[0].title=editedNews.content[0].title;
    news.content[0].image=editedNews.content[0].image;
    news.content[0].largeimage=editedNews.content[0].largeimage;
    news.content[0].shortdescription=editedNews.content[0].shortdescription;
    news.content[0].articletext=editedNews.content[0].articletext;

    news.content[1].id=editedNews.content[1].id;
    news.content[1].title=editedNews.content[1].title;
    news.content[1].image=editedNews.content[1].image;
    news.content[1].largeimage=editedNews.content[1].largeimage;
    news.content[1].shortdescription=editedNews.content[1].shortdescription;
    news.content[1].articletext=editedNews.content[1].articletext;

    news.content[2].id=editedNews.content[2].id;
    news.content[2].title=editedNews.content[2].title;
    news.content[2].image=editedNews.content[2].image;
    news.content[2].largeimage=editedNews.content[2].largeimage;
    news.content[2].shortdescription=editedNews.content[2].shortdescription;
    news.content[2].articletext=editedNews.content[2].articletext;

    fs.writeFile( 'data/newsdata.json', JSON.stringify( news ), function(err) {
        response.status(200).end('OK');
    });

};

function editCompliance(request, response) {
    let editedCompliancePages = request.body;

    compliance.content[0].id=editedCompliancePages.content[0].id;
    compliance.content[0].title=editedCompliancePages.content[0].title;
    compliance.content[0].firstimage=editedCompliancePages.content[0].firstimage;
    compliance.content[0].secondimage=editedCompliancePages.content[0].secondimage;
    compliance.content[0].articletext=editedCompliancePages.content[0].articletext;

    compliance.content[1].id=editedCompliancePages.content[1].id;
    compliance.content[1].title=editedCompliancePages.content[1].title;
    compliance.content[1].firstimage=editedCompliancePages.content[1].firstimage;
    compliance.content[1].secondimage=editedCompliancePages.content[1].secondimage;
    compliance.content[1].articletext=editedCompliancePages.content[1].articletext;

    compliance.content[2].id=editedCompliancePages.content[2].id;
    compliance.content[2].title=editedCompliancePages.content[2].title;
    compliance.content[2].firstimage=editedCompliancePages.content[2].firstimage;
    compliance.content[2].secondimage=editedCompliancePages.content[2].secondimage;
    compliance.content[2].articletext=editedCompliancePages.content[2].articletext;

    compliance.content[3].id=editedCompliancePages.content[3].id;
    compliance.content[3].title=editedCompliancePages.content[3].title;
    compliance.content[3].firstimage=editedCompliancePages.content[3].firstimage;
    compliance.content[3].secondimage=editedCompliancePages.content[3].secondimage;
    compliance.content[3].articletext=editedCompliancePages.content[3].articletext;

    compliance.content[4].id=editedCompliancePages.content[4].id;
    compliance.content[4].category=editedCompliancePages.content[4].category;
    compliance.content[4].title=editedCompliancePages.content[4].title;
    compliance.content[4].firstimage=editedCompliancePages.content[4].firstimage;
    compliance.content[4].secondimage=editedCompliancePages.content[4].secondimage;
    compliance.content[4].articletext=editedCompliancePages.content[4].articletext;

    fs.writeFile( 'data/compliance.json', JSON.stringify( compliance ), function(err) {
        response.status(200).end('OK');
    });

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
