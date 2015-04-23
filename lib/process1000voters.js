var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var http = require('http');
var mongouri = "mongodb://jburton0213:Mothman1131!@ds059821.mongolab.com:59821/heroku_app33948089";
var zwsID = "X1-ZWz1azjiwzdj4b_4vl2o";
var parseString = require('xml2js').parseString;





function processVoters() {
	var voters = get1000Voters();

}

function get1000Voters() {
	MongoClient.connect(mongouri, function(err, db) {
		if(err) consol.log(err) ;
		var votercollection = db.collection('voters');
		//var query = "{\"processed\": 0, \"address\":{$nin:[/P.*O BOX.*/, /POST.*/]}},{\"id\":1, \"address\":1, \"_id\":0},{\"limit\":1000}"
		votercollection.find({"processed": 0, "address":{$nin:[/P.*O BOX.*/, /POST.*/]}},{"ID":1, "address":1, "city":1, "state":1, "zip":1, "_id":0},{"limit":1000}).toArray(function(err, docs) {
			if(err) throw err;
			debugger;
			docs.forEach(callZillowAPI);
			//docs.forEach(function(doc){console.log(doc)});
		});
	});
};

function callZillowAPI(element, index, array) {

	var url = "http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=" + zwsID + "&address=" + encodeURIComponent(element.address) + "&citystatezip=" + element.city + "%2c+" + element.state + "+" + element.zip;
	http.get(url, function(res) {
		res.on("data", function (chunk) {
			addZillowData(element, chunk.toString())
			//console.log(chunk.toString())
		})
	}).on('error', function(e) {
		console.log("Got error: " + e.message);
	}).on('end', function(end) {
		console.log(end)
	})
}

function addZillowData(element, XMLString) {
	debugger;
	parseString(XMLString, function (err, result) {
		debugger;
		//console.dir(result.SearchResults);
		console.dir(result)
	})

}

processVoters();


function listAllProperties(o){     
	var objectToInspect;     
	var result = [];
	
	for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)){  
		result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
	}
	
	console.log(result); 
}