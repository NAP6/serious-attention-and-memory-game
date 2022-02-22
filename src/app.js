'use strict';

import { join, dirname  } from "path";
import {fileURLToPath} from 'url';
import { Server } from "./back/Server.js";
import { Router } from "./back/Routes/routes.js";
import { api } from "./back/Routes/api.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

var PORT = 3000;
var MODELS_PATH = join(__dirname, 'models');
var FRONT_PATH = join(__dirname, 'front');
var FRONT_ASSETS_PATH =FRONT_PATH + '/assets';
var router = Router(FRONT_PATH);

var server = new Server(PORT, [MODELS_PATH, FRONT_ASSETS_PATH], [router, api]);
server.start();
