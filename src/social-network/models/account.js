// Connect to our accounts table and insert a new user record
var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);

exports.registerNewUser = function(params, callback) {
    var now = Date.now() / 1000;
    var query = 'INSERT INTO account(username, fname, lname, password, timestamp) VALUES(?)';
    var queryData = [[
        params.ssusn_email, 
        params.ssusn_fname, 
        params.ssusn_lname,
        params.ssusn_password,
        now 
    ]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.deleteUser = function(params, callback) {
    var query = 'DELETE FROM account WHERE account=?';
    var queryData = [[params.ssusn_email]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};