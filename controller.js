const bp = require( 'body-parser' );
const fs = require( 'fs' );
const Mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb+srv://adamuser:letmein123nowpl33se@cluster0.xuhkf.mongodb.net/adamdb?retryWrites=true&w=majority';
const db = 'adamdb';

let allData = [];
let featured = [];
let artifacts = [];
let persons = [];
let events = [];
let news = [];
let compliance = [];
let instructiontext = ``;

function instructions(request, response) {
    response.send(instructiontext);
}

function loadInstructions() {
    fs.readFile('data/instructions.html', 'utf8', function(err, contents) {
        instructiontext = contents;
    });
};

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

function getArtifacts(request, response) {

    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();

            artifacts = [];

            const database = client.db(db);
            const artifactscollection = database.collection('artifacts');
            const artifactsdata = await artifactscollection.find();

            while(await artifactsdata.hasNext()) {
                const artifact = await artifactsdata.next();
                artifacts.push(artifact);
            }

            response.setHeader('Content-Type', 'application/json');
            response.send(artifacts);
      
        } catch (err) {
          console.log(err.stack);
        }

        await client.close();
    })();

};

function getPersons(request, response) {
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();

            persons = [];

            const database = client.db(db);
            const personscollection = database.collection('persons');
            const personsdata = await personscollection.find();

            while(await personsdata.hasNext()) {
                const person = await personsdata.next();
                persons.push(person);
            }

            response.setHeader('Content-Type', 'application/json');
            response.send(persons);
      
        } catch (err) {
          console.log(err.stack);
        }

        await client.close();
    })();
};

function getEvents(request, response) {
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();

            events = [];

            const database = client.db(db);
            const eventscollection = database.collection('events');
            const eventsdata = await eventscollection.find();

            while(await eventsdata.hasNext()) {
                const event = await eventsdata.next();
                events.push(event);
            }

            response.setHeader('Content-Type', 'application/json');
            response.send(events);
      
        } catch (err) {
          console.log(err.stack);
        }

        await client.close();
    })();
};

function getNews(request, response) {
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();

            news = [];

            const database = client.db(db);
            const newscollection = database.collection('newsdata');
            const newsdata = await newscollection.find();

            while(await newsdata.hasNext()) {
                const newsitem = await newsdata.next();
                news.push(newsitem);
            }

            response.setHeader('Content-Type', 'application/json');
            response.send(news);
      
        } catch (err) {
          console.log(err.stack);
        }

        await client.close();
    })();
};

function getFeatured(request, response) {
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();

            featured = [];

            const database = client.db(db);
            const featuredcollection = database.collection('featured');
            const featureddata = await featuredcollection.find();

            while(await featureddata.hasNext()) {
                const featureditem = await featureddata.next();
                featured.push(featureditem);
            }

            response.setHeader('Content-Type', 'application/json');
            response.send(featured);
      
        } catch (err) {
          console.log(err.stack);
        }

        await client.close();
    })();
};

function getCompliance(request, response) {
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();

            compliance = [];

            const database = client.db(db);
            const compliancecollection = database.collection('compliance');
            const compliancedata = await compliancecollection.find();

            while(await compliancedata.hasNext()) {
                const compliancepage = await compliancedata.next();
                compliance.push(compliancepage);
            }

            response.setHeader('Content-Type', 'application/json');
            response.send(compliance);
      
        } catch (err) {
          console.log(err.stack);
        }

        await client.close();
    })();
};

