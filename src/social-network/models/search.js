// Connect to our accounts table and insert a new user record
var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);

exports.viewAll = function(params, callback) {
    var query = 'SELECT c.*, a.username FROM content c LEFT JOIN account a ON ' +
	'c.user_id = a.id WHERE c.description=(?) OR c.tag=(?);';
    var queryData = [
	params['search_data'],
	params['search_data']
    ];
    conn.query(query, queryData, function(err, result) {
	console.log(query, queryData, err, result);
        callback(err, result);
    });
};

