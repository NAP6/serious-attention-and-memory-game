import { Patient } from "../../models/Patient.js";
import { Group } from "../../models/Group.js";
import { TMTController } from "./TMTController.js";
import { PyramidsPharaohsController } from "./PyramidsPharaohsController.js";
import { database } from "../database/database.js";
import { save_image } from "../save_image.js";

import { join, dirname  } from "path";
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

class PatientController {
    static async getById(id) {
        var [rows, fields] = await database.query(`call get_patient(${id})`);
        if(!rows) return null;
        var patient = rows[0][0].patient;
        return PatientController.toClass(patient);
    }

    static toClass(obj) {
        var patient = new Patient(obj.id, obj.passport, obj.name, obj.age, obj.gender, obj.schooling, obj.residence, obj.country_of_study, obj.image);
        return patient;
    }

    static async get_active_patient(req, res) {
        var patient = req.session.active_user;
        res.json(patient);
    }

    static async getAll(req, res) {
        var admin_id = req.session.active_user.id;
        var sql = `call bring_patients_from_an_administrator(${admin_id})`;
        var [rows, fields] = await database.query(sql);
        if(!rows || !rows[0][0].patients) res.json([]);
        else{
            var patients = rows[0][0].patients;
            console.log(patients);
            res.json(patients);
        }
    }

    static async get_list_of_groups(req, res) {
        var patient_id = req.body.patient_id;
        console.log(patient_id);
        var sql = `call get_groups_of_patient(${patient_id})`;
        var [rows, fields] = await database.query(sql);
        if(!rows) res.json([]);
        else {
            var groups = rows[0][0].group_list;
            res.json(groups);
        }
    }

    static async update(req, res) {
        var patient = req.body.patient;
        console.log(patient);
        var [rows, fields] = await database.query(`call update_patient('${JSON.stringify(patient)}')`);
        if(!rows) res.json({is_updated: false});
        else{ 
            var is_updated = rows[0][0].is_updated;
            res.json({is_updated: true});
        }
    }

    static async delete(req, res) {
        console.log('Entra en delete')
        var patient = req.body.patient;
        var [rows, fields] = await database.query(`call delete_patient(${patient.id})`);
        if(!rows) res.json({is_deleted: false});
        else {
            var is_deleted = rows[0][0].is_deleted;
            res.json({is_deleted: is_deleted});
        }
    }

    static async insert(req, res) {
        var patient = req.body.patient;
        var user_id = req.body.user_id;
        var group_code = req.body.group_code;
        patient.id = user_id;
        console.log(patient);
        console.log(group_code);
        if(patient.image && patient.image.length > 0) {
            var decodeBase64 = save_image.decodeBase64(patient.image);
            var path = `/img/${user_id}.${decodeBase64.type.split('/').pop()}`;
            save_image.save(join(__dirname, `../../front/assets${path}`), decodeBase64.data);
            patient.image = path;
        }
        
        var [rows, fields] = await database.query(`call insert_patient('${JSON.stringify(patient)}')`);
        if(!rows) res.json({is_inserted: false});
        else{
            var sql = `call add_patient_to_a_group(${group_code.split('-').pop()}, ${user_id})`;
            var [_, fields] = await database.query(sql);
            var is_inserted = rows[0][0].is_inserted;
            res.json({is_inserted: is_inserted});
        }
    }

    static async get_pending_games(req, res) {
        var patient_id = req.body.patient_id;
        console.log(patient_id);
        var sql_tmt = `call pending_tmt_games_of_patient(${patient_id})`;
        var sql_pdp = `call pending_pdp_games_of_patient(${patient_id})`;
        var tmts = [];
        var pdps = [];

        var [rows_tmt, fields] = await database.query(sql_tmt);
        var [rows_pdp, fields] = await database.query(sql_pdp);
        if(rows_tmt && rows_tmt[0] && rows_tmt[0][0] && rows_tmt[0][0].tmts)
            tmts = rows_tmt[0][0].tmts;
        if(rows_pdp && rows_pdp[0] && rows_pdp[0][0] && rows_pdp[0][0].pdps)
            pdps = rows_pdp[0][0].pdps;

        res.json({tmts: tmts, pdps: pdps});
    }

    static async add_to_group(req, res) {
        var group_id = req.body.group_id;
        console.log(group_id);
        var sql = `call add_patient_to_a_group(${group_id}, ${req.session.active_user.id})`;
        var [rows, fields] = await database.query(sql);
        if(!rows) res.json({is_added: false});
        else{
            var is_added = rows[0][0].is_added;
            res.json({is_added: is_added?true:false});
        }
    }
}

export { PatientController };
