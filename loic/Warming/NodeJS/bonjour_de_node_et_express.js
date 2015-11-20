var express = require('express');
var app = express();

app.get('/', function(req,res) {
	res.setHeader('Content-Type','text/plain');
	res.end('Yaw Yaw Lowx ouW Wasav');
});
	
app.listen(8889);
