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
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

function testConnectionMongo()
{
	//Connect using the MongoClient to a running mongod instance by specifying the MongoDB uri. For example, the following code connects to a MongoDB instance that runs on the localhost interface on port 27017 and switch to the test database.
	var url = 'mongodb://localhost:27017/' + dbName;
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected correctly to server.");
	  db.close();
	});	
}

function getDataMongo()
{
	//var 
}


app.get('/getDataMongoDb', function(req, res){
	console.log("serveur Node : /getDataMongoDb");
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	//https://docs.mongodb.org/getting-started/node/query/
	var url = 'mongodb://localhost:27017/' + dbName;
	var JsonData = [];
	
	var findSportsData = function(db, callback) {
		//var cursor = db.collection('sportsdata').find( );//Collection -> sportsdata
		/*
		var cursor = db.collection('sportsdata').find( ).toArray();//Collection -> sportsdata
   		console.log(cursor);
   		var tmpJsonData = [];
   		cursor.each( function(err, doc) {
		    assert.equal(err, null);
		    if (doc != null) {
		        console.dir(doc);
		        //console.dir(doc);
		        //tmpJsonData.pop(doc);
		    } 
		    else {
		    	callback();
		    }
		});
		*/
		var allDataArray = db.collection('sportsdata').find( ).toArray();
		//https://docs.mongodb.org/manual/reference/method/cursor.toArray/
		var json = JSON.stringify(allDataArray);
		console.log(json);
		console.log(allDataArray);
		res.end(json);
   		//JsonData = tmpJsonData;
   	};
	MongoClient.connect(url, function(err, db) {
	  	assert.equal(null, err);
	  	findSportsData(db, function() {
	    	db.close();
	  	});	
	});
	//var json = JSON.stringify(JsonData);
	//res.end(json);
	
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
		res.end("[]");
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
		res.end("[]");
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
	res.end(json);
});

app.listen(8888);