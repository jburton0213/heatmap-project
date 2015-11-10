#! /app/bin/node
var Promise = require("bluebird");
var MongoDB = Promise.promisifyAll(require("mongodb"));
var MongoClient = Promise.promisifyAll(MongoDB.MongoClient);
var http = Promise.promisifyAll(require('http'));
var mongouri = "mongodb://jburton0213:Mothman1131!@ds059821.mongolab.com:59821/heroku_app33948089";
var zwsID = "X1-ZWz1azjiwzdj4b_4vl2o";
var xml2js = Promise.promisifyAll(require('xml2js'));
var xpath = require("xml2js-xpath");
var util = require('util');
var rp = require('request-promise');
var notFoundCount = 0;
var successfullyProcessedCount = 0;
var unknownErrorCount = 0;
var apiLimitReachedCount = 0;

function checkIfPromisifyed(required) {
    var aaa = (util.inspect(required, { showHidden: true }));
    console.log("Nope!")
}

//checkIfPromisifyed(rp)
process1000Voters();
//test()

function process1000Voters() {
    get1000Voters()
    .then(function (docs) {
        return Promise.map(docs, addZillowData)
    })
        .then(function (objects) {
            batchUpdate(objects)
        })
    }

function get1000Voters() {
    return new Promise(function (resolve, reject) {
        MongoClient.connectAsync(mongouri)
        .then(function (db) {
            return db.collection('voters').find({"processed": 0, "address": { $nin: [/P.*O BOX.*/, /POST.*/] } }, { "ID": 1, "address": 1, "city": 1, "state": 1, "zip": 1, "_id": 0 }, { "limit": 100 }).toArrayAsync();
        }).then(function (docs) {
            resolve(docs);
        }).catch(function (err) {
            reject(err);
            })
    })
}

function addZillowData(element) {
    var url = "http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=" + zwsID + "&address=" + encodeURIComponent(element.address) + "&citystatezip=" + element.city + "%2c+" + element.state + "+" + element.zip;
    return rp(url)
    .then(xml2js.parseStringAsync)
    .then(function (xmlDoc) {
        var pre;
        var code = (xpath.find(xmlDoc, "//message//code")[0])
        if (code == 0) pre = processSuccessful(xmlDoc, element)
        else if (code == 508) pre = processNotFound(xmlDoc, element);
        else if (code == 7) pre = processAPILimitReached(xmlDoc, element);
        else pre = processUnknownError(xmlDoc, element)
        return pre;
    })
    .catch(console.error);
}

function processSuccessful(result, element) {
    APIobject = new Object();
    if (typeof xpath.find(result, "//latitude")[0] !== "undefined") APIobject.latitude = xpath.find(result, "//latitude")[0];;
    if (typeof xpath.find(result, "//longitude")[0] !== "undefined") APIobject.longitude = xpath.find(result, "//longitude")[0];
    if (typeof xpath.find(result, "//zestimate//amount")[0] !== "undefined") APIobject.zestimate = (xpath.find(result, "//zestimate//amount")[0])._;
    if (typeof xpath.find(result, "//taxAssessmentYear")[0] !== "undefined") APIobject.taxAssessmentYear = xpath.find(result, "//taxAssessmentYear")[0];
    if (typeof xpath.find(result, "//taxAssessment")[0] !== "undefined") APIobject.taxAssessment = xpath.find(result, "//taxAssessment")[0]; 
    if (typeof xpath.find(result, "//lastSoldPrice")[0] !== "undefined") {
        if (typeof xpath.find(result, "//lastSoldPrice")[0] == "string") APIobject.lastSoldPrice = (xpath.find(result, "//lastSoldPrice")[0]);
        if (typeof xpath.find(result, "//lastSoldPrice")[0]._ == "string") APIobject.lastSoldPrice = (xpath.find(result, "//lastSoldPrice")[0]._)
    }
    if (typeof xpath.find(result, "//yearBuilt")[0] !== "undefined") APIobject.yearBuilt = xpath.find(result, "//yearBuilt")[0];
    if (typeof xpath.find(result, "//lotSizeSqFt")[0] !== "undefined") APIobject.lotSizeSqFt = xpath.find(result, "//lotSizeSqFt")[0];
    if (typeof xpath.find(result, "//finishedSqFt")[0] !== "undefined") APIobject.finishedSqFt = xpath.find(result, "//finishedSqFt")[0];
    if (typeof xpath.find(result, "//bathrooms")[0] !== "undefined") APIobject.bathrooms = xpath.find(result, "//bathrooms")[0];
    if (typeof xpath.find(result, "//bedrooms")[0] !== "undefined") APIobject.bedrooms = xpath.find(result, "//bedrooms")[0];
    if (typeof xpath.find(result, "//lastSoldDate")[0] !== "undefined") APIobject.lastSoldDate = xpath.find(result, "//lastSoldDate")[0];
    if (typeof xpath.find(result, "//useCode")[0] !== "undefined") APIobject.dwellingType = xpath.find(result, "//useCode")[0];
    APIobject.updatedDate = timeStamp();
    APIobject.ID = element.ID;
    APIobject.processed = 1
    successfullyProcessedCount++;
    return APIobject;
}

