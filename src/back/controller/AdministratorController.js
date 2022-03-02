import { Administrator } from '../../models/Administrator.js';
import {Group} from '../../models/Group.js';

class AdministratorController {
    static async getById(id) {
        return new Administrator(1, 'Nicolas Alvarez', null);
    }

    static toClass(obj) {
        var admin = new Administrator('', obj.name, obj.image);
        return admin;
    }

    static async get_active_adminitrator(req, res) {
        var admin = new Administrator(1, 'Nicolas Alvarez', null);
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
        console.log(admin);
        console.log(user_id);

        res.json({is_inserted: true});
    }

    static async add_to_group(req, res) {
        var group_id = req.body.group_id;
        console.log(group_id);
        res.json({is_added: true});
    }
}

export { AdministratorController };