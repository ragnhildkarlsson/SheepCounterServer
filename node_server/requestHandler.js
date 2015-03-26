var database = require("./database");
var util = require("./util");
var url = require("url");

function doesUserExist(request,response){
	var searchParams = url.parse(request.url,true).query;
	var requestedUserName= searchParams.username;
	console.log("requested user name: "+ requestedUserName);
	database.getUsers().then(function(users){
		var userExist = util.existsInJson(users,'username',requestedUserName)
		response.writeHead(200, {"Content-Type":"text/plain"});
		response.write("{result:"+ userExist +"}");
		response.end();
	},function(err){
		console.log("an error accured in the connection with the database");
		sendError(500,"500 Internal Server Error",response)
	});

};

function testHandler(request,response){
	response.writeHead(200, {"Content-Type":"text/plain"});
	response.write("This is sheep-app 2.0");
	response.end();
}

function sendError(errcode,err,response){
		response.writeHead(errcode, {"Content-Type":"text/plain"});
		response.write(err);
		response.end();
}


exports.doesUserExist = doesUserExist;
exports.testHandler = testHandler;