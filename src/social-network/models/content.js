var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);
var fs = require('fs');

function storeImage(params) {
    return new Promise(function(fulfill, reject) {
        console.log("storeImage params: ", params);
        const {Storage} = require('@google-cloud/storage');
        const storage = new Storage();
        const bucketName = 'ssu-social-network';
        const post = params.post;
        const fileName = params.image.originalname;
        const file = storage.bucket(bucketName).file(fileName);

        fs.createReadStream(params.image.buffer)
          .pipe(file.CreateWriteStream({
            metadata: {
                contentType: params.image.mimetype
            }
           })
          .on('error', err => {
            console.log("Couldn't upload " + fileName + ": ", err);
            reject(err);
          })
          .on('finish', () => {
            file.makePublic().then(() => {
                fulfill();                
            });
          }));

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
        // Fail fast if the insertion didn't go through 
        if (err) {
            console.log("error adding content:", err);
            callback(err, result);
        } else {
            console.log("insert succeeded for", params, ", inserted:", result);
            var postId = result.insertId;
            var commentQuery = "INSERT INTO comments(post_id, comment) VALUES(?)";
            var commentData = [[
                postId,
                params.body.image_desc
            ]];
            conn.query(commentQuery, commentData, function(err, result) {
                if (err) {
                    console.log("error adding comments:", err);
                    callback(err, result);
                } else {
                    console.log("insert succeeded for comments of", postId, "inserted:", result);
                    var tagsQuery = "INSERT INTO tags(post_id, tag) VALUES (?)";
                    var tagsData = [[
                        postId,
                        params.body.image_tags
                    ]];
                    conn.query(tagsQuery, tagsData, function(err, result) {
                        if (err)  {
                            console.log("error adding tags:", err);
                            callback(err, result);
                        } else {
                            console.log("insert succeded for tags of ", postId, "inserted:", result);
                            console.log("pushing image", postId);
                            var storageParams = {
                                post: postId,
                                image: params.file
                            };
                            storeImage(storageParams)
                            .then((result)=>{
                                console.log("pushing to gcloud succeeded");
                                callback(null, result);
                            })
                            .catch((err) => {
                                console.log("error from pushing to gcloud", err); 
                                callback(err, null);
                            });
                        }
                    });
                }
            });
        }
    });
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
