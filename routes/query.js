var express = require('express');
var router = express.Router();
var mongodb = require('mongodb')

router.get('/', function (req, res, next) {
    
	var uri = "mongodb://readonly:gjvlejh8567jcvneu8@ds059821.mongolab.com:59821/heroku_app33948089"
    
    if (req.query.name) req.query.name = new RegExp('.*' + req.query.name.toUpperCase().replace(" ",".*").replace(",",".*") + '.*')
    if (req.query.bedrooms) req.query.bedrooms = parseInt(req.query.bedrooms);
    if (req.query.bathrooms) req.query.bathrooms = parseInt(req.query.bathrooms);
    if (req.query.zip) req.query.zip = new RegExp('.*' + parseInt(req.query.zip) + '.*');
    if (req.query.city) req.query.city = new RegExp('.*' + req.query.city.toUpperCase() + '.*')
    if (req.query.party) req.query.party = new RegExp('.*' + req.query.party.toUpperCase() + '.*');
    if (req.query.address) req.query.address = new RegExp('.*' + req.query.address.toUpperCase() + '.*');
    if (req.query.gender) req.query.gender = new RegExp('.*' + req.query.gender.toUpperCase() + '.*');
    
    // if (req.query.bedrooms) req.query.bedrooms = parseInt(req.query.bedrooms);
    // if (req.query.bathrooms) req.query.bathrooms = parseInt(req.query.bathrooms);
    // if (req.query.zip) req.query.zip = parseInt(req.query.zip);
    // if (req.query.city) req.query.city = req.query.city.toUpperCase();
    // if (req.query.party) req.query.party = req.query.party.toUpperCase();
    // if (req.query.address) req.query.address = req.query.address.toUpperCase();
    // if (req.query.gender) req.query.gender = req.query.gender.toUpperCase();

    mongodb.MongoClient.connect(uri, function (err, db) {
        if (err) throw err;
        var voters = db.collection('voters');
        voters.find(req.query, {limit: 10, fields: { _id: 0 }}).toArray(function (err, items) {
            if (err) throw err;
            res.send(items);
        })
    })
})
            
module.exports = router;