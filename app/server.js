var express = require('express');
var path = require('path');
var app = express();
var root = path.join(__dirname, '..');
app.get('/', function(req, res) {
    res.sendFile(path.join(root, 'app', 'index.html'));
});
app.get(/^(.+)$/, function(req, res) {
    res.sendFile(path.join(root, req.params[0]));
});
app.listen(9001, function() {
    console.log("Listening on " + 9001);
});