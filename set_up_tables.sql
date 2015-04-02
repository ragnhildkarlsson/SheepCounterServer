drop table head_count_in_progress;
drop table head_count;
drop table animal_list_animals;
drop table animal_list_access;
drop table animal_list;
drop table family;
drop table animal; 
drop table user;
drop table farm;


create table farm(
id BIGINT NOT NULL AUTO_INCREMENT,
name varchar(128) NOT NULL UNIQUE,
PRIMARY KEY(id)
);

create table animal(
	id BIGINT NOT NULL AUTO_INCREMENT,
	identifier varchar(128) NOT NULL UNIQUE,
	ear_number varchar(64) NOT NULL UNIQUE,
	gender varchar(64) NOT NULL,
	adult TINYINT(1) NOT NULL,
	farm_id BIGINT,
	PRIMARY KEY(id),
	FOREIGN KEY(farm_id) REFERENCES farm(id)
);

create table user(
	id BIGINT NOT NULL AUTO_INCREMENT,
	username varchar(128) NOT NULL UNIQUE,
	PRIMARY KEY(id)
);

create table family(
	id BIGINT NOT NULL AUTO_INCREMENT,
	animal_id BIGINT NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(animal_id) REFERENCES animal(id)
);

create table animal_list(
	id BIGINT NOT NULL UNIQUE AUTO_INCREMENT,
	identifier varchar(128) NOT NULL UNIQUE,
	name varchar(64) NOT NULL,
	farm_id BIGINT NOT NULL,
	created_by BIGINT NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(created_by) REFERENCES user(id),
	FOREIGN KEY(farm_id) REFERENCES farm(id)
);

create table animal_list_access(
	user_id BIGINT NOT NULL,
	animal_list_id BIGINT NOT NULL,
	FOREIGN KEY(user_id) REFERENCES user(id),
	FOREIGN KEY(animal_list_id) REFERENCES animal_list(id)
);

create table animal_list_animals(
	animal_list_id BIGINT NOT NULL,
	animal_id BIGINT NOT NULL,
	FOREIGN KEY(animal_list_id) REFERENCES animal_list(id),
	FOREIGN KEY(animal_id) REFERENCES animal(id)
);

create table head_count(
	id BIGINT NOT NULL UNIQUE AUTO_INCREMENT,
	identifier varchar(128) NOT NULL UNIQUE,
	animal_list_id BIGINT NOT NULL,
	created_by BIGINT NOT NULL,
	start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	stop_time datetime,
	PRIMARY KEY(id),
	FOREIGN KEY(created_by) REFERENCES user(id),
	FOREIGN KEY(animal_list_id) REFERENCES animal_list(id)
);

create table head_count_in_progress(
	head_count_id BIGINT NOT NULL,
	animal_id BIGINT NOT NULL,
	counted_by BIGINT NOT NULL,
	FOREIGN KEY(head_count_id) REFERENCES head_count(id),
	FOREIGN KEY(animal_id) REFERENCES animal(id),
	FOREIGN KEY(counted_by) REFERENCES user(id)
);



ALTER TABLE animal_list
ADD CONSTRAINT unique_names_in_farm UNIQUE (name,farm_id);

ALTER TABLE animal_list_access
ADD CONSTRAINT unique_accessors UNIQUE (user_id,animal_list_id);

ALTER TABLE head_count_in_progress
ADD CONSTRAINT unique_counting_information UNIQUE (head_count_id,animal_id, counted_by);