function batchUpdate(APIobjects) {
    MongoClient.connectAsync(mongouri)
    .then(function (db) {
        var batch = db.collection('voters').initializeUnorderedBulkOp();
        APIobjects.forEach(function (obj) {
            if (obj.processed != null) {
                batch.find({ "ID": obj.ID })
                .updateOne({
                    $set: {
                        "latitude": obj.latitude,
                        "longitude": obj.longitude,
                        "zestimate": obj.zestimate,
                        "taxAssessmentYear": obj.taxAssessmentYear,
                        "taxAssessment": obj.taxAssessment,
                        "lastSoldPrice": obj.lastSoldPrice,
                        "yearBuilt": obj.yearBuilt,
                        "lotSizeSqFt": obj.lotSizeSqFt,
                        "finishedSqFt": obj.finishedSqFt,
                        "bathrooms": obj.bathrooms,
                        "bedrooms": obj.bedrooms,
                        "lastSoldDate": obj.lastSoldDate,
                        "createdDate": obj.createdDate,
                        "updatedDate": obj.updatedDate,
                        "processed": obj.processed,
                        "dwellingType": obj.dwellingType
                    }
                })
            }
        })
        batch.execute(function (err, results) {
            if (err) throw err;
            MongoClient.connectAsync(mongouri)
            .then(function (db) {
                return db.collection('logs').insertOne({
                    "date" : timeStamp(),
                    "notFoundCount" : notFoundCount, 
                    "successfullyProcessedCount" : successfullyProcessedCount, 
                    "unknownErrorCount" : unknownErrorCount, 
                    "apiLimitReachedCount" : apiLimitReachedCount,
                    "docsInBatchInsertToMongo" : results.nModified,
                    "batchInsertToMongoSuccessfull" : results.isOk()
                })
            }).then(function () {
                console.log("DONE!");
                process.exit();
            })
        })
    })
}

function test() {
    var url = "http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz1azjiwzdj4b_4vl2o&address=2685%20TIFFANY%20ST&citystatezip=CONOVER%2c+NC+28613"
    rp(url)
    .then(function (res) { 
        console.log(res)
    })
    .catch(console.error);
}

function processNotFound(result, element) {
    APIobject = new Object();
    APIobject.ID = element.ID
    APIobject.processed = "Not Found";
    APIobject.updatedDate = timeStamp();
    notFoundCount++;
    return APIobject;
}

function processAPILimitReached(result, element) {
    APIobject = new Object();
    APIobject.ID = element.ID
    APIobject.processed = "API Limit Reached"
    APIobject.updatedDate = timeStamp();
    apiLimitReachedCount++;
    return APIobject;
}

function processUnknownError(result, element) {
    APIobject = new Object();
    APIobject.ID = element.ID
    APIobject.processed = "Unknown Error"
    APIobject.updatedDate = timeStamp();
    unknownErrorCount++;
    return APIobject;
}

function timeStamp() {
    var now = new Date();    
    var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];
    var time = [now.getHours(), now.getMinutes(), now.getSeconds()];
    var suffix = (time[0] < 12) ? "AM" : "PM";
    time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for (var i = 1; i < 3; i++) {
        if (time[i] < 10) {
            time[i] = "0" + time[i];
        }
    }
    return date.join("/") + " " + time.join(":") + " " + suffix;
}