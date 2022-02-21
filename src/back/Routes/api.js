import express from "express";
import { LogController } from "../controller/LogController.js";

var api = express.Router();

api.post('/api/login', LogController.login);
api.post('/api/logout', LogController.logout);
api.post('/api/search_email', LogController.search_email);
api.post('/api/register', LogController.register);
api.post('/api/delete', LogController.delete);


export { api };
