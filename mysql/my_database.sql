create table if not exists users(
	id int auto_increment primary key,
  username varchar(30) not null UNIQUE,
  pwd varchar(255) not null,
  rol varchar(30) not null,
  first_login tinyInt not null default 1
);

create table if not exists products(
  id int auto_increment primary key,
  code varchar(30) not null UNIQUE,
  name varchar(30) not null,
  description varchar(50) default "",
  stock int default 0,
  image_url varchar(255) default ""
);

create table if not exists tags(
  id int auto_increment primary key,
  name varchar(30) not null UNIQUE
);

create table if not exists properties(
	productid int,
	property varchar(30),
	value varchar(30) default "",
	primary key (productid, property),
    foreign key (productid) references products(id) on delete cascade on update cascade
);

create table if not exists productsTotags(
  productID int,
  tagID int,
  primary key(productID,tagID),
  foreign key (productID) references products(id) on delete cascade on update cascade,
  foreign key (tagID) references tags(id) on delete cascade on update cascade
);

create table if not exists stockVar(
  varID int auto_increment primary key,
  productID int not null,
  varDate date not null,
  quantity int not null,
  foreign key (productID) references products(id) on delete cascade on update cascade
);
