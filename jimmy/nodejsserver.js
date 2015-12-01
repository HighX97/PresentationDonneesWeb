/*
cd /Applications/XAMPP/xamppfiles/htdocs/projectpdw/jimmy/


sudo npm install -g express
export NODE_PATH=/usr/local/lib/node_modules


// /usr/local/lib/node_modules/express
*/
// node /Applications/XAMPP/xamppfiles/htdocs/projectpdw/jimmy/nodejsserver.js 
// Angular debug: https://addons.mozilla.org/en-US/firefox/addon/angscope-simple-angularjs-s/
var jsonPath = "json/";
var express = require('express');
var fs = require('fs');
var app = express();

app.get('/getJsonData', function(req, res){
	console.log("serveur Node : /getJsonData");
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'application/json');
	var redable = fs.createReadStream(jsonPath + 'sportData2.json');
	redable.on('open', function(){
		//console.log("open : /getJsonData");
		redable.pipe(res);
	});
	redable.on('error', function(error){
		//console.log("error : /getJsonData");
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