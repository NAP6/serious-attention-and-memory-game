import { TMT } from '../models/TMT.js';
import { Group } from '../models/Group.js';
import { GroupController } from './GroupContoller.js';

class TMTController {

    static getById(id) {
        if(!id) throw(['Se nececita un id']);
        var group = new TMT(1, 'Primer juego TMT', 'Es un grupo de prueba', 'El grupo');
        return group;
    }

    static getAll() {
        var list = [];
        for(var i=0; i < 5; i++) {
            list.push(new TMT(i, `TMT ${i}`, `Descripcion ${i}`, new Group(i, 'Grupo '+i, 'Des')));
        }
        return list;
    }

    static aux_alertar = false;
    static update(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static delete(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static insert(obj) {
        this.aux_alertar = !this.aux_alertar;
        return this.aux_alertar;
    }

    static toClass(obj) {
        var group = GroupController.getById(obj.group);
        var new_obj = new TMT(obj.id, obj.name, obj.description, group, obj.maximum_attempsts);
        if(obj.levels && obj.levels.length > 0)
            new_obj.levels = obj.levels;
        return new_obj;
    }
}

export { TMTController };
