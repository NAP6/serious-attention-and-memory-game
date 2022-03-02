import { Group } from "../../models/Group.js";
import { database } from "../database/database.js";

class GroupController {
    static async getById(id) {
        var [rows, fields] = await database.query(`call get_group('${id}')`);
        if(!rows) return null;
        else {
            var group = rows[0][0].group;
            return GroupController.toClass(group);
        }
    }

    static async toClass(group) {
        var group_class = new Group(group.id, group.name, group.description);
        return group_class;
    }

    static async getById_external(req, res) {
        var id = req.body.id;
        var group = await GroupController.getById(id);
        res.json(group);
    }

    static async getAll(req, res) {
        var user = req.session.active_user;
        var is_admin = req.session.user_type == 'Administrator';
        var sql ='';
        if(is_admin) 
            sql = `call get_groups_of_administrator(${user.id})`;
        else
            sql = `call get_groups_of_patient(${user.id})`;
        
        var [rows, fields] = await database.query(sql);
        if(!rows) res.json([]);
        else {
            var groups = rows[0][0].group_list;
            res.json(groups);
        }
    }

    static async update(req, res) {
        var group = req.body.group;
        var [rows, fields] = await database.query(`call update_group('${JSON.stringify(group)}')`);
        if(!rows) res.json({is_updated: false});
        else{ 
            var is_updated = rows[0][0].is_updated;
            res.json({is_updated: true});
        }
    }

    static async delete(req, res) {
        var group = req.body.group;
        var [rows, fields] = await database.query(`call delete_group(${group.id})`);
        if(!rows) res.json({is_deleted: false});
        else {
            var is_deleted = rows[0][0].is_deleted;
            res.json({is_deleted: is_deleted});
        }
    }

    static async insert(req, res) {
        var group = req.body.group;
        var [rows, fields] = await database.query(`call insert_group('${JSON.stringify(group)}')`);
        if(!rows) res.json({is_inserted: false});
        else {
            var inserted_id = rows[0][0].inserted_id;
            if(req.session.user_type == 'Administrator') {
                var sql = `call add_administrator_to_a_group(${inserted_id}, ${req.session.active_user.id})`;
                var [rows, fields] = await database.query(sql);
            } else {
                var sql = `call add_patient_to_a_group(${inserted_id}, ${req.session.active_user.id})`;
                var [rows, fields] = await database.query(sql);

            }
            res.json({is_inserted: inserted_id? true: false, inserted_id: inserted_id});
        }
    }
}

export { GroupController };
