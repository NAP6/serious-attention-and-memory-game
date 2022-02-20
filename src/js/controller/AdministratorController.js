import { Administrator } from '../models/Administrator.js';
import {Group} from '../models/Group.js';

class AdministratorController {
    static getById(id) {
        return new Administrator(1, 'Nicolas Alvarez', null);
    }

    static get_active_adminitrator() {
        return new Administrator(1, 'Nicolas Alvarez', null);
    }

    static get_groups_of(administrator_id) {
        var group_list = [];
        for(var i = 0; i < 6; i++) {
            group_list.push(new Group(i, `Grupo ${i}`, 'des'));
        }
        return group_list;
    }

    static toClass(obj) {
        var admin = new Administrator('', obj.name, obj.image);
        return admin;
    }
    
    static value = true;
    static insert(obj, user_id) {
        this.value = !this.value;
        return this.value;
    }

    static add_to_group(group_id) {
        return true;
    }
}

export { AdministratorController };
