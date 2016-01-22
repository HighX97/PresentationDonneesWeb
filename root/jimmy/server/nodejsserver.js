/*
cd /Applications/XAMPP/xamppfiles/htdocs/projectpdw/jimmy/

sudo npm install nodejs npm

sudo npm install -g express
npm install --save kerberos mongodb
sudo npm install -g mongodb


//https://docs.mongodb.org/getting-started/node/client/

export NODE_PATH=/usr/local/lib/node_modules

cd /usr/local/lib/node_modules
node /Applications/XAMPP/xamppfiles/htdocs/projectpdw/root/jimmy/server/nodejsserver.js

//node server/nodejsserver.js


// /usr/local/lib/node_modules/express
*/
// node /Applications/XAMPP/xamppfiles/htdocs/projectpdw/root/jimmy/server/nodejsserver.js 
// Angular debug: https://addons.mozilla.org/en-US/firefox/addon/angscope-simple-angularjs-s/
var http = require('http');//http://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
var path = require('path');
var express = require('express');
var fs = require('fs');
var ext = /[\w\d_-]+\.[\w\d]+$/;
var jsonPath = "json/";
var app = express();

var dbNameSportStatistics = "pdwsports";
var dbNameSportSites = "dbSportSite";

var MongoClient = require('mongodb').MongoClient;
var urlDbSportStatistics = 'mongodb://localhost:27017/' + dbNameSportStatistics;
var urlDbSportSites = 'mongodb://localhost:27017/' + dbNameSportSites;

var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var httpPath = "";

/*
Method to test the connection width MongoDb
 */
/**
 * [testConnectionMongo description]
 * @param  {[type]} urlDb [description]
 * @return {[type]}       [description]
 * @author Jimmy
 */
function testConnectionMongo(urlDb)
{
	//Connect using the MongoClient to a running mongod instance by specifying the MongoDB uri. For example, the following code connects to a MongoDB instance that runs on the localhost interface on port 27017 and switch to the test database.
	MongoClient.connect(urlDb, function(err, db) {
	  assert.equal(null, err);
	  if (err) {
	    console.log('Unable to connect to the mongoDB server. Error:', err);
	  }
	  else {
	  	console.log("Connected correctly to server.");
	  }
	  db.close();
	});	
}

/**
 * [getDataFromMongo Method to obtain information from a collection]
 * @return {[array]} [JsonData]
 * @author Jimmy
 */
function getDataFromMongo(urlDb, collection)
{
	var JsonData = [];
	
	MongoClient.connect(urlDb, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			//console.log(db);
			console.log('Connection established to', urlDb);
			// Get the documents collection
			var collection = db.collection(collection);
			collection.find().toArray(function (err, result) {
		      if (err) {
		        console.log(err);
		      } else if (result.length) {
		        //console.log('Found:', result);
		        JsonData.push(result);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found with defined "find" criteria!');
		      }
		      //Close connection
		      db.close();
		    });
			return JsonData;
		}
	});
	return JsonData;
}



/**
 * [createQuerySportStatistiques description]
 * @param  {[type]} request_params [description]
 * @return {[type]}                [description]
 * @author Jimmy
 */
function createQuerySportStatistiques(request_params)
{
	var objectQuery = {};
	
	for ( key in request_params ){
		//Jimmy: Multiple values
		if( Array.isArray(request_params[key]) ){
			objectQuery[key] = {$in : request_params[key]} // {"activity":{"$in":["soccer","taekwondo"]}}
		}
		else{ //one value
			objectQuery[key] = request_params[key]; // { activity: [ 'soccer', 'taekwondo' ] }
		}
	}	
	return objectQuery;
}

/**
 * [addPercentages description]
 * @param {[type]} resultSporData [description]
 */
