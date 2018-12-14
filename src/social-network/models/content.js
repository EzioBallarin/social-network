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
		// fit: contain ensures the images is exactly widthxheight, and will
		// pad extra pixels with black (i.e. wide pictures get a black bar
		// on the top and bottom
		// fit: inside gives the image the flexibility to maintain
		// their original aspect ratios
		const dimensions = {
			thumb: { width: 161, height: 161, fit: 'contain'},
			med: { width: 612, height: 612, fit: 'contain' },
			def: { width: 1080, height: 1080, fit: 'contain' }
		}
		const metadata = {
			contentType: params.image.mimetype
		};

		const original = sharp(params.image.buffer);
		const thumbRendition   = original.clone().resize(dimensions.thumb);
		const mediumRendition  = original.clone().resize(dimensions.med);
		const defaultRendition = original.clone().resize(dimensions.def);

		original.toBuffer().then( data => {
			var fileStream = new stream.PassThrough();
			fileStream.end(data);
			fileStream.pipe(files[0].createWriteStream({metadata:metadata}))
				.on('error', err => { 
					console.log("couldn't upload original of " + params.image.originalname);
					reject(err);
				})
				.on('finish', () => {
					files[0].makePublic().then( () => {
						console.log("uploaded original of " + params.image.originalname);
					});
				});
		}).catch( err => { reject(err); });
		thumbRendition.toBuffer().then( data => {
			var fileStream = new stream.PassThrough();
			fileStream.end(data);
			fileStream.pipe(files[1].createWriteStream({metadata:metadata}))
				.on('error', err => { 
					console.log("couldn't upload thumbnail of " + params.image.originalname);
					reject(err);
				})
				.on('finish', () => {
					files[1].makePublic().then( () => {
						console.log("uploaded thumbnail of " + params.image.originalname);
					});
				});
		}).catch( err => { reject(err); });
		mediumRendition.toBuffer().then( data => {
			var fileStream = new stream.PassThrough();
			fileStream.end(data);
			fileStream.pipe(files[2].createWriteStream({metadata:metadata}))
				.on('error', err => { 
					console.log("couldn't upload medium of " + params.image.originalname);
					reject(err);
				})
				.on('finish', () => {
					files[2].makePublic().then( () => {
						console.log("uploaded medium of " + params.image.originalname);
					});
				});
		}).catch( err => { reject(err); });
		defaultRendition.toBuffer().then( data => {
			var fileStream = new stream.PassThrough();
			fileStream.end(data);
			fileStream.pipe(files[3].createWriteStream({metadata:metadata}))
				.on('error', err => { 
					console.log("couldn't upload default of " + params.image.originalname);
					reject(err);
				})
				.on('finish', () => {
					files[3].makePublic().then( () => {
						console.log("uploaded default of " + params.image.originalname);
					});
				});
		}).catch( err => { reject(err); });

		fulfill();

	}); // End of original promise
}

exports.createNewPost = function(params, callback) {

	console.log("new post params:", params);
	console.log("session", params.sess);
	var now = Date.now() / 1000;
	var query = 'INSERT INTO content(user_id, timestamp, description, tag) VALUES(?)';
	var queryData = [[
		params.sess.user,
		now,
		params.body.image_desc,
		params.body.image_tags
	]];
	conn.query(query, queryData, function(err, result) {
		console.log("pushing image", result.insertId);
		var storageParams = {
			user: params.sess.user,
			post: result.insertId,
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
		callback(err, result);
		// delete closing tags if uncommenting block
	});
};



exports.getPost = function(post_id, callback) {
	var query = 'SELECT * FROM content WHERE post_id=(?);';
	var queryData = [[post_id]];
	conn.query(query, queryData, function(err, result) {
		console.log(query, queryData, result);
		callback(err, result);
	});
};


exports.changePost = function(params, callback) {
	var query = 'UPDATE content SET description = ?, tag = ? WHERE post_id = ? AND user_id = ?';
	var queryData = [
		params.body.image_desc,
		params.body.image_tag,
		params.post_id,
		params.sess.user
	];
	console.log("running");
	conn.query(query, queryData, function(err, result) {
		console.log(query, queryData, result);
		callback(err, result);
	});
};


exports.deletePost = function(params, callback) {
	var query = 'DELETE FROM content WHERE post_id = ?';
	var queryData = [
		params.post_id,
	];
	conn.query(query, queryData, function(err, result) {
		callback(err, result);
	});
};


exports.getUserPost = function(params, callback) {
	var query = 'SELECT * FROM content WHERE user_id = (?);';
	var queryData = [[params.sess.user]];
	console.log("Inide of getUserPosts:", query, queryData)
	conn.query(query, queryData, function(err, result) {
		callback(err, result);
	});
};
