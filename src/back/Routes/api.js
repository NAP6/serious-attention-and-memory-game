import express from "express";
import { LogController } from "../controller/LogController.js";
import { AdministratorController } from "../controller/AdministratorController.js";
import { PatientController } from "../controller/PatientContoller.js";
import { GroupController } from "../controller/GroupContoller.js";
import { TMTController } from "../controller/TMTController.js";
import { PyramidsPharaohsController } from "../controller/PyramidsPharaohsController.js";
import { MatchCrontroller } from "../controller/MatchController.js";

var api = express.Router();

// Log Controller
api.post('/api/login', LogController.login);
api.post('/api/logout', LogController.logout);
api.post('/api/search_email', LogController.search_email);
api.post('/api/register', LogController.register);
api.post('/api/delete', LogController.delete);

// Administrator Controller
api.post('/api/administrator/get_active_adminitrator', AdministratorController.get_active_adminitrator);
api.post('/api/administrator/get_groups_of', AdministratorController.get_groups_of);
api.post('/api/administrator/insert', AdministratorController.insert);
api.post('/api/administrator/add_to_group', AdministratorController.add_to_group);
api.post('/api/administrator/get_n_patietns_by_group', AdministratorController.get_n_patietns_by_group);

// Patient Controller
api.post('/api/patient/get_active_patient', PatientController.get_active_patient);
api.post('/api/patient/getAll', PatientController.getAll);
api.post('/api/patient/get_list_of_groups', PatientController.get_list_of_groups);
api.post('/api/patient/update', PatientController.update);
api.post('/api/patient/delete', PatientController.delete);
api.post('/api/patient/insert', PatientController.insert);
api.post('/api/patient/get_pending_games', PatientController.get_pending_games);
api.post('/api/patient/add_to_group', PatientController.add_to_group);

// Group Controller
api.post('/api/group/getById', GroupController.getById_external);
api.post('/api/group/getAll', GroupController.getAll);
api.post('/api/group/update', GroupController.update);
api.post('/api/group/delete', GroupController.delete);
api.post('/api/group/insert', GroupController.insert);

// TMT Controller
api.post('/api/tmt/getById', TMTController.getById_external);
api.post('/api/tmt/getAll', TMTController.getAll);
api.post('/api/tmt/update', TMTController.update);
api.post('/api/tmt/delete', TMTController.delete);
api.post('/api/tmt/insert', TMTController.insert);

// Pyramids and Pharaohs Controller
api.post('/api/pdp/getById', PyramidsPharaohsController.getById_external);
api.post('/api/pdp/getAll', PyramidsPharaohsController.getAll);
api.post('/api/pdp/update', PyramidsPharaohsController.update);
api.post('/api/pdp/delete', PyramidsPharaohsController.delete);
api.post('/api/pdp/insert', PyramidsPharaohsController.insert);

// Match Controller
api.post('/api/match/get_by_patient', MatchCrontroller.get_by_patient);
api.post('/api/match/update', MatchCrontroller.update);
api.post('/api/match/insert', MatchCrontroller.insert);

// Export the router
export { api };