function addPercentages(resultSporData)
{
    columToDisplay = 'nameQuarter';
    if( resultSporData[0] != undefined ){
	    if( resultSporData[0]['nbHour'] != undefined ){

		    //Group By SubQuarter
   			var sum = 0;
	    	for (var i in resultSporData) {
		        sum += resultSporData[i]['nbHour'];
		    };
		    for (var i in resultSporData) {
		    	if( sum > 0 ){
		    		resultSporData[i]['percentage'] = (resultSporData[i]['nbHour'] / sum) * 100;
		    		resultSporData[i]['percentage'] = Number((resultSporData[i]['percentage']).toFixed(2)); //ROUND
		    	}
		    	else{
		    		resultSporData[i]['percentage'] = 0;
		    	}
		    }
		    
		    //Groun By Quarter
		    var totalsQ = {};
		    for (i in resultSporData){
		        if( totalsQ[resultSporData[i][columToDisplay]] == undefined ){
		            totalsQ[resultSporData[i][columToDisplay]] = 0;
		        }
		        totalsQ[resultSporData[i][columToDisplay]] += resultSporData[i]['nbHour'];
		    }
		    for (var i in resultSporData) {
		    	if( sum > 0 ){
		    		resultSporData[i]['nbHoursQ'] = totalsQ[resultSporData[i][columToDisplay]];
		    		resultSporData[i]['percentageQ'] = (totalsQ[resultSporData[i][columToDisplay]] / sum) * 100;
		    		resultSporData[i]['percentageQ'] = Number((resultSporData[i]['percentageQ']).toFixed(2)); //ROUND
		    	}
		    	else{
		    		resultSporData[i]['percentageQ'] = 0;
		    	}
		    }

	    }

    }
    return resultSporData;
}

//localhost:8888/

//Aplication Server Node.
/**
 * [description]
 * @param  {[type]} req                        [description]
 * @param  {[type]} res){		res.writeHead(200, {'Content-Type': 'text/html'});	fs.createReadStream(httpPath + 	'index.html').pipe(res);	} [description]
 * @return {[type]}                            [description]
 * @author Jimmy
 */
app.get('/', function(req, res){
	//var html = fs.createReadStream('index.html');
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.createReadStream(httpPath + 	'index.html').pipe(res);
	
});

/*
http.createServer(function(req, res){
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.createReadStream(httpPath +'index.html').pipe(res);
    } else if (ext.test(req.url)) {
        fs.exists(path.join(__dirname, req.url), function (exists) {
            if (exists) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                fs.createReadStream(httpPath +'index.html').pipe(res);
            } else {
                res.writeHead(404, {'Content-Type': 'text/html'});
                fs.createReadStream(httpPath +'404.html').pipe(res);
        });
    } else {
        //  add a RESTful service
    }
}).listen(8000);
*/

/**
 * [description]
 * @param  {[type]} req                         [description]
 * @param  {[type]} res){	console.log("serveur Node          :     /getSportStatisticsData1D");	console.log("query");	console.log(req.query);	/*	db.sportsdata.group({	    "key": {	                                                                   "nameSubQuarter": true	    } [description]
 * @param  {[type]} "initial":                  {	                                                                                                                                     "nbHour":   0	                                }    [description]
 * @param  {[type]} "reduce":                   function(obj, prev) {	                                                                                                                                    prev.nbHour [description]
 * @param  {[type]} "cond":                     {	                                                                                                                                     "activity": "run"	                            }	} [description]
 * @return {[type]}                             [description]
 * @author Jimmy - Redoine
 */
app.get('/getSportStatisticsData1D', function(req, res){
	console.log("serveur Node : /getSportStatisticsData1D");
	console.log("query");
	console.log(req.query);
	/*
	db.sportsdata.group({
	    "key": {
	        "nameSubQuarter": true
	    },
	    "initial": {
	        "nbHour": 0
	    },
	    "reduce": function(obj, prev) {
	        prev.nbHour = prev.nbHour + obj.nbHour - 0;
	    },
	    "cond": {
	        "activity": "run"
	    }
	});
	 */
	var groupParams = { 
		'keys': {
			'nameQuarter': 0,
			'nameSubQuarter': 1,
			'nameCity': 0,
			'activity': 0,
			'genre': 0,
			'xAxis': 0,
			'yAxis': 0,
			'color': 0
		},
		'column': 'nbHour'
	};

	var objectQuery = createQuerySportStatistiques(req.query);

	//var objectQuery = request_params;
	var groupObject = {};
	groupObject["keys"] = groupParams["keys"];
	groupObject["initial"] = {};
	groupObject["initial"][groupParams["column"]] = 0;
	groupObject["reduce"] = function(obj, prev) {
        prev.groupParams["column"] = prev.groupParams["column"] + obj.groupParams["column"] - 0;
    };
    groupObject["function"] = "function(obj, prev) { prev." + groupParams["column"] + " = prev." + groupParams["column"] + " + obj." + groupParams["column"] + "- 0;}"
    
	groupObject["cond"] = objectQuery;
	//console.log("groupObject: ");
	//console.log(groupObject);
	
	var collectionName = 'sportsdata';
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	MongoClient.connect(urlDbSportStatistics, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection(collectionName)
			console.log('Connection established to', urlDbSportStatistics);
			collection.group( groupObject["keys"], groupObject["cond"], groupObject["initial"], groupObject["function"], function (err, result) {
		      if (err) {
		        console.log(err);
		        res.send([]);
		      } else if (result.length) {
		        console.log('Found query :');
		        console.log('db.' + collectionName + '.group( ' + JSON.stringify(objectQuery) + ' )');
		        //Jimmy: Add Percentages
		        resultSporData = addPercentages(result);
		        res.send(resultSporData);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found query: ' + JSON.stringify(objectQuery) );
		        console.log('db.' + collectionName + '.group( ' + JSON.stringify(objectQuery) + ' )');
		        //db.sportsdata.find( {"practice.practice_sportsmans.sportman_genre":"female"} )
		        res.send([]);
		      }
		      //Close connection
		      db.close();
		    });
		}
	});
});

