/*
cd /Applications/XAMPP/xamppfiles/htdocs/projectpdw/jimmy/

sudo npm install nodejs npm

sudo npm install -g express
npm install --save kerberos mongodb
sudo npm install -g mongodb


//https://docs.mongodb.org/getting-started/node/client/

export NODE_PATH=/usr/local/lib/node_modules

cd /usr/local/lib/node_modules
node /Applications/XAMPP/xamppfiles/htdocs/projectpdw/root/jimmy/nodejsserver.js

//node nodejsserver.js


// /usr/local/lib/node_modules/express
*/
// node /Applications/XAMPP/xamppfiles/htdocs/projectpdw/root/jimmy/nodejsserver.js 
// Angular debug: https://addons.mozilla.org/en-US/firefox/addon/angscope-simple-angularjs-s/
var http = require('http');//http://stackoverflow.com/questions/4720343/loading-basic-html-in-node-js
var path = require('path');
var express = require('express');
var fs = require('fs');
var ext = /[\w\d_-]+\.[\w\d]+$/;
var jsonPath = "json/";
var app = express();

var dbName = "pdwsports";

var MongoClient = require('mongodb').MongoClient;
var urlDb = 'mongodb://localhost:27017/' + dbName;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var httpPath = "";

//localhost:8888/

//Aplication Server Node.
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

function testConnectionMongo()
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

function getDataFromMongo()
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
			var collection = db.collection('sportsdata');
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

app.get('/getGroupedData', function(req, res){
	console.log("serveur Node : /getGroupedData");
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
	console.log("groupObject: ");
	console.log(groupObject);
	
	

	var collectionName = 'sportsdata';
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	//var JsonData = getDataFromMongo();
	MongoClient.connect(urlDb, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection(collectionName)
			console.log('Connection established to', urlDb);
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

app.get('/getGroupedData2D', function(req, res){
	console.log("serveur Node : /getGroupedData2D");
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

	//var objectQuery = request_params;
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
	//var JsonData = getDataFromMongo();
	MongoClient.connect(urlDb, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection(collectionName)
			console.log('Connection established to', urlDb);
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

app.get('/getDataMongoDb', function(req, res){
	console.log("serveur Node : /getDataMongoDb");
	console.log("query");
	console.log(req.query);

	var objectQuery = createQuerySportStatistiques(req.query);
	var collectionName = 'sportsdata';
	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	//var JsonData = getDataFromMongo();
	MongoClient.connect(urlDb, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection(collectionName)
			//console.log(db);
			console.log('Connection established to', urlDb);
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

// http://localhost:8888/getDataFromMongoLoic
app.get('/getDataFromMongoLoic', function(req, res){
	console.log("/getDataFromMongoLoic");
	var dbNameLoic = "PresentationDW_Split";
	var urlDbLoic = 'mongodb://localhost:27017/' + dbNameLoic;
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-type', 'application/json');

	MongoClient.connect(urlDbLoic, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			//var collectionName = 'Departement';
			//var collectionName = 'City';
			var collectionName = 'SubQuarter';
			var collection = db.collection(collectionName);
			var objectQuery = { "nameRg":"Languedoc_Roussillon" };
			//var collection2 = db.collection('City');
			console.log('Connection established to', urlDb);

			collection.find( objectQuery ).toArray(function (err, result) {
		      if (err) {
		        console.log(err);
		        res.send([]);
		      } else if (result.length) {
		        console.log('Found query :');
		        console.log('db.' + collectionName + '.find( ' + JSON.stringify(objectQuery) + ' )');
		        res.send(result);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found query: ' + JSON.stringify(objectQuery) );
		        console.log('db.' + collectionName + '.find( ' + JSON.stringify(objectQuery) + ' )');
		        res.send([]);
		      }
		      //Close connection
		      db.close();
		    });
		}
	});
	//res.send({'test': ''});
});

app.listen(8888);
