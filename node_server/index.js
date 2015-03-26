var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandler");

var handle = {};
handle["/"] = requestHandlers.testHandler;
handle["/test"] = requestHandlers.testHandler;
handle["/does_user_exist"] = requestHandlers.doesUserExist;

server.start(router.route, handle);

