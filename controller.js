const bp = require( 'body-parser' );
const fs = require( 'fs' );

let allData = {};
let featured = [];
let news = [];
let instructiontext = ``;

function instructions(request, response) {
    response.send(instructiontext);
}

function loadData() {

    fs.readFile('data/archivedata.json', 'utf8', function(err, contents) {
        allData = JSON.parse(contents);
        artifacts = allData.artifacts;
        persons = allData.persons;
        events = allData.events;
    });

    fs.readFile('data/featured.json', 'utf8', function(err, contents) {
        var tempData = JSON.parse(contents);
        featured = tempData;
    });

    fs.readFile('data/newsdata.json', 'utf8', function(err, contents) {
        var tempData = JSON.parse(contents);
        news = tempData;
    });

    fs.readFile('data/compliance.json', 'utf8', function(err, contents) {
        var tempData = JSON.parse(contents);
        compliance = tempData;
    });

    fs.readFile('data/instructions.html', 'utf8', function(err, contents) {
        instructiontext = contents;
    });

};

function getAll(request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.send(allData);
};

function getItems(request, response) {
    var tempURL = request.url.split('/');
    var requestURL = eval(tempURL[1]);
    response.setHeader('Content-Type', 'application/json');
    response.send(eval(requestURL));
};

function getItem(request, response) {
    var requestURL = request.url.split('/');
    var dataType = eval(requestURL[1]);
    var itemId = request.params.id;
    var singleItem = dataType.content.find(dataType => dataType.id === itemId);
    if(singleItem) {
        response.setHeader('Content-Type', 'application/json');
        response.send(singleItem);        
    } else {
        response.send(itemId + ' is not a valid ID for ' + requestURL[1] + '.');
    }
};

function getNewsItem(request, response) {
    var itemId = request.params.id;
    var newsItems = Object.values(news.content);
    var singleItem = newsItems.find(newsItems => newsItems.id === itemId);
    if(singleItem) {
        response.setHeader('Content-Type', 'application/json');
        response.send(singleItem);        
    } else {
        response.send(itemId + ' is not a valid ID for news.');
    }
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

function editFeatured(request, response) {
    console.log('Kommt an!');
    let tempObj = Object.keys(JSON.parse(JSON.stringify(request.body)));

    let editedFeatures;

    editedFeatures = JSON.parse(tempObj[0]);

    console.log(editedFeatures[0].image);

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

// Muss geändert werden
function editItem(request, response) {
    var requestURL = request.url.split('/');
    var dataType = eval(requestURL[1]);
    var editId = request.params.id;
    var checkId = parseInt(editId);
    var maxId = dataType.content.length;
    var today = new Date();

    if(editId == 'new') {
        editId = maxId;

        var newItem = {
            id: editId,
            name: request.body.name,
            shortDescription: request.body.shortDescription,
            longDescription: request.body.longDescription,
            date: request.body.firstAppearance,
            tags: request.body.tags,
            images: request.body.images,
            videos: request.body.videos,
            websiteURLs: request.body.websiteURLs,
            assets: request.body.assets,
            artifactIDs: request.body.artifactIDs,
            personIDs: request.body.personIDs,
            eventsIDs: request.body.eventIDs,
            published: request.body.published,
            createdOn: request.body.createdOn,
            lastChangeOn: today
        };

        dataType.content.push(newItem);
        // Die Daten sollte hier gespeichert werden.
        response.send('Item ' + dataType.name + ' ' + editId + ' successfully created.');
    } else if (checkId < maxId) {
        var changedItem = {
            id: editId,
            name: request.body.name,
            shortDescription: request.body.shortDescription,
            longDescription: request.body.longDescription,
            date: request.body.firstAppearance,
            tags: request.body.tags,
            images: request.body.images,
            videos: request.body.videos,
            websiteURLs: request.body.websiteURLs,
            assets: request.body.assets,
            artifactIDs: request.body.artifactIDs,
            personIDs: request.body.personIDs,
            eventsIDs: request.body.eventIDs,
            published: request.body.published,
            createdOn: request.body.createdOn,
            lastChangeOn: today
        };
        dataType.content[editId] = changedItem;
        // Die Daten sollte hier gespeichert werden.
        response.send('Item ' + dataType.name + ' ' + editId + ' successfully changed.');
    } else {
        response.send('Not a valid ' + dataType.name + '-ID.');
    }
};

// Muss geändert werden
function editNews(request, response) {
    var editId = request.params.id;
    var checkId = parseInt(editId);
    var maxId = news.length;

    if(editId == 'new') {
        editId = maxId;
        var newNewsitem = {
            id: editId,
            title: request.body.title,
            urlAddress: request.body.urlAddress,
            image: request.body.image,
            largeimage: request.body.largeimage,
            shortdescription: request.body.description,
            articletext: request.body.articletext,
        };
        news.push(newNewsitem);
        // Die Daten sollte hier gespeichert werden.
        response.send('News item ' + editId + ' successfully created.');
    } else if (checkId < news.length){
        var changedNewsitem = {
            id: editId,
            title: request.body.title,
            urlAddress: request.bsody.urlAddress,
            image: request.body.image,
            largeimage: request.body.largeimage,
            shortdescription: request.body.description,
            articletext: request.body.articletext,
        };
        news[editId] = changedNewsitem;
        // Die Daten sollte hier gespeichert werden.
        response.send('News item ' + editId + ' successfully changed.');
    } else {
        response.send('Not a valid ID for a news item.');
    }
};

module.exports = {
    loadData,
    instructions,
    getAll,
    getItems,
    getItem,
    deleteItem,
    editItem,
    editFeatured,
    editNews,
    getNewsItem
};
