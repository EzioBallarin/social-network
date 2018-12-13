var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);
var path = require('path');
var stream = require('stream');
var sharp = require('sharp');

async function storeImage(params) {
    return new Promise(function(fulfill, reject) {
        const {Storage} = require('@google-cloud/storage');
        const storage = new Storage();
        const bucketName = 'ssu-social-network';
        const post = params.post;
        const user = params.user;
        const extension = path.extname(params.image.originalname);
        
        const files = [
            storage.bucket(bucketName).file(user + '/' + post + '_original' + extension),
            storage.bucket(bucketName).file(user + '/' + post + '_thumb' + extension),
            storage.bucket(bucketName).file(user + '/' + post + '_medium' + extension),
            storage.bucket(bucketName).file(user + '/' + post + '_default' + extension)
        ];
        const dimensions = [
            {},
            { width: 161, height: 161 },
            { width: 612, height: 612 },
            { width: 1080, height: 1080}
        ]
        const metadata = {
            contentType: params.image.mimetype
        };
        
        for (const type of files) {
            var imageCopy = new Buffer.alloc(params.image.buffer.length);
            params.image.buffer.copy(imageCopy);
            console.log(type, dimensions[type]); 
            console.log("original image:", params.image.buffer);
            console.log("base buffer: ", imageCopy);
            // Resize the image to be the proper rendition, 
            // then upload it to gcloud storage
            sharp(imageCopy)
            .resize(dimensions[type])
            .toBuffer()
            .then( data => { // data is the converted buffer
                var typeStream = new stream.PassThrough();
                typeStream.end(data);
                typeStream.pipe(files[type].createWriteStream({resumable: false, metadata:metadata})
                .on('error', err => {
                    console.log("Couldn't upload " + params.image.originalname + " " + type);
                    reject(err);
                })
                .on('finish', () => {
                    types[type].makePublic();
                }));
            }).catch( err => {
                console.log("couldn't convert " + params.image.originalname + " " + type);
                reject(err);
            });
            console.log("did i happen after", type);
        }
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
                    var tagsQuery = "INSERT INTO tags(tag) VALUES (?)";
                    var tagsData = [[
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
                                user: params.sess.user,
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
