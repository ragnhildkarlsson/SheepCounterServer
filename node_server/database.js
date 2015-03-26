var knex =  require('knex')({
	client: 'mysql',
	connection: {
		host	: 'localhost',
		user     : 'sheep_project',
		password : 'test',
		database : 'sheeptest'
},
	pool:{
		min: 0,
		max: 7
	}

});

//Returns all 
function getUsers(){
	return knex.select('username').from('user')
	.then(function(rows){
		console.log(rows);
		var jsonString = JSON.stringify(rows);
		return JSON.parse(jsonString);
	});
}


exports.getUsers=getUsers;