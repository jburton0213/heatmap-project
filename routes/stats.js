var express = require('express');
var router = express.Router();
var mongodb = require('mongodb')

/* GET home page. */
router.get('/:city', function (req, res, next) {

    //var uri = "mongodb://jburton0213:Mothman1131!@ds059821.mongolab.com:59821/heroku_app33948089"
    var uri = "mongodb://readonly:gjvlejh8567jcvneu8@ds059821.mongolab.com:59821/heroku_app33948089"
    var data = new Object();
    data.party = new Array();
    data.race = new Array();
    data.gender = new Array();
    data.age = new Array();
    
    if (req.params.city != 'county') {
        var city = req.params.city.toUpperCase();
        data.title = ucwords(req.params.city);          
    } else {
        var city = ".";
        data.title = 'County-Wide';
    }
    
    

    mongodb.MongoClient.connect(uri, function (err, db) {
        if (err) throw err
        var voters = db.collection('voters');
        
        voters.find({ party: "DEM", city: new RegExp('.*' + city + '.*')}, { fields: { processed: 1 } }).count(function (err, count) {
            if (err) throw err
            var affs = JSON.stringify({ name : 'DEM', y : count })
            var ddds = affs.replace(/\"([^(\")"]+)\":/g,"$1:");
            data.party.push(ddds)
            
            voters.find({ party: "REP", city: new RegExp('.*' + city + '.*') }, { fields: { processed: 1 } }).count(function (err, count) {
                if (err) throw err
                var affd = JSON.stringify({ name : 'REP', y : count })
                var dddd = affd.replace(/\"([^(\")"]+)\":/g,"$1:");
                data.party.push(dddd)
                
                voters.find({ party: "UNA", city: new RegExp('.*' + city + '.*') }, { fields: { processed: 1 } }).count(function (err, count) {
                    if (err) throw err
                    var afff = JSON.stringify({ name : 'UNA', y : count })
                    var dddf = afff.replace(/\"([^(\")"]+)\":/g,"$1:");
                    data.party.push(dddf)
                    
                    voters.find({ party: "LIB", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                        if (err) throw err;
                        var affg = JSON.stringify({ name : 'LIB', y : count })
                        var dddg = affg.replace(/\"([^(\")"]+)\":/g,"$1:");
                        data.party.push(dddg)
                        
                        voters.find({ race  : "W", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                            if (err) throw err;
                            var aff = JSON.stringify({ name : 'W', y : count })
                            var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                            data.race.push(ddd)
                            
                            voters.find({ race  : "O", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                if (err) throw err;
                                var aff = JSON.stringify({ name : 'O', y : count })
                                var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                data.race.push(ddd)
                                
                                voters.find({ race  : "B", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                    if (err) throw err;
                                    var aff = JSON.stringify({ name : 'B', y : count })
                                    var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                    data.race.push(ddd)
                                    
                                        voters.find({ race  : "U", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                            if (err) throw err;
                                            var aff = JSON.stringify({ name : 'U', y : count })
                                            var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                            data.race.push(ddd)
                                            
                                            voters.find({ race  : "M", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                if (err) throw err;
                                                var aff = JSON.stringify({ name : 'M', y : count })
                                                var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                data.race.push(ddd)
                                                
                                                voters.find({ race  : "A", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                    if (err) throw err;
                                                    var aff = JSON.stringify({ name : 'A', y : count })
                                                    var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                    data.race.push(ddd)
                                                    
                                                    voters.find({ race  : "I", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                        if (err) throw err;
                                                        var aff = JSON.stringify({ name : 'I', y : count })
                                                        var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                        data.race.push(ddd)
                                                        
                                                        voters.find({ gender  : "M", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                            if (err) throw err; 
                                                            var af = JSON.stringify({ name : 'Male', y : count })
                                                            var dd = af.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                            data.gender.push(dd);
                                                            
                                                            voters.find({ gender  : "F", city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                if (err) throw err; 
                                                                var aff = JSON.stringify({ name : 'Female', y : count })
                                                                var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                data.gender.push(ddd);
                                                                
                                                                voters.find({ age  : { $lt: 20 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                    if (err) throw err; 
                                                                    var aff = JSON.stringify({ name : 'Teens', y : count })
                                                                    var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                    data.age.push(ddd);
                                                                
                                                                    voters.find({ age  : { $gt: 19, $lt: 30 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                        if (err) throw err; 
                                                                        var     aff = JSON.stringify({ name : '20s', y : count })
                                                                        var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                        data.age.push(ddd);
                                                                        
                                                                        voters.find({ age  : { $gt: 29, $lt: 40 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                            if (err) throw err; 
                                                                            var aff = JSON.stringify({ name : '30s', y : count })
                                                                            var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                            data.age.push(ddd);
                                                                            
                                                                            voters.find({ age  : { $gt: 39, $lt: 50 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                                if (err) throw err; 
                                                                                var aff = JSON.stringify({ name : '40s', y : count })
                                                                                var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                                data.age.push(ddd);
                                                                                
                                                                            voters.find({ age  : { $gt: 49, $lt: 60 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                                if (err) throw err; 
                                                                                var aff = JSON.stringify({ name : '50s', y : count })
                                                                                var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                                data.age.push(ddd);
                                                                                
                                                                                voters.find({ age  : { $gt: 59, $lt: 70 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                                    if (err) throw err; 
                                                                                    var aff = JSON.stringify({ name : '60s', y : count })
                                                                                    var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                                    data.age.push(ddd);
                                                                                    
                                                                                    voters.find({ age  : { $gt: 69, $lt: 80 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                                        if (err) throw err; 
                                                                                        var aff = JSON.stringify({ name : '70s', y : count })
                                                                                        var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                                        data.age.push(ddd);
                                                                                        
                                                                                        voters.find({ age  : { $gt: 79, $lt: 90 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                                            if (err) throw err; 
                                                                                            var aff = JSON.stringify({ name : '80s', y : count })
                                                                                            var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                                            data.age.push(ddd);
                                                                                            
                                                                                            voters.find({ age  : { $gt: 89, $lt: 100 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                                                if (err) throw err; 
                                                                                                var aff = JSON.stringify({ name : '90s', y : count })
                                                                                                var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                                                data.age.push(ddd);
                                                                                                
                                                                                                voters.find({ age  : { $gt: 99 }, city: new RegExp('.*' + city + '.*') }, { fields: {processed: 1 } }).count(function (err, count) {
                                                                                                    if (err) throw err; 
                                                                                                    var aff = JSON.stringify({ name : '100s', y : count })
                                                                                                    var ddd = aff.replace(/\"([^(\")"]+)\":/g,"$1:");
                                                                                                    data.age.push(ddd);

                                                                                                    res.render('stats', { data : data });
                                                                                                    
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })  
                                                            })
                                                        })
                                                    })
                                                })
                                            })    
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })


                            
module.exports = router;

function ucwords (str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
        return $1.toUpperCase();
    });
}