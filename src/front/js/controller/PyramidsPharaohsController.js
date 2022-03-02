import { PyramidsPharaohs, PPLevel, PPImage } from '../../../PyramidsPharaohs.js';
import { Group } from '../../../Group.js';
import { GroupController } from './GroupContoller.js';
import { post_api } from '../helper_models/post_api.js';

class PyramidsPharaohsController {

    static async getById(id) {
        var data = {id: id};
        var res = await post_api(`${window.location.origin}/api/pdp/getById`, data);
        res = await PyramidsPharaohsController.toClass(res);
        return res;
    }

    static async getAll() {
        var data = {};
        var res = await post_api(`${window.location.origin}/api/pdp/getAll`, data);
        var pdps = [];
        for(let pdp of res) {
            var new_pdp = await PyramidsPharaohsController.toClass(pdp);
            pdps.push(new_pdp);
        }
        return pdps;
    }

    static async update(pdp) {
        var data = {pdp: pdp};
        var res = await post_api(`${window.location.origin}/api/pdp/update`, data);
        return res.is_updated;
    }

    static async delete(pdp) {
        var data = {pdp: pdp};
        var res = await post_api(`${window.location.origin}/api/pdp/delete`, data);
        return res.is_deleted;
    }

    static async insert(pdp) {
        var data = {pdp: pdp};
        var res = await post_api(`${window.location.origin}/api/pdp/insert`, data);
        return res.inserted_id;
    }

    static async toClass(pdp) {
        var group;
        if(typeof pdp.group === 'object') 
            group = await GroupController.toClass(pdp.group);
        else
            group = await GroupController.getById(pdp.group);
        var new_pdp = new PyramidsPharaohs(pdp.id, pdp.name, pdp.description, group, pdp.maximum_attempsts);
        if(pdp.levels && pdp.levels.length > 0) {
            for(let level of pdp.levels) {
                if(level) {
                    var new_level = new PPLevel();
                    if(level.pp_example && level.pp_example.length > 0) {
                        for(let example of level.pp_example) {
                            new_level.example.push(new PPImage(example.image, example.selected));
                        }
                    }
                    if(level.pp_answer && level.pp_answer.length > 0) {
                        for(let answer of level.pp_answer) {
                            new_level.answer.push(new PPImage(answer.image, answer.selected));
                        }
                    }
                    new_pdp.levels.push(new_level);
                }
            }
        }
        return new_pdp;
    }
}

export { PyramidsPharaohsController };
