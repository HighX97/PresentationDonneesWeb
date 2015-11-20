var express = require('express');
var fs = require("fs");
var app = express();

/* Méthodes pouvant être utilisées pour accéder à des données:
	res.sendFile(path.join(__dirnmame+'...')) 	: renvoi directement un fichier
	fs.readFileSync('...')				: lit un fichier
	fs.createReadStream('...')			: met en place un stream */

app.get('/', function(req,res) {
	res.setHeader('Content-Type','text/plain');
	res.end('Yaw Yaw Lowx ouW Wasav');
});
app.get('/listeMembres', function(req,res) {
	console.log("serveur Node : /listeMembres");
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Content-Type','application/json');
	var readable = fs.createReadStream('listeMembres.json');
	readable.on('open', function() { readable.pipe(res); });
	readable.on('error', function() { res.end("[]"); });
});
app.get('/listeMembres/:nom', function(req,res) {
	console.log("serveur Node : /listeMembres/:nom");
	var nomACherche = req.params.nom;
	var chaineListeMembres = fs.readFileSync("listeMembres.json","UTF-8");
	var listeMembres = JSON.parse(chaineListeMembres);
	var listePersonnes = [];
	for (var i=0; i< listeMembres.length; i++) {
		console.log(listeMembres[i]);
		var nom = listeMembres[i].nom;
		var prenom = listeMembres[i].prenom;
		if (listeMembres[i].nom == nomACherche) {
			listePersonnes.push({"nom":nom,"prenom":prenom});}
		}
	res.setHeader('Access-Control-Allow-Origin','*');
	res.setHeader('Content-Type','application/json');
	var json = JSON.stringify(listePersonnes);
	console.log(" -> json : "+json);
	res.end(json);
});

app.listen(8891);
