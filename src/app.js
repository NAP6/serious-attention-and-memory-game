'use strict';

// simple express server
var express = require('express');
const path = require('path');

var app = express();
var router = express.Router();

app.use(express.static(path.join(__dirname, 'front')));
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.listen(3000);