/**
 * [description]
 * @param  {[type]} req                         [description]
 * @param  {[type]} res){	console.log("serveur Node          :     /getSportStatisticsData2D");	console.log("query");	console.log(req.query);	/*	db.sportsdata.group({	    "key": {	                                                                                                                                                                                                                       "nameSubQuarter": true	                            } [description]
 * @param  {[type]} "initial":                  {	                                                                                                                                     "nbHour":   0	                                }                           [description]
 * @param  {[type]} "reduce":                   function(obj, prev) {	                                                                                                                                    prev.nbHour [description]
 * @param  {[type]} "cond":                     {	                                                                                                                                     "activity": "run"	                            }	});	db.sportsdata.group( {"key":{"nameQuarter":0,"nameSubQuarter":1,"nameCity":0,"xAxis":0,"yAxis":0,"color":0},"initial":{"nbHour":0},"reduce":"function(obj, prev)             {    prev.nbHour [description]
 * @return {[type]}                             [description]
 * @author Jimmy - Redoine
 */
app.get('/getSportStatisticsData2D', function(req, res){
	console.log("serveur Node : /getSportStatisticsData2D");
	console.log("query");
	console.log(req.query);
	/*
	db.sportsdata.group({
	    "key": {
	        "nameSubQuarter": true
	    },
	    "initial": {
	        "nbHour": 0
	    },
	    "reduce": function(obj, prev) {
	        prev.nbHour = prev.nbHour + obj.nbHour - 0;
	    },
	    "cond": {
	        "activity": "run"
	    }
	});

	db.sportsdata.group( {"key":{"nameQuarter":0,"nameSubQuarter":1,"nameCity":0,"xAxis":0,"yAxis":0,"color":0},"initial":{"nbHour":0},"reduce":"function(obj, prev) { prev.nbHour = prev.nbHour + obj.nbHour- 0;}","cond":{"activity":"taekwondo"}} )
	 */
	var groupParams = { 
		'key': {
			'nameQuarter': 0,
			'nameSubQuarter': 1,
			'nameCity': 0,
			'xAxis': 0,
			'yAxis': 0,
			'color': 0
		},
		'column': 'nbHour'
	};

	var objectQuery = createQuerySportStatistiques(req.query);

	var groupObject = {};
	groupObject["key"] = groupParams["key"];
	groupObject["initial"] = {};
	groupObject["initial"][groupParams["column"]] = 0;
	groupObject["reduce"] = "function(obj, prev) { prev." + groupParams["column"] + " = prev." + groupParams["column"] + " + obj." + groupParams["column"] + "- 0;}"
    groupObject["cond"] = objectQuery;
	console.log("groupObject: ");
	console.log(groupObject);
	
	var collectionName = 'sportsdata';
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	//var JsonData = getDataFromMongo(urlDbSportStatistics, 'sportsdata');
	MongoClient.connect(urlDbSportStatistics, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection(collectionName)
			console.log('Connection established to', urlDbSportStatistics);
			collection.group( groupObject["key"], groupObject["cond"], groupObject["initial"], groupObject["reduce"], function (err, result) {
		      if (err) {
		        console.log(err);
		        res.send([]);
		      } else if (result.length) {
		        console.log('Found query :');
		        console.log('db.' + collectionName + '.group( ' + JSON.stringify(groupObject) + ' )');
		        //Jimmy: Add Percentages
		        resultSporData = addPercentages(result);
		        res.send(resultSporData);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found query: ' + JSON.stringify(groupObject) );
		        console.log('db.' + collectionName + '.group( ' + JSON.stringify(groupObject) + ' )');
		        //db.sportsdata.find( {"practice.practice_sportsmans.sportman_genre":"female"} )
		        res.send([]);
		      }
		      //Close connection
		      db.close();
		    });
		}
	});
});

