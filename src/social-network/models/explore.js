// Connect to our accounts table and insert a new user record
var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);

exports.viewAll = function(params, callback) {
    var query = 'SELECT username FROM account;';
    var query2 = 'SELECT tags FROM tags;';
    conn.query(query, function(err, result) {
	conn.query(query, function(err, result) {
            callback(err, result);
	});
    });
};

