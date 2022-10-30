import { Administrator } from '../../models/Administrator.js';
import {Group} from '../../models/Group.js';
import { database } from "../database/database.js";
import { save_image } from "../save_image.js";

import { join, dirname  } from "path";
import {fileURLToPath} from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

class AdministratorController {
    static async getById(id) {
        var [rows, fields] = await database.query(`call get_administrator(${id})`);
        if(!rows) return null;
        var administrator = rows[0][0].administrator;
        return AdministratorController.toClass(administrator);
    }

    static toClass(obj) {
        var admin = new Administrator(obj.id, obj.name, obj.image);
        return admin;
    }

    static async get_active_adminitrator(req, res) {
        var admin = req.session.active_user;
        res.json(admin);
    }

    static async get_groups_of(req, res) {
        var administrator_id = req.body.administrator_id;
        var sql = `call get_groups_of_administrator(${administrator_id})`;
        var [rows, fields] = await database.query(sql);
        if(!rows) res.json([]);
        else {
            var groups = rows[0][0].group_list;
            res.json(groups);
        }
    }

    static async insert(req, res) {
        var admin = req.body.admin;
        var user_id = req.body.user_id;
        admin['id'] = user_id;
        if(admin.image && admin.image.length > 0) {
            var decodeBase64 = save_image.decodeBase64(admin.image);
            var path = `/img/${user_id}.${decodeBase64.type.split('/').pop()}`;
            save_image.save(join(__dirname, `../../front/assets${path}`), decodeBase64.data);
            admin.image = path;
        }

        var [rows, fields] = await database.query(`call insert_administrator('${JSON.stringify(admin).replace(/'/g, "\\'")}')`);
        if(!rows) res.json({is_inserted: false});
        else{
            var is_inserted = rows[0][0].result.is_inserted;
            res.json({is_inserted: is_inserted});
        }
    }

    static async add_to_group(req, res) {
        var group_id = req.body.group_id;
        var sql = `call add_administrator_to_a_group(${group_id}, ${req.session.active_user.id})`;
        var [rows, fields] = await database.query(sql);
        if(!rows) res.json({is_added: false});
        else{
            var is_added = rows[0][0].is_added;
            res.json({is_added: is_added?true:false});
        }
    }

    static async get_n_patietns_by_group(req, res) {
        var sql = `call count_patients_by_group(${req.session.active_user.id})`;
        var [rows, fields] = await database.query(sql);
        if(!rows || !rows[0] || !rows[0][0] || !rows[0][0].count) res.json([]);
        else{
            res.json(rows[0][0].count);
        }
    }
}

export { AdministratorController };