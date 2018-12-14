// Connect to our accounts table and insert a new user record
var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);

exports.registerNewUser = function(params, callback) {
    var now = Date.now() / 1000;
    var query = 'INSERT INTO account(username, fname, lname, password, timestamp) VALUES(?)';
    var queryData = [[
        params.email, 
        params.fname, 
        params.lname,
        params.password,
        now 
    ]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.getUser = function(params, callback) {
    var query = 'SELECT password, id FROM account WHERE username = ?';
    var queryData = [[
        params.email
    ]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.deleteUser = function(params, callback) {
    var query = 'DELETE FROM account WHERE username=?';
    var queryData = [[params.email]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.createNewSession = function(params, callback) {
    // Expire a session an hour after login
    var expiration = (Date.now() / 1000) + 3600;
    var query = "INSERT INTO sessions(session, user_id, expiration) VALUES (?)";
    var queryData = [[
        params.uuid,
        params.user_id,
        expiration
    ]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.getSession = function(params, callback) {
    console.log("getsession received:", params);
    var query = "SELECT user_id,expiration FROM sessions WHERE session=?";
    var queryData = [[
        params.uuid
    ]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.deleteSession = function(params, callback) {
    console.log("deletesession received:", params);
    var query = "DELETE FROM sessions WHERE session=?";
    var queryData = [[
        params.uuid
    ]];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
