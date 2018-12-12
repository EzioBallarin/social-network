const PORT = 80;

const env = require('dotenv').config();
if (env.error)
    throw env.error;

var app = require('./app.js');
app.set('port', PORT);
app.listen(PORT);

console.log("listening on port " + PORT + "\n");
