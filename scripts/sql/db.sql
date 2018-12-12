-- Courtesy of Jorge Cabrera Mora, as part of our CS 385 Lab 6 
-- https://github.com/jcabmora
-- https://jcabmora.github.io/cs385fa18/labs/lab06/lab06.html
CREATE DATABASE IF NOT EXISTS social DEFAULT CHARACTER SET utf8mb4;

USE social;

CREATE TABLE IF NOT EXISTS account ( 
    id INTEGER NOT NULL AUTO_INCREMENT,
    username CHAR(128) NOT NULL,
    fname CHAR(64) NOT NULL,
    lname CHAR(128) NOT NULL, 
    password CHAR(60) NOT NULL,
    timestamp BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(id),
    UNIQUE KEY(username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sessions (
    session CHAR(36) NOT NULL,
    user_id INTEGER NOT NULL, 
    expiration BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(session),
    FOREIGN KEY(user_id) REFERENCES account(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS content (
    user_id INTEGER NOT NULL,
	post_id INTEGER NOT NULL AUTO_INCREMENT,
	timestamp BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY(post_id),
	FOREIGN KEY(user_id) REFERENCES account(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS comments (
    post_id INTEGER NOT NULL,
	comment CHAR(200) NOT NULL,
	FOREIGN KEY(post_id) REFERENCES content(post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tags (
    post_id INTEGER NOT NULL,
	tag CHAR(200) NOT NULL,
	FOREIGN KEY(post_id) REFERENCES content(post_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS subcriptions (
	user_id INTEGER,
	FOREIGN KEY(user_id) REFERENCES account(id),
	subscription_id INTEGER NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS subscribers (
	user_id INTEGER,
	FOREIGN KEY(user_id) REFERENCES account(id),
	subscriber_id INTEGER NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE USER IF NOT EXISTS 'social'@'%' IDENTIFIED by 'social';

GRANT ALL PRIVILEGES ON social.* to 'social'@'%';

FLUSH PRIVILEGES;
