var connectionstrings = require('./connectionstrings');
var Promise = require("bluebird");
var MongoDB = Promise.promisifyAll(require("mongodb"));
var MongoClient = Promise.promisifyAll(MongoDB.MongoClient);

var express = require('express');
var router = express.Router();
var mongodb = require('mongodb')

/* GET home page. */
router.get('/:city', function (req, res, next) { 

    if (req.params.city != 'county') {
        var city = req.params.city.toUpperCase();
        data.title = ucwords(req.params.city);          
    } else {
        var city = ".";
        data.title = 'County-Wide';
    }

    var party = new Promise((resolve, reject) => {
        MongoClient.connectAsync(connectionstrings.mongoinsert)
        .then(function (db) {
        return db.collection('voters')
            .aggregateAsync([
                {$match: { city: city}},
                {$group: {_id: "$party", count: {$sum: 1}}}
            ]).then(function(results) {
                resolve(results)
            })
        })
    })

    var race = new Promise((resolve, reject) => {
        MongoClient.connectAsync(connectionstrings.mongoinsert)
        .then(function (db) {
        return db.collection('voters')
            .aggregateAsync([
                {$match: { city: city}},
                {$group: {_id: "$race", count: {$sum: 1}}}
            ]).then(function(results) {
                resolve(results)
            })
        })
    })

    var gender = new Promise((resolve, reject) => {
      MongoClient.connectAsync(connectionstrings.mongoinsert)
      .then(function (db) {
      return db.collection('voters')
        .aggregateAsync([
            {$match: { city: city}},
            {$group: {_id: "$gender", count: {$sum: 1}}}
        ]).then(function(results) {
                resolve(results)
            })
        })
    })

    var age = new Promise((resolve, reject) => {
      MongoClient.connectAsync(connectionstrings.mongoinsert)
      .then(function (db) {
      return db.collection('voters')
        .aggregateAsync([
            {$match: { city: city}},
            {$group: {_id: "$age", count: {$sum: 1}}}
        ]).then(function(results) {
            var ages = []
            results.forEach(function(value, index) {
                var agegroup = GetAgeGroup(value._id)
                if (ages[agegroup]) {
                    ages[agegroup].count = ages[agegroup].count + value.count
                } else {
                    ages[agegroup] = {count : value.count}
                }
            })
                resolve(ages)
            })
        })
})


    Promise.all([party, race, age]).then(values => {
    console.log(values);

    res.render('stats', { data : values });

    }).catch(reason => {
    console.log(reason)
    }) 


})

function GetAgeGroup(x) {
    var group;
    switch(true){
        case (x < 20):
            group = "<20";
            break;
        case (x > 19 && x < 30):
            group = "20s";
            break;
        case x > 29 && x < 40:
            group = "30s";
            break;
        case x > 39 && x < 50:
            group = "40s";
            break;
        case x > 49 && x < 60:
            group = "50s";
            break;
        case x > 59 && x < 70:
            group = "60s";
            break;                        
        case x > 69 && x < 80:
            group = "70s";
            break;
        case x > 79 && x < 90:
            group = "80s";
            break;
        case x > 89 && x < 100:
            group = "90s";
            break;
        case x > 99:
            group = "100s";
            break;   
    }
    return group;
}


module.exports = router;