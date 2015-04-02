var _ = require('underscore')
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


function getHeadCountId(head_count_identifier){
	return knex.select('id').from('head_count').where({identifier:head_count_identifier})
	.then(function(id_data){
		return id_data;
	});
}
function getAnimalId(animal_identifier){
	return knex.select('id').from('animal').where({identifier:animal_identifier});
}
function getUserId(username){
	return knex.select('id').from('user').where({username:username});
}

function getAnimalListId(animal_list_identifier){
	return knex.select('id').from('animal_list').where({identifier:animal_list_identifier});
}

//Returns all 
function getUsers(){
	return knex.select('username').from('user')
	.then(function(rows){
		console.log(rows);
		var jsonString = JSON.stringify(rows);
		return JSON.parse(jsonString);
	});
}


function isHeadCountInProgress(head_count_identifier){
	return knex.select('*')
			.from('head_count')
			.whereNull('stop_time')
			.where({identifier:head_count_identifier})
	.then(function(res){
		if(res.length===0){
			return 0;
		}else{
			return 1;
		}
	});
}

function addNewHeadCount(username,animal_list_identifier,head_count_identifier){
	var animal_list_id;
	var user_id;
	return getAnimalListId(animal_list_identifier)
	.then(function(animal_list_id){
		if(animal_list_id.length>0){
			this.animal_list_id = animal_list_id[0]['id'];
		}
		return getUserId(username)
	})
	.then(function(user_id){
		if(user_id.length>0)
			this.user_id = user_id[0]['id'];
		if(this.animal_list_id && this.user_id){
			return knex('head_count').insert({identifier: head_count_identifier,animal_list_id:this.animal_list_id,created_by:this.user_id},'id');
		}else{
			throw "ivalid animalLisId och username"
		}

	});
}

function setStopTimeOnHeadCount(head_count_identifier){
	var now = knex.raw('now()')
	var head_count_id;
	return getHeadCountId(head_count_identifier)
	.then(function(head_count_id){
		if(head_count_id.length>0){
			this.head_count_id = head_count_id[0]['id'];
			return knex('head_count')
				.where({id:this.head_count_id})
				.update({
					stop_time: now
				})
		}
	})
}


//Returns an object representing the latest not finished headcount for this list or an empty object if there is none present.
function getLatestHeadCount(animal_list_identifier){
	var subquery = knex.max('start_time')
					.from('head_count')
					.whereNull('stop_time')
					.join('animal_list','animal_list.id','=','head_count.animal_list_id')
					.where({
						'animal_list.identifier':animal_list_identifier
					});
	return knex.select('head_count.identifier AS head_count_identifier','start_time','creator.username AS created_by')
		.from('head_count')
		.join('animal_list','animal_list.id','=','head_count.animal_list_id')
		.join('user AS creator','creator.id','=','head_count.created_by')
		.where({
			'animal_list.identifier':animal_list_identifier
		})
		.whereIn('head_count.start_time',subquery)
		.then(function(rows){
		var jsonString = JSON.stringify(rows);
		return JSON.parse(jsonString);
		});
}

function updateHeadCount(head_count_identifier,animal_identifier,username,counted){
	var head_count_id;
	var animal_id;
	var user_id;
	if(!counted){
		return deleteHeadCountRecord(head_count_identifier,animal_identifier,username);
	}
	else{
		deleteHeadCountRecord(head_count_identifier,animal_identifier,username)
		.then(function(){
			return getHeadCountId(head_count_identifier);
		})
		.then(function(head_count_id){
			if(head_count_id.length>0)
				this.head_count_id = head_count_id[0]['id'];
			return getAnimalId(animal_identifier);
		})
		.then(function(animal_id){
			if(animal_id.length>0)
				this.animal_id = animal_id[0]['id'];
			return getUserId(username);
		})
		.then(function(user_id){
			if(user_id.length>0)
			this.user_id = user_id[0]['id'];
			if(this.head_count_id && this.animal_id && this.user_id){
				return knex('head_count_in_progress').returning('head_count_id').insert({head_count_id: this.head_count_id, animal_id:this.animal_id, counted_by:this.user_id});
			}
		}).then(function(res){
			return res;
		})
		.catch(function(error) {
    		console.error(error)
  		});
	}
}

function deleteHeadCountRecord(head_count_identifier,animal_identifier,username){
	var head_count_id = knex.select('id').from('head_count').where({identifier:head_count_identifier});
	var animal_id = knex.select('id').from('animal').where({identifier:animal_identifier});
	var user_id = knex.select('id').from('user').where({username:username});
		//remove tuple from head count in progress if such exist
		return knex.del('head_count_in_progress')
		.from('head_count_in_progress')
		.whereIn('head_count_in_progress.head_count_id', head_count_id)
		.whereIn('head_count_in_progress.animal_id', animal_id)
		.whereIn('head_count_in_progress.counted_by', user_id)
		.then(function(res){
			return res;
		})
		.catch(function(error) {
    		console.error(error)
  		});	
}

