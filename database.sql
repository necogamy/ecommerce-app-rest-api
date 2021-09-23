CREATE DATABASE ecommerce_database;

--\l  - checkout if the db was created
--\c ecommerce_database  - enter to the database

CREATE TABLE user_data (
    id integer PRIMARY KEY,
    password varchar(20),
    username varchar(20) UNIQUE
);

CREATE TABLE order_data (
    user_id integer REFERENCES user_data(id),
    total_items integer,
    total_price money,
    date date
);

CREATE TABLE user_cart (
    user_id integer REFERENCES user_data(id),
    product_id integer REFERENCES product(id),
    quantity integer,
    PRIMARY KEY (user_id, product_id)
);

CREATE TABLE product (
    id integer UNIQUE,
    product_name varchar(20) UNIQUE,
    price money,
    quantity integer
);