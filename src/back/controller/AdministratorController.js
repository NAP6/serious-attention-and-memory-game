import { Administrator } from '../../models/Administrator.js';
import {Group} from '../../models/Group.js';
import { database } from "../database/database.js";

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

        var group_list = [];
        for(var i = 0; i < 6; i++) {
            group_list.push(new Group(i, `Grupo ${i}`, 'des'));
        }
        res.json(group_list);
    }

    static async insert(req, res) {
        var admin = req.body.admin;
        var user_id = req.body.user_id;
        admin['id'] = user_id;
        console.log(admin);
        var [rows, fields] = await database.query(`call insert_administrator('${JSON.stringify(admin)}')`);
        if(!rows) res.json({is_inserted: false});
        else{
            var is_inserted = rows[0][0].result.is_inserted;
            res.json({is_inserted: is_inserted});
        }
    }

    static async add_to_group(req, res) {
        var group_id = req.body.group_id;
        console.log(group_id);
        var sql = `call add_administrator_to_a_group(${group_id}, ${req.session.active_user.id})`;
        var [rows, fields] = await database.query(sql);
        if(!rows) res.json({is_added: false});
        else{
            var is_inserted = rows[0][0].result.is_inserted;
            res.json({is_added: is_inserted?true:false});
        }
    }
}

export { AdministratorController };