function getHeadCount(head_count_identifier){
	var animals;
	return knex.select('animal.identifier AS animal_id','animal.ear_number','animal.gender','animal.adult')
				.from('head_count')
				.where(
					{'head_count.identifier': head_count_identifier}
				)
				.join('animal_list_animals','animal_list_animals.animal_list_id','=','head_count.animal_list_id')
				.join('animal','animal.id','=','animal_list_animals.animal_id')
			.then(function(animals){
				this.animals = animals;
				
				//retrive counting status
				return knex.select('animal.identifier AS animal_id','counter.username AS counted_by')
					.from('head_count')
					.where({'head_count.identifier': head_count_identifier})
					.join('head_count_in_progress','head_count.id','=','head_count_in_progress.head_count_id')
					.join('user AS counter','counter.id','=','head_count_in_progress.counted_by')
					.join('animal','animal.id','=','head_count_in_progress.animal_id')
			})
			.then(function(head_count_raw){
				//populate counted_by list for each animal
				var counted_by_lists={}
				_.each(this.animals,function(val){
						val.counted_by=[];
				});
				var head_count_raw_sorted = _.sortBy(head_count_raw,'animal_id');
				this.animals =_.sortBy(this.animals,'animal_id');
				var head_count_index=0;
				var animal_index =0;
				while(head_count_index<head_count_raw_sorted.length){
					if(head_count_raw_sorted[head_count_index]['animal_id']===this.animals[animal_index]['animal_id']){
						this.animals[animal_index]['counted_by'].push(head_count_raw_sorted[head_count_index]['counted_by'])
						head_count_index++;
					}
					else{
						animal_index++
					}
				}
				var jsonString = JSON.stringify(this.animals);
				return JSON.parse(jsonString);
				return this.animals;
			})
			.catch(function(error) {
    				console.error(error)
  			});
}

function getListMetaData(username){
	var metadata;
	var list_identifiers;
	return knex.select('animal_list.identifier AS list_identifier','farm.name AS farm_name','animal_list.name AS list_name','creator.username AS created_by')
				.from('user')
				.where(
					{'user.username': username}
				)
				.join('animal_list_access','animal_list_access.user_id','=','user.id') 
				.join('animal_list','animal_list.id','=','animal_list_access.animal_list_id')
				.join('farm','animal_list.farm_id','=','farm.id')
				.join('user AS creator','creator.id','=','animal_list.created_by')
				.then(function(rows){
					metadata = rows;
					return _.pluck(rows,'list_identifier')
				})
				.then(function(list_identifiers){
					//retrive user acess data for the lists
					this.list_identifiers=list_identifiers;
					return knex.select('username','animal_list.identifier')
								.from('animal_list')
								.whereIn('identifier',list_identifiers)
								.join('animal_list_access', 'animal_list.id','=','animal_list_access.animal_list_id')
								.join('user','user.id','=','animal_list_access.user_id')
				})
				.then(function(user_access_objects){
					//fill in user acees
					_.each(metadata, function(val){
						val.users=[];
					});
					_.each(metadata,function(metadata_object){
						_.each(user_access_objects,function(user_access_object){
							if(metadata_object['list_identifier']===user_access_object['identifier'])
								metadata_object['users'].push(user_access_object['username']);
						})
					})
					var jsonString = JSON.stringify(metadata);
					return JSON.parse(jsonString);
					
				})
				.catch(function(error) {
    				console.error(error)
  				});
}
exports.setStopTimeOnHeadCount = setStopTimeOnHeadCount;
exports.addNewHeadCount = addNewHeadCount;
exports.isHeadCountInProgress = isHeadCountInProgress;
exports.updateHeadCount = updateHeadCount;
exports.getHeadCount = getHeadCount;
exports.getUsers=getUsers;
exports.getListMetaData=getListMetaData;
exports.getLatestHeadCount = getLatestHeadCount;


//updateHeadCount('test_head_count_3','test_sheep_1','test_user_1',false);

 // updateHeadCount('test_head_count_3','test_sheep_1','test_user_1',true).then(function(res){
	// console.log(res);
	// },function(err){
	// 	console.log("an error accured in the database");
	// });



// getHeadCount('test_head_count_3').then(function(headCount){
// 		console.log(headCount);
//  	},function(err){
//  		console.log("an error accured in the database");
// });

// getLatestHeadCount('#test_animal_list_2').then(function(latestHeadCount){
// 		console.log(latestHeadCount);
//  	},function(err){
//  		console.log("an error accured in the database");
// });

// getListMetaData('test_user_1').then(function(metadata){
// 		console.log(metadata);
// 	},function(err){
// 		console.log("an error accured in the database");
// });
