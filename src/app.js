'use strict';

import { join, dirname  } from "path";
import {fileURLToPath} from 'url';
import { Server } from "./back/Server.js";
import { Router } from "./back/Routes/routes.js";
import { api } from "./back/Routes/api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

var PORT = 3000;
var STATIC = join(__dirname, 'front');
var router = Router(STATIC);

var server = new Server(PORT, STATIC, router, api);
server.start();




// simple express server
//var express = require('express');

//var app = express();
//var router = express.Router();

//app.use(express.static(path.join(__dirname, 'front')));
//app.get('/', function(req, res) {
    //res.sendfile('index.html');
//});

//app.listen(3000);
