// Connect to our accounts table and insert a new user record
var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);

exports.subscribe = function(params, callback) {
    var query = 'INSERT INTO subscriptions(user_id, subscription_id) VALUES(?)';
    var queryData = [[
	params.user_id,
	params.subscription_id
    ]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.viewSubscriptions = function(params, callback) {
    var query = 'SELECT * FROM subscriptions WHERE user_id=?';
    var queryData = [[params.user_id]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.viewSubscribers = function(params, callback) {
    var query = 'SELECT * FROM subscribers WHERE user_id=?';
    var queryData = [[params.user_id]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
