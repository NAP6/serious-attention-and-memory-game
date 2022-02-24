import { Group } from "../../../Group.js";
import { post_api } from "../helper_models/post_api.js";

class GroupController {
    static async getById(id) {
        var data = {id: id};
        var res = await post_api(`${window.location.origin}/api/group/getById`, data);
        res = GroupController.toClass(res);
        console.log(res);
        return res;
    }

    static async getAll() {
        var data = {};
        var res = await post_api(`${window.location.origin}/api/group/getAll`, data);
        if(res)
        res = res.map((g) => { return GroupController.toClass(g); });
        else res = [];
        console.log(res);
        return res;
    }

    static async update(group) {
        var data = {group: group};
        var res = await post_api(`${window.location.origin}/api/group/update`, data);
        return res.is_updated;
    }

    static async delete(group) {
        var data = {group: group};
        var res = await post_api(`${window.location.origin}/api/group/delete`, data);
        return res.is_deleted;
    }

    static async insert(group) {
        var data = {group: group};
        var res = await post_api(`${window.location.origin}/api/group/insert`, data);
        return res.inserted_id;
    }

    static toClass(obj) {
        var group = new Group(obj.id, obj.name, obj.description);
        return group;
    }
}

export { GroupController };