function getArtifact(request, response) {
    var ObjectId = Mongo.ObjectId;
    let findId = new ObjectId(request.params.id)
    console.log(findId);
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('artifacts');
            const artifact = await collection.findOne({"_id" : findId});
            response.setHeader('Content-Type', 'application/json');
            response.send(artifact);
      
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

function getPerson(request, response) {
    var ObjectId = Mongo.ObjectId;
    let findId = new ObjectId(request.params.id)
    console.log(findId);
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('persons');
            const person = await collection.findOne({"_id" : findId});
            response.setHeader('Content-Type', 'application/json');
            response.send(person);
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

function getEvent(request, response) {
    var ObjectId = Mongo.ObjectId;
    let findId = new ObjectId(request.params.id)
    console.log(findId);
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('events');
            const event = await collection.findOne({"_id" : findId});
            response.setHeader('Content-Type', 'application/json');
            response.send(event);
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

function getCompliancepage(request, response) {
    let findId = request.params.id;
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('compliance');
            const compliancepage = await collection.findOne({"category" : findId});
            response.setHeader('Content-Type', 'application/json');
            response.send(eval(compliancepage));
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

function getNewsitem(request, response) {
    let findId = request.params.id;
    (async function() {
        const client = new MongoClient(uri, { useUnifiedTopology: true});
      
        try {
            await client.connect();
            const database = client.db(db);
            const collection = database.collection('newsdata');
            const newspage = await collection.findOne({"uniquename" : findId});
            response.setHeader('Content-Type', 'application/json');
            response.send(eval(newspage));
        } catch (err) {
            console.log(err.stack);
        }
        await client.close();
    })();
};

function deleteItem(request, response) {
    var requestURL = request.url.split('/');
    var dataType = eval(requestURL[1]);
    var deleteId = request.params.id;

    var singleDeleteItem = dataType.content.find(dataType => dataType.id === deleteId);
    var delIndex = dataType.content.findIndex(dataType => dataType.id === deleteId);

    if (singleDeleteItem === undefined) {
        response.send(deleteId + ' is not a valid ID.');
    } else {
        var correctedData = [
            ...dataType.content.slice(0, delIndex),
            ...dataType.content.slice(delIndex + 1)
        ];

        if (requestURL[1] == 'artifacts') {
            allData.artifacts.content = correctedData;
        };
        if (requestURL[1] == 'persons') {
            allData.persons.content = correctedData;
        };
        if (requestURL[1] == 'events') {
            allData.events.content = correctedData;
        };

        fs.writeFile( 'data/archivedata.json', JSON.stringify( allData ), function(err) {
            response.status(200).end('OK');
        });
        response.send(deleteId + ' is deleted successfully.');
    }
};

function editItem(request, response) {
    let requestURL = request.url.split('/');
    let dataType = eval(requestURL[1]);
    let editId = request.params.id;

    let singleEditItem = dataType.content.find(dataType => dataType.id === editId);
    let editIndex = dataType.content.findIndex(dataType => dataType.id === editId);

    if(editId == 'new') {
        let newItem;
        newItem = request.body;
        dataType.content.unshift(newItem);

        fs.writeFile( 'data/archivedata.json', JSON.stringify( allData ), function(err) {
            response.status(200).end('OK');
        });
        response.send('Successfully created.');
    } else if (singleEditItem) {
        editedItem = request.body;

        let editedData = [
            ...dataType.content.slice(0, editIndex),
            ...dataType.content.slice(editIndex + 1)
        ];
        editedData.splice(editIndex, 0, editedItem);

        if (requestURL[1] == 'artifacts') {
            allData.artifacts.content = editedData;
        };
        if (requestURL[1] == 'persons') {
            allData.persons.content = editedData;
        };
        if (requestURL[1] == 'events') {
            allData.events.content = editedData;
        };
    
         fs.writeFile( 'data/archivedata.json', JSON.stringify( allData ), function(err) {
             response.status(200).end('OK');
        });

        response.send('Successfully changed.');
    } else {
        response.send('Not a valid ' + dataType.name + '-ID.');
    }
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
    getArtifacts,
    getPersons,
    getEvents,
    getNews,
    getFeatured,
    getCompliance,
    getArtifact,
    getPerson,
    getEvent,
    getCompliancepage,
    getNewsitem,
    deleteItem,
    editItem,
    editFeatured,
    editNews,
    editCompliance,
    loadInstructions
};
