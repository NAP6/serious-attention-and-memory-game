import { Group } from "../../models/Group.js";

class GroupController {
    static async getById(id) {
        if(!id) throw(['Se nececita un id']);
        var group = new Group(id, 'Grupo '+id, 'Es un grupo de prueba');
        return group;
    }

    static async getById_external(req, res) {
        var id = req.body.id;
        console.log(id);
        var group = await GroupController.getById(id);
        res.json(group);
    }

    static async getAll(req, res) {
        var list = [];
        for(var i=0; i < 10; i++) {
            list.push(new Group(i, `Grupo ${i}`, `Descripcion ${i}`));
        }
        res.json(list);
    }

    static async update(req, res) {
        var group = req.body.group;
        console.log(group);
        res.json({is_updated: true});
    }

    static async delete(req, res) {
        var group = req.body.group;
        console.log(group);
        res.json({is_deleted: true});
    }

    static async insert(req, res) {
        var group = req.body.group;
        console.log(group);
        res.json({is_inserted: true});
    }
}

export { GroupController };
