const bp = require( 'body-parser' );
const fs = require( 'fs' );

let allData = {};
let featured = [];
let news = [];
let compliance;
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

function editFeatured(request, response) {
    let tempFeaturesObj = Object.keys(JSON.parse(JSON.stringify(request.body)));
    let editedFeatures;
    editedFeatures = JSON.parse(tempFeaturesObj[0]);

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

    let tempNewsObj = Object.keys(JSON.parse(JSON.stringify(request.body)));
    console.log(tempNewsObj);

    let editedNews;
    editedNews = JSON.parse(tempNewsObj[0]);

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

    let tempComplianceObj = Object.keys(JSON.parse(JSON.stringify(request.body)));
    let editedCompliancePages;
    editedCompliancePages = JSON.parse(tempComplianceObj[0]);

    compliance.content[0].id=editedCompliancePages.content[0].id;
    compliance.content[0].category=editedCompliancePages.content[0].category;
    compliance.content[0].title=editedCompliancePages.content[0].title;
    compliance.content[0].firstimage=editedCompliancePages.content[0].firstimage;
    compliance.content[0].secondimage=editedCompliancePages.content[0].secondimage;
    compliance.content[0].articletext=editedCompliancePages.content[0].articletext;

    compliance.content[1].id=editedCompliancePages.content[1].category;
    compliance.content[1].category=editedCompliancePages.content[1].category;
    compliance.content[1].title=editedCompliancePages.content[1].title;
    compliance.content[1].firstimage=editedCompliancePages.content[1].firstimage;
    compliance.content[1].secondimage=editedCompliancePages.content[1].secondimage;
    compliance.content[1].articletext=editedCompliancePages.content[1].articletext;

    compliance.content[2].id=editedCompliancePages.content[2].category;
    compliance.content[2].category=editedCompliancePages.content[2].category;
    compliance.content[2].title=editedCompliancePages.content[2].title;
    compliance.content[2].firstimage=editedCompliancePages.content[2].firstimage;
    compliance.content[2].secondimage=editedCompliancePages.content[2].secondimage;
    compliance.content[2].articletext=editedCompliancePages.content[2].articletext;

    compliance.content[3].id=editedCompliancePages.content[3].category;
    compliance.content[3].category=editedCompliancePages.content[3].category;
    compliance.content[3].title=editedCompliancePages.content[3].title;
    compliance.content[3].firstimage=editedCompliancePages.content[3].firstimage;
    compliance.content[3].secondimage=editedCompliancePages.content[3].secondimage;
    compliance.content[3].articletext=editedCompliancePages.content[3].articletext;

    compliance.content[4].id=editedCompliancePages.content[4].category;
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
    loadData,
    instructions,
    getAll,
    getItems,
    getItem,
    deleteItem,
    editItem,
    editFeatured,
    editNews,
    getNewsItem,
    editCompliance
};
