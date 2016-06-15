var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();
var path = require('path');

var publicDir = __dirname + '/public';

app.use(bodyParser());

app.use(express.static(publicDir));

app.get('/phoneNum', function (req,res,next) {

	try {
		request(req.query.url, function(error, response, body) {
			if(error) {
				console.log("Error: " + error);
			}
   
   if(response.statusCode === 200) {
     // Parse the document body
     var $ = cheerio.load(body);
   
     var results = collectInternalLinks($);

     console.log("results : "+JSON.stringify(results))
     res.send(JSON.stringify({ phoneNumbers: results}));
     
 }
});

	}catch(Ex) {
		console.error("error in get api :"+Ex);
	}

});

function collectInternalLinks($) {
	var allRelativeLinks = [];
	var allAbsoluteLinks = [];


	var str=$('body').text().replace('\s','\n'); 
	var patt1=/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gi;  //noticed the g.  g will enable match of all occurance, and without it it'll only match the first occurance
	
	var arr = str.match(patt1);

	return arr;

}

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 4004, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

