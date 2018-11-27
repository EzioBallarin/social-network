const PORT = 80;

var app = require('./app.js');
app.set('port', PORT);
app.listen(PORT);

console.log("listening on port " + PORT + "\n");
