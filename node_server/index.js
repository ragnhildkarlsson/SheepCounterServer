var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandler");

var handle = {};
handle["/"] = requestHandlers.testHandler;
handle["/test"] = requestHandlers.testHandler;
handle["/does_user_exist"] = requestHandlers.doesUserExist;
handle["/get_list_meta_data"] = requestHandlers.getListMetaData;
handle["/get_latest_head_count"] = requestHandlers.getLatestHeadCount;
handle["/get_head_count"] = requestHandlers.getHeadCount;
handle["/is_head_count_open"] = requestHandlers.isHeadCountOpen;
handle["/update_head_count_record"] = requestHandlers.updateHeadCountRecord;
handle["/start_new_head_count"] = requestHandlers.startNewHeadCount;
handle["/close_head_count"] = requestHandlers.closeHeadCount;


server.start(router.route, handle);

