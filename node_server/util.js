function existsInJson(jsonObject,key,value){
	console.log(jsonObject);
	var hasMatch =false;
	for (var index = 0; index < jsonObject.length; ++index) {
		var object = jsonObject[index];
		console.log(object);
		if(object[key] === value){
   			hasMatch = true;
   		break;
 		}
 	}
 	return hasMatch;
}

exports.existsInJson = existsInJson;

function testExistInJson1(){
	testdata = [{"name":"cat"}, {"name":"dog"}];
	console.log(existsInJson(testdata,'name','dog'));
}

