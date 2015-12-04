/*
cd /Applications/XAMPP/xamppfiles/htdocs/projectpdw/jimmy/


sudo npm install -g express
npm install --save kerberos mongodb
sudo npm install -g mongodb

//https://docs.mongodb.org/getting-started/node/client/

export NODE_PATH=/usr/local/lib/node_modules


// /usr/local/lib/node_modules/express
*/
// node /Applications/XAMPP/xamppfiles/htdocs/projectpdw/jimmy/nodejsserver.js 
// Angular debug: https://addons.mozilla.org/en-US/firefox/addon/angscope-simple-angularjs-s/
var jsonPath = "json/";
var express = require('express');
var fs = require('fs');
var app = express();

var dbName = "pdwsports";

var MongoClient = require('mongodb').MongoClient;
var urlDb = 'mongodb://localhost:27017/' + dbName;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

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


app.get('/getDataMongoDb', function(req, res){
	console.log("serveur Node : /getDataMongoDb");
	//console.log("params");
	//console.log(req.params);
	console.log("query");
	console.log(req.query);

	var objectQuery = req.query;
	objectQuery = mapParamsToMongoUrlPath(objectQuery);

	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	//https://docs.mongodb.org/getting-started/node/query/
	//var JsonData = getDataFromMongo();
	MongoClient.connect(urlDb, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection('sportsdata');
			//console.log(db);
			console.log('Connection established to', urlDb);
			// Get the documents collection
			collection.find( objectQuery ).toArray(function (err, result) {
		      if (err) {
		        console.log(err);
		        res.send([]);
		      } else if (result.length) {
		        console.log('Found query :');
		        console.log('db.sportsdata.find( ' + JSON.stringify(objectQuery) + ' )');
		        res.send(result);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found query: ' + JSON.stringify(objectQuery) );
		        console.log('db.sportsdata.find( ' + JSON.stringify(objectQuery) + ' )');
		        //db.sportsdata.find( {"practice.practice_sportsmans.sportman_genre":"female"} )
		        res.send([]);
		      }
		      //Close connection
		      db.close();
		    });
		}
	});
});

app.get('/getJsonData', function(req, res){
	console.log("serveur Node : /getJsonData");
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	var redable = fs.createReadStream(jsonPath + 'sportData2.json');
	redable.on('open', function(){
		console.log("open : /getJsonData");
		redable.pipe(res);
	});
	redable.on('error', function(error){
		console.log("error : /getJsonData");
		//console.log(error);
		res.send("[]");
	});
});

app.get('/listeMembres', function(req, res){
	console.log("serveur Node : /listeMembres");
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	var redable = fs.createReadStream(jsonPath + 'sportData.json');
	redable.on('open', function(){
		redable.pipe(res);
	});
	redable.on('error', function(){
		res.send("[]");
	});
});

app.get('/listeMembres/:nom', function(req, res){
	console.log("serveur Node : /listeMembres/:nom");
	var nomACherche = req.params.nom;
	var chaineListeMembres = fs.readFileSync(jsonPath + 'sportData2.json', "UTF-8");
	var listeMembres = JSON.parse(chaineListeMembres);
	var listePersonnes = [];
	for (var i = 0; i < listeMembres.length; i++){
		var nom = listeMembres[i].nom;
		var prenom = listeMembres[i].prenom;
		if( listeMembres[i].nom == nomACherche ){
			listePersonnes.push({"nom": nom, "prenom" : prenom});
		}
	}	
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-type', 'application/json');
	var json = JSON.stringify(listePersonnes);
	console.log(" -> json : " + json);
	res.send(json);
});

// http://localhost:8888/testLoic
app.get('/testLoic', function(req, res){
	console.log("/testLoic");
	var dbNameLoic = "PresentationDW_Split";
	var urlDbLoic = 'mongodb://localhost:27017/' + dbNameLoic;
	var objectQuery = { "nameRg":"Languedoc_Roussillon" };
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-type', 'application/json');

	MongoClient.connect(urlDbLoic, function (err, db) {
		if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		}
		else 
		{
			var collection = db.collection('Departement');
			console.log('Connection established to', urlDb);
			collection.find( objectQuery ).toArray(function (err, result) {
		      if (err) {
		        console.log(err);
		        res.send([]);
		      } else if (result.length) {
		        console.log('Found query :');
		        console.log('db.Departement.find( ' + JSON.stringify(objectQuery) + ' )');
		        res.send(result);
		        //console.log(JsonData);
		      } else {
		        console.log('No document(s) found query: ' + JSON.stringify(objectQuery) );
		        console.log('db.Departement.find( ' + JSON.stringify(objectQuery) + ' )');
		        res.send([]);
		      }
		      //Close connection
		      db.close();
		    });
		}
	});
	//res.send({'test': ''});
});

//Jimmy: try to map the request params into the json path
//If the <field> is in an embedded document or an array, use dot notation to access the field.
// https://docs.mongodb.org/manual/reference/method/db.collection.find/
function mapParamsToMongoUrlPath(objParams)
{
	var newObjectParams = {};
	var objSchema = {
		"city": "city",
		"practice": "practice",
		"sport-activity": "practice.sport-activity",
		"practice_date": "practice.practice_date",
		"practice_hour": "practice.practice_hour",
		"practice_location": "practice.practice_location",
		"x1": "practice.practice_location.x1",
		"y1": "practice.practice_location.y1",
		"practice_sportsmans": "practice.practice_sportsmans",
		"sportman_name": "practice.practice_sportsmans.sportman_name",
		"sportman_genre": "practice.practice_sportsmans.sportman_genre",
		"sportman_age": "practice.practice_sportsmans.sportman_age",
		"sportman_results": "practice.practice_sportsmans.sportman_results",
		"result_seconds": "practice.practice_sportsmans.sportman_results.result_seconds"
	};
	for( i in objParams){
		if( objSchema[i] != undefined ){
			newObjectParams[objSchema[i]] = objParams[i];
		}
		else{
			newObjectParams[i] = objParams[i];
		}
	}
	//console.log(objParams);
	//console.log(newObjectParams);
	return newObjectParams;
}






app.listen(8888);
