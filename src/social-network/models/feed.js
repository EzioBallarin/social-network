var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);

exports.getFeed= function(params, callback) {
	var query = 'SELECT * FROM subscriptions_user su, subscriptions_tag st WHERE su.user_id=?, st.user_id=?;';
	var queryData = [
		params.sess.user,
		params.sess.user
	];
	conn.query(query, queryData, function(err, result) {
		console.log(query, queryData, result);
		var content= [];
		var query = 'SELECT * FROM content WHERE user_id = ? OR tag = ?;';
		for(var i = 0; i < result.length; i++){
			content.push([result[i].subscription_id, result[i].tag]);
		}
		conn.query(query, [content], function(err, result){
			console.log(query, queryData, result);
			callback(err, result);
		});
	});
};

