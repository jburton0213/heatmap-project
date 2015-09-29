	var express = require('express');
	var router = express.Router();

//Need to get sidebar list data from mongo
/* GET home page. */
router.get('/', function(req, res) {

	var TIEDIconnectionstring = require('../lib/TIEDImongoconnection');
	var MongoClient = require('mongodb').MongoClient
    	, format = require('util').format;
    	MongoClient.connect(TIEDIconnectionstring, function (err, db) {
        if (err) console.log(err);
        var collection = db.collection('edistatistics');
        collection.distinct('customercode', function (err, docs) {
            if (err) throw err;
            res.render('index', {docs: JSON.stringify(docs)});
            db.close();
        });
    });
});
module.exports = router;