/**
 * [description]
 * @param  {[type]} req                         [description]
 * @param  {[type]} res){	console.log("serveur Node          : /getFiltersDataSportStatistics");	console.log("query");	console.log(req.query);	var objectQuery [description]
 * @return {[type]}                             [description]
 * @author Jimmy - Redoine
 */
app.get('/getFiltersDataSportStatistics', function(req, res){
	console.log("serveur Node : /getFiltersDataSportStatistics");
	console.log("query");
	console.log(req.query);

	var objectQuery = createQuerySportStatistiques(req.query);
	var collectionName = 'sportsdata';
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	//var JsonData = getDataFromMongo(urlDbSportStatistics, 'sportsdata');
	MongoClient.connect(urlDbSportStatistics, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection(collectionName)
			//console.log(db);
			console.log('Connection established to', urlDbSportStatistics);
			// Get the documents collection
			//.sort('activity');//Sort by
			collection.find( objectQuery ).toArray(function (err, result) {
		      if (err) {
		        console.log(err);
		        res.send([]);
		      } else if (result.length) {
		        console.log('Found query :');
		        console.log('db.' + collectionName + '.find( ' + JSON.stringify(objectQuery) + ' )');
		        //Jimmy: Add Percentages
		        resultSporData = addPercentages(result);
		        res.send(resultSporData);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found query: ' + JSON.stringify(objectQuery) );
		        console.log('db.' + collectionName + '.find( ' + JSON.stringify(objectQuery) + ' )');
		        //db.sportsdata.find( {"practice.practice_sportsmans.sportman_genre":"female"} )
		        res.send([]);
		      }
		      //Close connection
		      db.close();
		    });
		}
	});
});

// http://localhost:8888/getFiltersDataSportSites
/**
 * [description]
 * @param  {[type]} req                                                                                            [description]
 * @param  {String} res){	console.log("/getFiltersDataSportSites");		res.setHeader('Access-Control-Allow-Origin', '*');	res.setHeader('Content-type', 'application/json');	MongoClient.connect(urlDbSportSites, function (err, db) {		if (err) {			console.log('Unable to connect to the mongoDB server. Error:', err);		}		else 		{									var collectionName [description]
 * @return {[type]}                                                                                                [description]
 * @author Jimmy - Loïc
 */
app.get('/getFiltersDataSportSites', function(req, res){
	console.log("serveur Node : /getFiltersDataSportSites");
	console.log("query");
	console.log(req.query);

	var objectQuery = createQuerySportStatistiques(req.query);
	var collectionName = 'sportSiteData';
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	//var JsonData = getDataFromMongo(urlDbSportStatistics, 'sportsdata');
	MongoClient.connect(urlDbSportSites, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection(collectionName)
			console.log(db);
			console.log('Connection established to', urlDbSportSites);
			// Get the documents collection
			//.sort('activity');//Sort by
			collection.find( objectQuery ).toArray(function (err, result) {
		      if (err) {
		        console.log(err);
		        res.send([]);
		      } else if (result.length) {
		        console.log('Found query :');
		        console.log('db.' + collectionName + '.find( ' + JSON.stringify(objectQuery) + ' )');
		        //Jimmy: Add Percentages
		        resultSporData = addPercentages(result);
		        res.send(resultSporData);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found query: ' + JSON.stringify(objectQuery) );
		        console.log('db.' + collectionName + '.find( ' + JSON.stringify(objectQuery) + ' )');
		        //db.sportsdata.find( {"practice.practice_sportsmans.sportman_genre":"female"} )
		        res.send([]);
		      }
		      //Close connection
		      db.close();
		    });
		}
	});
});


///////////////////////////

