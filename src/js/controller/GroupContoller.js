import { Group } from "../models/Group.js";

class GroupController {

    static getById(id) {
        if(!id) throw(['Se nececita un id']);
        var group = new Group(1, 'Primer Grupo', 'Es un grupo de prueba');
        return group;
    }

    static getAll() {
        var list = [];
        for(var i=0; i < 50; i++) {
            list.push(new Group(i, `Grupo ${i}`, `Descripcion ${i}`));
        }
        return list;
    }

}

export { GroupController };
