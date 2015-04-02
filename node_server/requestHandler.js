var database = require("./database");
var util = require("./util");
var url = require("url");


function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


function startNewHeadCount(request,response){
	var searchParams = url.parse(request.url,true).query;
	var userName= searchParams.username;
	var animalListId = searchParams.animal_list_id;
	var headCountId = generateUUID();
	database.addNewHeadCount(userName, animalListId, headCountId)
	.then(function(res){
		response.writeHead(200, {"Content-Type":"text/plain"});
		response.write("{result:{head_count_id:"+headCountId+"}}");
		response.end();
	},function(err){
		console.log("an error accured in the database");
		sendError(500,"500 Internal Server Error",response);
	});
}


function closeHeadCount(request,response){
	var searchParams = url.parse(request.url,true).query;
	var headCountId = searchParams.head_count_id;
	database.isHeadCountInProgress(headCountId).then(function(res){
		var res = parseInt(res);
		return res;
	},function(err){
		console.log("an error accured in the database");
		sendError(500,"500 Internal Server Error",response);
	})
	.then(function(isInProgress){
	if(!isInProgress){
		response.writeHead(200, {"Content-Type":"text/plain"});
		response.write("{result:0}");
		response.end();
	}
	else{
	database.setStopTimeOnHeadCount(headCountId)
		response.writeHead(200, {"Content-Type":"text/plain"});
		response.write("{result:1}");
		response.end();
	}
	});
}


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

}

function getListMetaData(request, response){
	var searchParams = url.parse(request.url,true).query;
	var requestedUserName= searchParams.username;
	console.log("requested user name: "+ requestedUserName);
	database.getListMetaData(requestedUserName).then(function(listMetadata){
		response.writeHead(200, {"Content-Type":"text/plain"});
		var jsonString = JSON.stringify(listMetadata);
		response.write("{result:"+jsonString+"}");
		response.end();
	},function(err){
		console.log("an error accured in the connection with the database");
		sendError(500,"500 Internal Server Error",response)
	});

}

function getLatestHeadCount(request,response){
	var searchParams = url.parse(request.url,true).query;
	var animalListId = searchParams.animal_list_id;
	database.getLatestHeadCount(animalListId).then(function(latestHeadCount){
		response.writeHead(200, {"Content-Type":"text/plain"});
		var jsonString = JSON.stringify(latestHeadCount);
		response.write("{result:"+jsonString+"}");
		response.end();
	},function(err){
		console.log("an error accured in the connection with the database");
		sendError(500,"500 Internal Server Error",response)
	});
}

function getHeadCount(request,response){
	var searchParams = url.parse(request.url,true).query;
	var headCountId = searchParams.head_count_id;
	database.getHeadCount(headCountId).then(function(headCount){
		response.writeHead(200, {"Content-Type":"text/plain"});
		var jsonString = JSON.stringify(headCount);
		response.write("{result:"+jsonString+"}");
		response.end();

	},function(err){
		console.log("an error accured in the connection with the database");
		sendError(500,"500 Internal Server Error",response)
	});
}

function isHeadCountOpen(request,response){
	var searchParams = url.parse(request.url,true).query;
	var headCountId = searchParams.head_count_id;
	database.isHeadCountInProgress(headCountId).then(function(res){
		var res = parseInt(res);
		return res;
	},function(err){
		console.log("an error accured in the connection with the database");
		sendError(500,"500 Internal Server Error",response)
	})
	.then(function(isInProgress){
	if(!isInProgress){
		response.writeHead(200, {"Content-Type":"text/plain"});
		response.write("{result:0}");
		response.end();
	}else{
		response.writeHead(200, {"Content-Type":"text/plain"});
		response.write("{result:1}");
		response.end();
	}
	});
}

//updateHeadCount('test_head_count_3','test_lamb_3','test_user_1',false);

function updateHeadCountRecord(request,response){
	var searchParams = url.parse(request.url,true).query;
	var headCountId = searchParams.head_count_id;
	var animalId = searchParams.animal_id;
	var username = searchParams.username;
	var counted = parseInt(searchParams.counted);
	database.isHeadCountInProgress(headCountId).then(function(res){
		var res = parseInt(res);
		return res;
	})
	.then(function(isInProgress){
	if(!isInProgress){
		response.writeHead(200, {"Content-Type":"text/plain"});
		response.write("{result:0}");
		response.end();
	}
	else{
	database.updateHeadCount(headCountId,animalId,username,counted)
		response.writeHead(200, {"Content-Type":"text/plain"});
		response.write("{result:1}");
		response.end();
	}
	});
}

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

exports.closeHeadCount = closeHeadCount;
exports.startNewHeadCount = startNewHeadCount;
exports.isHeadCountOpen = isHeadCountOpen;
exports.updateHeadCountRecord = updateHeadCountRecord;
exports.getHeadCount = getHeadCount;
exports.getLatestHeadCount = getLatestHeadCount;
exports.getListMetaData=getListMetaData;
exports.doesUserExist = doesUserExist;
exports.testHandler = testHandler;