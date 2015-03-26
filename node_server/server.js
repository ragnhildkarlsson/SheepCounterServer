var http = require("http");
var url = require("url");

function start(route, handle){
  function onRequest(request, response){
  	console.log("A request was made");
  	var pathname = url.parse(request.url).pathname;
	console.log("About to route a request for "+ pathname);
	route(handle,request,response);
	}

	http.createServer(onRequest).listen(8888, "0.0.0.0");;
	console.log("Server has started");
}

exports.start = start;