app.get('/getSportSitesData1D', function(req, res){
	console.log("serveur Node : /getSportSitesData1D");
	console.log("query");
	console.log(req.query);

	var objectQuery = createQuerySportStatistiques(req.query);
	var collectionName = 'sportSiteData';
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	//var JsonData = getDataFromMongo(urlDbSportStatistics, 'sportsdata');
	MongoClient.connect(urlDbSportSites, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection(collectionName)
			//console.log(db);
			console.log('Connection established to', urlDbSportSites);
			// Get the documents collection
			//.sort('activity');//Sort by
			collection.find( objectQuery ).toArray(function (err, result) {
		      if (err) {
		        console.log(err);
		        res.send([]);
		      } else if (result.length) {
		        console.log('Found query :');
		        console.log('db.' + collectionName + '.find( ' + JSON.stringify(objectQuery) + ' )');
		        //Jimmy: Add Percentages
		        resultSporData = addPercentages(result);
		        res.send(resultSporData);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found query: ' + JSON.stringify(objectQuery) );
		        console.log('db.' + collectionName + '.find( ' + JSON.stringify(objectQuery) + ' )');
		        //db.sportsdata.find( {"practice.practice_sportsmans.sportman_genre":"female"} )
		        res.send([]);
		      }
		      //Close connection
		      db.close();
		    });
		}
	});
});

/**
 * [description]
 * @param  {[type]} req                         [description]
 * @param  {[type]} res){	console.log("serveur Node          :     /getSportSitesData2D");	console.log("query");	console.log(req.query);	/*	db.sportsdata.group({	    "key": {	                                                                                                                                                                                                                       "nameSubQuarter": true	                            } [description]
 * @param  {[type]} "initial":                  {	                                                                                                                                     "nbHour":   0	                                }                           [description]
 * @param  {[type]} "reduce":                   function(obj, prev) {	                                                                                                                                    prev.nbHour [description]
 * @param  {[type]} "cond":                     {	                                                                                                                                     "activity": "run"	                            }	});	db.sportsdata.group( {"key":{"nameQuarter":0,"nameSubQuarter":1,"nameCity":0,"xAxis":0,"yAxis":0,"color":0},"initial":{"nbHour":0},"reduce":"function(obj, prev)             {    prev.nbHour [description]
 * @return {[type]}                             [description]
 * @author Jimmy - Redoine
 */
app.get('/getSportSitesData2D', function(req, res){
	console.log("serveur Node : /getSportSitesData2D");
	console.log("query");
	console.log(req.query);
	/*
	db.sportsdata.group({
	    "key": {
	        "nameSubQuarter": true
	    },
	    "initial": {
	        "nbHour": 0
	    },
	    "reduce": function(obj, prev) {
	        prev.nbHour = prev.nbHour + obj.nbHour - 0;
	    },
	    "cond": {
	        "activity": "run"
	    }
	});

	db.sportsdata.group( {"key":{"nameQuarter":0,"nameSubQuarter":1,"nameCity":0,"xAxis":0,"yAxis":0,"color":0},"initial":{"nbHour":0},"reduce":"function(obj, prev) { prev.nbHour = prev.nbHour + obj.nbHour- 0;}","cond":{"activity":"taekwondo"}} )
	 */
	var groupParams = { 
		'key': {
			'nameQuarter': 0,
			'nameSubQuarter': 1,
			'nameCity': 0,
			'xAxis': 0,
			'yAxis': 0,
			'color': 0
		},
		'column': 'nbHour'
	};

	var objectQuery = createQuerySportStatistiques(req.query);

	var groupObject = {};
	groupObject["key"] = groupParams["key"];
	groupObject["initial"] = {};
	groupObject["initial"][groupParams["column"]] = 0;
	groupObject["reduce"] = "function(obj, prev) { prev." + groupParams["column"] + " = prev." + groupParams["column"] + " + obj." + groupParams["column"] + "- 0;}"
    groupObject["cond"] = objectQuery;
	console.log("groupObject: ");
	console.log(groupObject);
	
	var collectionName = 'sportsdata';
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	//var JsonData = getDataFromMongo(urlDbSportSites, 'sportsdata');
	MongoClient.connect(urlDbSportSites, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection(collectionName)
			console.log('Connection established to', urlDbSportSites);
			collection.group( groupObject["key"], groupObject["cond"], groupObject["initial"], groupObject["reduce"], function (err, result) {
		      if (err) {
		        console.log(err);
		        res.send([]);
		      } else if (result.length) {
		        console.log('Found query :');
		        console.log('db.' + collectionName + '.group( ' + JSON.stringify(groupObject) + ' )');
		        //Jimmy: Add Percentages
		        resultSporData = addPercentages(result);
		        res.send(resultSporData);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found query: ' + JSON.stringify(groupObject) );
		        console.log('db.' + collectionName + '.group( ' + JSON.stringify(groupObject) + ' )');
		        //db.sportsdata.find( {"practice.practice_sportsmans.sportman_genre":"female"} )
		        res.send([]);
		      }
		      //Close connection
		      db.close();
		    });
		}
	});
});

app.listen(8888);