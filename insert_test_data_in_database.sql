insert into user (username) values ('test_user_1');
insert into user (username) values ('test_user_2');
insert into farm (name) values ('test_farm_1');
insert into farm (name) values ('test_farm_2');	
insert into animal_list (identifier, name, farm_id, created_by) values ('test_animal_list_1','test_animal_list_1',1,1);
insert into animal_list (identifier, name, farm_id, created_by) values ('test_animal_list_2','test_animal_list_2',2,2);
insert into animal_list (identifier, name, farm_id, created_by) values ('test_animal_list_3','test_animal_list_3',2,2);
insert into animal_list_access (user_id, animal_list_id) values (1,1);
insert into animal_list_access (user_id, animal_list_id) values (2,1);
insert into animal_list_access (user_id, animal_list_id) values (2,2);
insert into animal_list_access (user_id, animal_list_id) values (2,3);
insert into animal_list_access (user_id, animal_list_id) values (1,3);
insert into head_count(identifier,animal_list_id,created_by) values("test_head_count_1",1, 1);
insert into head_count(identifier,animal_list_id,created_by) values("test_head_count_2",1, 2);
insert into head_count(identifier,animal_list_id,created_by) values("test_head_count_3",3, 2);
insert into animal(identifier,ear_number,gender,adult,farm_id) values('test_sheep_1','100','F',1,2);
insert into animal(identifier,ear_number,gender,adult,farm_id) values('test_sheep_2','110','F',1,2);
insert into animal(identifier,ear_number,gender,adult,farm_id) values('test_sheep_3','120','F',1,2);
insert into animal(identifier,ear_number,gender,adult,farm_id) values('test_lamb_1','1100','F',0,2);
insert into animal(identifier,ear_number,gender,adult,farm_id) values('test_lamb_2','1001','F',0,2);
insert into animal(identifier,ear_number,gender,adult,farm_id) values('test_lamb_3','1121','M',0,2);
insert into animal_list_animals(animal_list_id,animal_id)values(3,1);
insert into animal_list_animals(animal_list_id,animal_id)values(3,2);
insert into animal_list_animals(animal_list_id,animal_id)values(3,3);
insert into animal_list_animals(animal_list_id,animal_id)values(3,4);
insert into animal_list_animals(animal_list_id,animal_id)values(3,5);
insert into animal_list_animals(animal_list_id,animal_id)values(3,6);
UPDATE head_count SET stop_time = NOW() WHERE identifier='test_head_count_1'; 
UPDATE head_count SET stop_time = NOW() WHERE identifier='test_head_count_2';
insert into head_count_in_progress(head_count_id,animal_id,counted_by) values(3,1,1);
insert into head_count_in_progress(head_count_id,animal_id,counted_by) values(3,4,1);
insert into head_count_in_progress(head_count_id,animal_id,counted_by) values(3,5,1);
insert into head_count_in_progress(head_count_id,animal_id,counted_by) values(3,2,2);
insert into head_count_in_progress(head_count_id,animal_id,counted_by) values(3,2,1);




