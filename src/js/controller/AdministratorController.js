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

    static login(email, password) {
        var is_valid = (email == 'correo@ejemplo.com' && password == '123');
        var res;
        if(is_valid) {
            res = {
                status: 'ok',
                is_valid: is_valid,
                message: ''
            }
        } else {
            res = {
                status: 'error',
                is_valid: is_valid,
                message: 'Usuario no Encontrado'
            }
        }
        return res;
    }
}

export { AdministratorController };
