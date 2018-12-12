var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);

function storeImage(params) {
    return new Promise(function(fulfill, reject) {
        console.log("storeImage params: ", params);
        const {Storage} = require('@google-cloud/storage');
        const storage = new Storage();
        const bucketName = 'ssu-social-network';

        storage.getBuckets().then((results) => {
            const buckets = results[0];
            
            console.log("buckets:");
            buckets.forEach((bucket) => {
                console.log(bucket.name);
            });
        }).catch((err) => {
            console.log('error with buckets', err);
        });
        fulfill();
    });
}

exports.createNewPost = function(params, callback) {
    console.log("new post params:", params);
    console.log("session", params.sess);
    var now = Date.now() / 1000;
    var query = 'INSERT INTO content(user_id, timestamp) VALUES(?)';
    var queryData = [[
        params.sess.user,
        now 
    ]];
    conn.query(query, queryData, function(err, result) {
        
    });
    callback(null, null);
};

exports.getPost = function(params, callback) {
    var query = 'SELECT cn.*, cm.*, t.* FROM content cn, comments cm, tags t WHERE cn.post_id = ? AND cm.post_id = ? AND t.post_id = ?';
    var queryData = [
	params.post_id,
	params.post_id,
	params.post_id,
	params.post_id
    ];
    conn.query(query, queryData, function(err, result) {
        console.log("get post: ",result);
        callback(err, result);
    });
};


exports.changePost = function(params, callback) {
    var query = 'UPDATE comments SET comment = ? WHERE comments.post_id = ?';
    var queryData = [
	params.comment,
	params.post_id
    ];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};


exports.deletePost = function(params, callback) {
    var query = 'DELETE * FROM content cn, comments cm, tags t WHERE cn.user_id = ? AND cn.post_id = ? AND post_id = ? AND t.post_id = ?';
    var queryData = [
	params.user_id,
	params.post_id,
	params.post_id,
	params.post_id,
	params.post_id
    ];
    conn.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};
