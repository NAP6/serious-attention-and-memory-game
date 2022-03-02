import { TMT, TMTLevel, TMTPoint } from '../../../TMT.js';
import { Group } from '../../../Group.js';
import { GroupController } from './GroupContoller.js';
import { post_api } from '../helper_models/post_api.js';

class TMTController {

    static async getById(id) {
        var data = {id: id};
        var res = await post_api(`${window.location.origin}/api/tmt/getById`, data);
        res = await TMTController.toClass(res);
        return res;
    }

    static async getAll() {
        var data = {};
        var res = await post_api(`${window.location.origin}/api/tmt/getAll`, data);
        var tmts = [];
        for(var tmt of res) {
            var tmt_obj = await TMTController.toClass(tmt);
            tmts.push(tmt_obj);
        }
        return tmts;
    }

    static async update(tmt) {
        var data = {tmt: tmt};
        var res = await post_api(`${window.location.origin}/api/tmt/update`, data);
        return res.is_updated;
    }

    static async delete(tmt) {
        var data = {tmt: tmt};
        var res = await post_api(`${window.location.origin}/api/tmt/delete`, data);
        return res.is_deleted;
    }

    static async insert(tmt) {
        var data = {tmt: tmt};
        var res = await post_api(`${window.location.origin}/api/tmt/insert`, data);
        return res;
    }

    static async toClass(obj) {
        var group;
        if(typeof obj.group == "object") {
            group = await GroupController.toClass(obj.group);
        }else {
            var group = await GroupController.getById(obj.group);
        }
        var new_obj = new TMT(obj.id, obj.name, obj.description, group, obj.maximum_attempsts);
        if(obj.levels && obj.levels.length > 0)
            for(let level of obj.levels) {
                var new_level = new TMTLevel(level.image, [], level.label_image);
                for(let point of level.points) {
                    var new_point = new TMTPoint(point.diameter, point.left, point.top, point.ax_left, point.ax_top, point.ax_width, point.ax_heigth);
                    new_level.points.push(new_point);
                    }
                new_obj.levels.push(new_level);
            }
        return new_obj;
    }
}

export { TMTController };
