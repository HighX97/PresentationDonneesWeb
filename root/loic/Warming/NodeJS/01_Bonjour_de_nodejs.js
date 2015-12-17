var express = require('express');
var fs = require("fs");
var app = express();

app.get('/', function(req,res) {
	res.setHeader('Content-Type','text/plain');
	res.end('Yaw Yaw Lowx ouW Wasav');
});

app.get('/listeMembres', function(req,res) {
	res.setHeader('Content-Type','applicatoin/json');
	var readable = fs.createReadStream("listeMembres.json");
	readable.on('open', function() {readable.pipe(res);
		console.log("Liste des membres renvoyé");});
	readable.on('error',function() {res.end("[]");});
});

app.get('/madinina', function(req,res) {
	res.setHeader('Content-Type','applicatoin/json');
	var readable = fs.createReadStream("MADININA.jpg");
	readable.on('open', function() {readable.pipe(res);
		console.log("Image madinina renvoyé");});
	readable.on('error',function() {res.end("[]");});
});
	
app.listen(8890);
