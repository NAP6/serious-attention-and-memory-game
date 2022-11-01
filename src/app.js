'use strict';

import { join, dirname  } from "path";
import {fileURLToPath} from 'url';
import { Server } from "./back/Server.js";
import { Router } from "./back/Routes/routes.js";
import { api } from "./back/Routes/api.js";
import { init_socket_chanels } from "./back/Routes/socket.js";
import { database } from "./back/database/database.js";
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config();

var DB_HOST = process.env.DB_HOST || 'localhost';
var DB_PORT = process.env.DB_PORT || '3306';
var DB_NAME = process.env.DB_NAME || 'serious_game';
var DB_USER = process.env.DB_USER || 'root';
var DB_PASS = process.env.DB_PASS || 'root';

var PORT = 80;
var MODELS_PATH = join(__dirname, 'models');
var FRONT_PATH = join(__dirname, 'front');
var FRONT_ASSETS_PATH =FRONT_PATH + '/assets';
var router = Router(FRONT_PATH);

database.set_parameters(DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME);
var server = new Server(PORT, [MODELS_PATH, FRONT_ASSETS_PATH], [router, api], true);
init_socket_chanels(server);
server.start();
