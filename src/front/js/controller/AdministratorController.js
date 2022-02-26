import { Administrator } from '../../../Administrator.js';
import { GroupController } from './GroupContoller.js';
import { post_api } from '../helper_models/post_api.js';

class AdministratorController {
    static async toClass(obj) {
        var admin = new Administrator(obj.id, obj.name, obj.image);
        return admin;
    }

    static async get_active_adminitrator() {
        var data = {};
        var res = await post_api(`${window.location.origin}/api/administrator/get_active_adminitrator`, data);
        res = await AdministratorController.toClass(res);
        console.log(res);
        return res;
    }

    static async get_groups_of(administrator_id) {
        console.log(administrator_id);
        var data = {administrator_id: administrator_id};
        var res = await post_api(`${window.location.origin}/api/administrator/get_groups_of`, data);
        res = res.map((g) => { return GroupController.toClass(g); });
        console.log(res);
        return res;
    }
    
    static async insert(admin, user_id) {
        var data = {admin: admin, user_id: user_id};
        var res = await post_api(`${window.location.origin}/api/administrator/insert`, data);
        return res.is_inserted;
    }

    static async add_to_group(group_id) {
        var data = {group_id: group_id};
        var res = await post_api(`${window.location.origin}/api/administrator/add_to_group`, data);
        return res.is_added;
    }
}

export { AdministratorController };
