var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);
var storage_conf = {
    projectId: 'ssu-social-network',
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
};

function storeImage(params, callback) {
    console.log("storeImage params: ", params);
    const {Storage} = require('@google-cloud/storage');
    const storage = new Storage(storage_conf);
    const bucketName = 'ssu-social-network';
    //await storage.bucket(bucketName).upload(

    const buckets = storage.getBuckets();
    buckets.then((results) => {
        const buckets = results[0];

        console.log('Buckets:');
        buckets.forEach((bucket) => {
            console.log(bucket.name);
        });
    }).catch((err) => {
        console.error('Error:', err);
    });
    callback(null, null);
}

exports.createNewPost = function(params, callback) {
    var now = Date.now() / 1000;
    var query = 'INSERT INTO content(user_id, post_id, timestamp) VALUES(?)';
    var queryData = [[
	0,
	1,
	now
    ]];
    /*
    storeImage(params, function(err, result) {
        conn.query(query, queryData, function(err, result) {
            console.log("what content did i jus add", result);
            var post_id = result.post_id;
            var query = 'INSERT INTO images(post_id, image) VALUES(?)';
            var queryData = [[
                post_id,
                params.image_org
                
            ]];
            conn.query(query, queryData, function(err, result){
                 
                var query = 'INSERT INTO comments(post_id, comment) VALUES(?)';
                var queryData = [[
                    post_id,
                    params.comment
                ]];
                conn.query(query, queryData, function(err, result) {
                    var query = 'INSERT INTO tags(post_id, tag) VALUES(?)';
                    var queryData = [[
                        post_id,
                        tag
                    ]];
                    conn.query(query, queryData, function(err, result) {
                        callback(err, result);
                    });
                });
            });
        });
    });
    */
    storeImage(params, function(err, result) {
        callback(err, result);
    });
};

exports.getPost = function(params, callback) {
    var query = 'SELECT cn.*, i.*, cm.*, t.* FROM content cn, images i, comments cm, tags t WHERE cn.post_id = ? AND i.post_id = ? AND cm.post_id = ? AND t.post_id = ?';
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
    var query = 'DELETE * FROM content cn, images i, comments cm, tags t WHERE cn.user_id = ?, AND cn.post_id = ? AND i.post_id = ?, AND post_id = ?, AND t.post_id = ?';
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
