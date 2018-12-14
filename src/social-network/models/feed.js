var mysql = require('mysql');
var db = require('./db_connection');
var conn = mysql.createConnection(db.config);

exports.getFeed= function(params, callback) {
	var query = 'SELECT * FROM subscriptions_user su, subscriptions_tags st WHERE su.user_id=? AND st.user_id=?;';
    console.log("got params to getFeed: ", params);
	var queryData = [
		params.user,
		params.user
	];
    console.log("running: ", query, queryData);
	conn.query(query, queryData, function(err, result) {

        if (err || result.length < 1) {
            console.log("got err", err);
            console.log("got error result", result);
            callback(err, result);
        } else {
            console.log("got regular result: ", result);
            var content= [];
            var query = 'SELECT * FROM content WHERE user_id = ? OR tag = ?;';
            for(var i = 0; i < result.length; i++){
                content.push([result[i].subscription_id, result[i].tag]);
            }
            conn.query(query, [content], function(err, result){
                console.log(query, queryData, result);
                callback(err, result);
            });
        }
	});
};
