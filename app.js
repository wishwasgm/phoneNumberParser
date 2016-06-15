var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var bodyParser = require('body-parser');

var express = require('express');
var app = express();
var path = require('path');

var publicDir = __dirname + '/public';

var wait = 0;

// app.use(compress()); 
app.use(bodyParser());

app.use(express.static(publicDir));

app.get('/phoneNum', function (req,res,next) {

	try {
		
		var promise = getPhoneNumbersInPage(req.query.url);

		// promise.then(function(result){
		// 	console.log("Res : "+result);
		// 	res.send(JSON.stringify({ phoneNumbers: numbers}));
		// })

		request(req.query.url, function(error, response, body) {
			if(error) {
				console.log("Error: " + error);
			}
   // Check status code (200 is HTTP OK)
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200) {
     // Parse the document body
     var $ = cheerio.load(body);
     
     // console.log("parsed body : "+$('body').text());

     // console.log("Page title:  " + $('title').text());

     // console.log("Word search:  " + searchForWord($,"phone"));

     var results = collectInternalLinks($);

     console.log("results : "+JSON.stringify(results))
     res.send(JSON.stringify({ phoneNumbers: results}));
     
 }
});

		// setTimeout(function(){
		// numbers = getPhoneNumbersInPage(req.query.url);
		// },1000);
		
		
		// console.log("results 2 : "+JSON.stringify(numbers))
		// res.setHeader('Content-Type', 'application/json');
		// res.send(JSON.stringify({ phoneNumbers: numbers}));
		
		
	}catch(Ex) {
		console.error("error in get api :"+Ex);
	}

});


function getPhoneNumbersInPage(pageToVisit){
// var pageToVisit = "http://www.troo.ly";
console.log("Visiting page " + pageToVisit);
request(pageToVisit, function(error, response, body) {
	if(error) {
		console.log("Error: " + error);
	}
   // Check status code (200 is HTTP OK)
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200) {
     // Parse the document body
     var $ = cheerio.load(body);
     
     // console.log("parsed body : "+$('body').text());

     // console.log("Page title:  " + $('title').text());

     // console.log("Word search:  " + searchForWord($,"phone"));

     var results = collectInternalLinks($);

     console.log("results : "+JSON.stringify(results))
     wait=1;
     
     return results;
 }
});
}



function searchForWord($, word) {
	var bodyText = $('html > body').text();
	if(bodyText.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
		console.log(bodyText.toLowerCase().indexOf(word.toLowerCase())); 
		return true;
	}
	return false;
}

function collectInternalLinks($) {
	var allRelativeLinks = [];
	var allAbsoluteLinks = [];

	// var relativeLinks = $("a[href^='/']");
	// relativeLinks.each(function() {
	// 	console.log("relative link : "+$(this).attr('href'))
	// 	allRelativeLinks.push($(this).attr('href'));

	// });

	// var absoluteLinks = $("a[href^='http']");
	// absoluteLinks.each(function() {
	// 	console.log("absolute link : "+$(this).attr('href'))
	// 	allAbsoluteLinks.push($(this).attr('href'));
	// });

	var str=$('body').text().replace('\s','\n'); 
	// var str='444.444.4444  asd';
	var patt1=/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gi;  //noticed the g.  g will enable match of all occurance, and without it it'll only match the first occurance
	// var patt1=/(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/g;
	console.log(JSON.stringify(str.match(patt1)));

	var arr = str.match(patt1);

	arr.forEach(function(a) {
		console.log("found : "+a);
	});

	return arr;

  // var phoneNumbersRegEx = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/g;
  // var query = new RegExp("(\\b" + 'troo' + "\\b)", "gim");
  // ($('body').text().match(query)).each(function() {
  // 	console.log("Phone Number : "+$(this))
  //     allAbsoluteLinks.push($(this));
  // });

  // console.log("Found " + allRelativeLinks.length + " relative links");
  // console.log("Found " + allAbsoluteLinks.length + " absolute links");
}

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(8080);

