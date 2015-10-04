var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var http = require('http');
var mongouri = "mongodb://jburton0213:Mothman1131!@ds059821.mongolab.com:59821/heroku_app33948089";
var zwsID = "X1-ZWz1azjiwzdj4b_4vl2o";
var parseString = require('xml2js').parseString;
var xpath = require("xml2js-xpath");

processVoters();
//test()

function processVoters() {
    var voters = get1000Voters();
}

function get1000Voters() {
    MongoClient.connect(mongouri, function (err, db) {
        if (err) consol.log(err);
        var votercollection = db.collection('voters');
        //var query = "{\"processed\": 0, \"address\":{$nin:[/P.*O BOX.*/, /POST.*/]}},{\"id\":1, \"address\":1, \"_id\":0},{\"limit\":1000}"
        votercollection.find({ "processed": 1, "address": { $nin: [/P.*O BOX.*/, /POST.*/] } }, { "ID": 1, "address": 1, "city": 1, "state": 1, "zip": 1, "_id": 0 }, { "limit": 1 }).toArray(function (err, docs) {
            if (err) throw err;
            var processedVoters = [];
            docs.forEach(callZillowAPI);
        });
    });
};

function callZillowAPI(element, index, array) {
    var url = "http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=" + zwsID + "&address=" + encodeURIComponent(element.address) + "&citystatezip=" + element.city + "%2c+" + element.state + "+" + element.zip;
    http.get(url, function (res) {
        res.on("data", function (chunk) {

        })
    }).on('error', function (e) {
        console.log("Got error: " + e.message);
    }).on('end', function (end) {
        console.log(end)
    })
}

function checkMessageStatus(element, XMLString) {
    parseString(XMLString, function (err, result) {
        //There's seriously a typo in the results that I get back from the API at Zillow
        //code 7 = Error: this account has reached is maximum number of calls for today
        //code 508 = no exact match found for input address
        //code 0 = Request successfully processed
        var message = xpath.find(result, "//message//code")[0];
        if (message == 0) processSuccessful(result, element)
        if (message == 508) processNotFound(result, element)
        if (message == 7) process.exit();
    })
}

function processSuccessful(result, element) {
    APIobject = new Object();
    APIobject.latitude = xpath.find(result, "//latitude")[0];
    APIobject.longitude = xpath.find(result, "//longitude")[0];
    APIobject.zestimate = (xpath.find(result, "//zestimate//amount")[0])._;
    APIobject.taxAssessmentYear = xpath.find(result, "//taxAssessmentYear")[0];
    APIobject.taxAssessment = xpath.find(result, "//taxAssessment")[0]; 
    APIobject.lastSoldPrice = (xpath.find(result, "//lastSoldPrice")[0])._;
    APIobject.yearBuilt = xpath.find(result, "//yearBuilt")[0];
    APIobject.lotSizeSqFt = xpath.find(result, "//lotSizeSqFt")[0];
    APIobject.finishedSqFt = xpath.find(result, "//finishedSqFt")[0];
    APIobject.bathrooms = xpath.find(result, "//bathrooms")[0];
    APIobject.bedrooms = xpath.find(result, "//bedrooms")[0];
    APIobject.lastSoldDate = xpath.find(result, "//lastSoldDate")[0];
    APIobject.createdDate = xpath.find(result, "//longitude")[0];
    APIobject.updatedDate = timeStamp();
    console.log(APIobject.lastSoldPrice);
    console.log(APIobject.latitude);

    addProcessedVoterData(APIobject, element);
}

function addProcessedVoterData(APIobject, element) {


}

function test() {
    var xmlString = "<?xml version=\"1.0\" encoding=\"utf-8\"?><SearchResults:searchresults xsi:schemaLocation=\"http://www.zillow.com/static/xsd/SearchResults.xsd http://www.zillowstatic.com/vstatic/75660cb/static/xsd/SearchResults.xsd\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:SearchResults=\"http://www.zillow.com/static/xsd/SearchResults.xsd\"><request><address>7843 BANKHEAD RD</address><citystatezip>DENVER, NC 28037</citystatezip></request><message><text>Request successfully processed</text><code>0</code></message><response><results><result><zpid>71549714</zpid><links><homedetails>http://www.zillow.com/homedetails/7843-Bankhead-Rd-Denver-NC-28037/71549714_zpid/</homedetails><graphsanddata>http://www.zillow.com/homedetails/7843-Bankhead-Rd-Denver-NC-28037/71549714_zpid/#charts-and-data</graphsanddata><mapthishome>http://www.zillow.com/homes/71549714_zpid/</mapthishome><comparables>http://www.zillow.com/homes/comps/71549714_zpid/</comparables></links><address><street>7843 Bankhead Rd</street><zipcode>28037</zipcode><city>Denver</city><state>NC</state><latitude>35.560981</latitude><longitude>-81.001087</longitude></address><FIPScounty>37035</FIPScounty><useCode>SingleFamily</useCode><taxAssessmentYear>2014</taxAssessmentYear><taxAssessment>457000.0</taxAssessment><yearBuilt>2009</yearBuilt><lotSizeSqFt>107593</lotSizeSqFt><finishedSqFt>2734</finishedSqFt><bathrooms>2.5</bathrooms><bedrooms>3</bedrooms><totalRooms>7</totalRooms><lastSoldDate>04/21/2009</lastSoldDate><lastSoldPrice currency=\"USD\">75000</lastSoldPrice><zestimate><amount currency=\"USD\">513138</amount><last-updated>09/29/2015</last-updated><oneWeekChange deprecated=\"true\"></oneWeekChange><valueChange duration=\"30\" currency=\"USD\">5841</valueChange><valuationRange><low currency=\"USD\">425905</low><high currency=\"USD\">610634</high></valuationRange><percentile>0</percentile></zestimate><localRealEstate><region name=\"Denver\" id=\"24367\" type=\"city\"><zindexValue>242,900</zindexValue><links><overview>http://www.zillow.com/local-info/NC-Denver/r_24367/</overview><forSaleByOwner>http://www.zillow.com/denver-nc/fsbo/</forSaleByOwner><forSale>http://www.zillow.com/denver-nc/</forSale></links></region></localRealEstate></result></results></response></SearchResults:searchresults><!-- H:004  T:27ms  S:1206  R:Thu Oct 01 17:21:39 PDT 2015  B:4.0.20302-release_20150929-hoth.b664099~candidate.9db8b16 -->";
    parseString(xmlString, function (err, result) {
        var sss = xpath.find(result, "//latitude")[0];
        var dddd = xpath.find(result, "//latitude");
        console.log(dddd);
        console.log(sss);
        console.log(timeStamp());
    })

 
}



function processNotFound(result, element) {


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