var express = require('express');
var router = express.Router();
var mongodb = require('mongodb')

/* GET home page. */
router.get('/', function(req, res, next) {
	//Below logs visitors IP addresses
	var uri = "mongodb://readonly:gjvlejh8567jcvneu8@ds059821.mongolab.com:59821/heroku_app33948089"
	var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
  	var d = new Date();
  	var mongoobject = {"ipAddress" : ip,
  						            "date": d};
  	mongodb.MongoClient.connect(uri, function(err, db) {
  		if(err) throw err;
  		var ipAddresses = db.collection('ipaddresses');
      var voters = db.collection('voters');
  		ipAddresses.insert(mongoobject, function(err, result) {
  		if(err) throw err;
  		})
      voters.find({processed:1}, {limit:1, fields:{latitude:1, longitude:1, finishedSqFt:1, taxAssessment:1, _id:0}}).toArray(function(err, items) {
        if (err) throw err;
          res.render('index', { zillowData: items }); 
        })
      })
  	})

module.exports = router;
