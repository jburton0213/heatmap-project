var express = require('express');
var router = express.Router();
var pg = require('pg');
//var dbURL = "postgres://leyorvqudqwkay:47OUnM4sVxGeiAn-MJIr7-ErRp@ec2-50-19-249-214.compute-1.amazonaws.com:5432/d7bp9obaffs826"
var dbURL = process.env.DATABASE_URL;
/* GET home page. */
router.get('/', function(req, res, next) {
  var ipAddress = req.connection.remoteAddress;
  var d = new Date();
  var query = "insert into ipaddresses values(\'" + ipAddress + "\', \'" + d + "\')" 
  pg.connect(dbURL, function(err, client) {
  	client.query(query, function(err, result) {
  		done();
  		if(err) console.log(err);
  		client.end();
  		res.render('index', { title: 'Express' });
  	})
  })
});

module.exports = router;
