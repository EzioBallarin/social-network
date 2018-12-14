// Connect to our accounts table and insert a new user record
var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);

exports.subscribe = function(params, callback) {
    var query = 'INSERT INTO subscriptions(user_id, subscription_id) VALUES(?);';
    var queryData = [[
	params.user_id,
	params.subscription_id
    ]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.viewSubscriptions = function(params, callback) {
    var query = 'SELECT a.username FROM account a LEFT JOIN subscriptions_user s on ' +
	' s.subscription_id = a.id WHERE s.user_id=(?);';
    var queryData = [params.sess.user];
    console.log(query, queryData, err);
    conn.query(query, queryData, function(err, result) {
	console.log(query, err, result);
        callback(err, result);
    });
};

exports.viewSubscribers = function(user_id, callback) {
    var query = 'SELECT a.username FROM account a LEFT JOIN subscribers s on ' +
        ' s.subscriber_id = a.id WHERE s.user_id=(?);';
    conn.query(query, user_id, function(err, result) {
	console.log(query, err, result);
        callback(err, result);
    });
};
